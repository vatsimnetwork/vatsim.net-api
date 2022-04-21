export interface DataFeedPilotFlightPlan {
	aircraft_short: string;
	departure: string;
	arrival: string;
}

interface DataFeedPilot {
	callsign: string;
	flight_plan?: DataFeedPilotFlightPlan;
	logon_time: string;
}

export default DataFeedPilot;
