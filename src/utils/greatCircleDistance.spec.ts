import greatCircleDistance from "./greatCircleDistance";

describe("greatCircleDistance", () => {
  test("KRDU > KMDW", () => {
    const KRDU = {
      lat: 35.5241,
      lon: 78.4712,
    };

    const KMDW = {
      lat: 41.4712,
      lon: 87.456,
    };

    const result = greatCircleDistance(KRDU.lat, KRDU.lon, KMDW.lat, KMDW.lon);
    expect(result).toEqual(1023.0311457003886);
  });

  test("LPPT > KLAX", () => {
    const LPPT = {
      lat: 38.7788,
      lon: -9.13519,
    };

    const KLAX = {
      lat: 33.9431,
      lon: -118.409,
    };

    const result = greatCircleDistance(LPPT.lat, LPPT.lon, KLAX.lat, KLAX.lon);
    expect(result).toEqual(9136.835474531645);
  });
});
