import Airport from './airport';

class Pilot {
    public callsign: string;
    public aircraft: string;
    public logontime: string;
    public dep: Airport;
    public arr: Airport;
    public distance: number;
}

export default Pilot;