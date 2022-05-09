import express from 'express';
import cors from 'cors';
import axios from 'axios';
import NetworkStatus from './classes/NetworkStatus';
import Pilot from './classes/Pilot';
import VatsimEvent from './classes/Event';
import Airport from './classes/Airport';
import { db } from './services/Database';
import Route from './classes/Route';
import DataFeedPilot from './interfaces/DataFeedPilot';
import { MyVatsimEvent } from './interfaces/MyVatsimEvents';

const app = express();
app.use(cors(
	{
		origin: [
			'http://localhost:3000',
			'https://phoenix.vatsim.dev',
			'https://vatsim.net',
		],
	},
));
const host = '0.0.0.0';
const port = 3333;

app.get('/', async (req: express.Request, res: express.Response) => {
	res.send('VATSIM Website API Index');
});

app.get('/aircraft', AircraftResponse);
app.get('/events', EventsResponse);
app.get('/network-status', NetworkStatusResponse);

// tslint:disable-next-line:no-console
app.listen(port, host, () => console.log(`Server listening on port ${port}!`));

async function AircraftResponse(req: express.Request, res: express.Response) {
	const data = await GetAircraft();
	res.set('Cache-Control', 'public, max-age=600');
	res.json(data);
}

async function EventsResponse(req: express.Request, res: express.Response) {
	const data = await GetEvents();
	res.set('Cache-Control', 'public, max-age=600');
	res.json(data);
}

async function NetworkStatusResponse(req: express.Request, res: express.Response) {
	const data = await GetStatusData();
	res.set('Cache-Control', 'public, max-age=60');
	res.json(data);
}

async function GetAircraft() {
	let data: Pilot[] = [];
	await axios.get('https://data.vatsim.net/v3/vatsim-data.json').then(async (resp) => {
		let networkPilots: DataFeedPilot[] = [];
		const flightMapPilots: Pilot[] = [];

		const response = resp.data;
		networkPilots = response.pilots;

		networkPilots = networkPilots.filter((pilot: DataFeedPilot) => pilot.flight_plan
          && pilot.flight_plan.departure
          && pilot.flight_plan.arrival
          && pilot.flight_plan.aircraft_short);

		const forLoop = async () => {
			for (const pilot of networkPilots) {
				const fmd = await ComputeFlightMapData(pilot);
				if (fmd && fmd.distance <= 3500) {
					flightMapPilots.push(fmd);
				}
			}
		};

		await forLoop();

		const prefixesBusyRegions = ['C', 'K', 'E', 'L', 'B', 'U'];

		let nonBusyRegions = flightMapPilots.filter((pilot: Pilot) => prefixesBusyRegions.includes(pilot.dep.icao.substring(0, 1)));

		let busyRegions = flightMapPilots.filter((pilot: Pilot) => !prefixesBusyRegions.includes(pilot.dep.icao.substring(0, 1)));

		nonBusyRegions = ShuffleMapPilots(nonBusyRegions).slice(0, 50);
		busyRegions = ShuffleMapPilots(busyRegions).slice(0, 100 - nonBusyRegions.length);

		data = data.concat(busyRegions, nonBusyRegions);
	});
	return data;
}

async function GetEvents() {
	let events: VatsimEvent[] = [];
	await axios.get('https://my.vatsim.net/api/v1/events/all').then(async (resp) => {
		let networkEvents: MyVatsimEvent[] = [];

		const response = resp.data;
		networkEvents = response.data;

		const forLoop = async () => {
			for (const networkEvent of networkEvents) {
				if (networkEvent.airports.length > 0 && networkEvent.type === 'Event') {
					const event = new VatsimEvent();
					event.id = networkEvent.id;
					event.name = networkEvent.name;
					event.startTime = networkEvent.start_time;
					event.endTime = networkEvent.end_time;
					event.shortDescription = networkEvent.short_description;
					event.description = networkEvent.description;
					event.bannerLink = networkEvent.banner;

					event.airports = [];
					for (const networkEventAirport of networkEvent.airports) {
						const airport = await GetAirportData(networkEventAirport.icao.toUpperCase());
						if (airport) {
							event.airports.push(airport);
						}
					}

					event.routes = [];
					for (const networkEventRoute of networkEvent.routes) {
						const route = new Route();
						route.dep = networkEventRoute.departure;
						route.arr = networkEventRoute.arrival;
						route.route = networkEventRoute.route;
						event.routes.push(route);
					}

					events.push(event);
				}
			}
		};

		await forLoop();

		events = events.sort((a: VatsimEvent, b: VatsimEvent) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
	});
	return events;
}

async function GetStatusData() {
	const networkStatus: NetworkStatus = new NetworkStatus();
	try {
		await axios.get('https://network-status.vatsim.net/api/v2/status.json').then((resp) => {
			const response = resp.data;
			networkStatus.setIndicator(response.status.indicator);
			networkStatus.setDescription(response.status.description);
		});
	} catch {
		networkStatus.setIndicator('none');
		networkStatus.setDescription('All Systems Operational');
	}

	return networkStatus;
}

async function ComputeFlightMapData(pilot: DataFeedPilot) {
	const dep = await GetAirportData(pilot.flight_plan.departure.toUpperCase());
	const arr = await GetAirportData(pilot.flight_plan.arrival.toUpperCase());

	if (dep && arr) {
		const fmd = new Pilot();
		fmd.callsign = pilot.callsign;
		fmd.aircraft = pilot.flight_plan.aircraft_short;
		fmd.logontime = pilot.logon_time;
		fmd.dep = dep;
		fmd.arr = arr;
		fmd.distance = GreatCircleDistance(dep.lat, dep.lon, arr.lat, arr.lon);

		return fmd;
	}
	return null;
}

async function GetAirportData(icao: string) : Promise<Airport> {
  const [results] = await db.promise().query('SELECT * FROM `airports` WHERE `icao` = ? limit 0, 1', [icao]);
  const rows: any = results;
  if (rows.length === 1) {
    const row = rows[0];
    const airport = new Airport();
    airport.icao = icao;
    airport.lat = row.lat;
		airport.lon = row.lon;
		return airport;
	}
	return null;
}

function GreatCircleDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
	const radius = 6371; // Radius of the Earth in km.
	lat1 = DegreesToRadians(lat1);
	lon1 = DegreesToRadians(lon1);
	lat2 = DegreesToRadians(lat2);
	lon2 = DegreesToRadians(lon2);

	const lat = lat2 - lat1;
	const lon = lon2 - lon1;

	const h = Math.sin(lat / 2) * Math.sin(lat / 2)
          + Math.cos(lat1) * Math.cos(lat2)
          * Math.sin(lon / 2) * Math.sin(lon / 2);

	return 2 * radius * Math.asin(Math.sqrt(h));
}

function DegreesToRadians(degrees: number) {
	return degrees * Math.PI / 180.0;
}

function ShuffleMapPilots(a: Pilot[]) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
