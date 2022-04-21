export interface MyVatsimEventOrganiser {
	region: string;
	division: string;
	subdivision?: string;
	organised_by_vatsim: boolean;
}

export interface MyVatsimEventAirport {
	icao: string;
}

export interface MyVatsimEventRoute {
	departure: string;
	arrival: string;
	route: string;
}

export interface MyVatsimEvent {
	id: number;
	type: string;
	vso_name?: string;
	name: string;
	link: string;
	organisers: MyVatsimEventOrganiser[];
	airports: MyVatsimEventAirport[];
	routes: MyVatsimEventRoute[];
	start_time: Date;
	end_time: Date;
	short_description: string;
	description: string;
	banner: string;
}

interface MyVatsimEvents {
	data: MyVatsimEvent[];
}

export default MyVatsimEvents;
