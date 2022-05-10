import Airport from "./Airport.type";
import Route from "./Route.type";

type Event = {
  id: number;
  name: string;
  startTime: Date;
  endTime: Date;
  shortDescription: string;
  description: string;
  bannerLink: string;
  airports: Airport[];
  routes: Route[];
};

export default Event;
