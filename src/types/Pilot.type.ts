import Airport from "./Airport.type";

type Pilot = {
  callsign: string;
  aircraft: string;
  logontime: string;
  dep: Airport;
  arr: Airport;
  distance: number;
};

export default Pilot;
