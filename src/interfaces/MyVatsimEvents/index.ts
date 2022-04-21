export interface MyVatsimEventOrganiser {
    region: string;
    division: string;
    subdivision?: any;
    organised_by_vatsim: boolean;
}

export interface MyVatsimEventAirport {
    icao: string;
}


interface MyVatsimEvent {
    id: number;
    type: string;
    vso_name?: any;
    name: string;
    link: string;
    organisers: MyVatsimEventOrganiser[];
    airports: MyVatsimEventAirport[];
    routes: any[];
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