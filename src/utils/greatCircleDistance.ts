import degreesToRadians from "./degreesToRadians";

const greatCircleDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const radius = 6371; // Radius of the Earth in km.
  lat1 = degreesToRadians(lat1);
  lon1 = degreesToRadians(lon1);
  lat2 = degreesToRadians(lat2);
  lon2 = degreesToRadians(lon2);

  const lat = lat2 - lat1;
  const lon = lon2 - lon1;

  const h =
    Math.sin(lat / 2) * Math.sin(lat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(lon / 2) * Math.sin(lon / 2);

  return 2 * radius * Math.asin(Math.sqrt(h));
};

export default greatCircleDistance;
