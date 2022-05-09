import Airport from "../Airport";
import Route from "../Route";

class Event {
  public id: number;
  public name: string;
  public startTime: Date;
  public endTime: Date;
  public shortDescription: string;
  public description: string;
  public bannerLink: string;
  public airports: Airport[];
  public routes: Route[];
}

export default Event;
