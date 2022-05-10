import shuffleMapPilots from "./shuffleMapPilots";

const stubArr = {
  icao: "KRDU",
  lat: 1234,
  lon: 1234,
};

const stubDep = {
  icao: "KCLT",
  lat: 1234,
  lon: 1234,
};

const stubPilots = [
  {
    callsign: "test-1",
    aircraft: "aircraft-1",
    logontime: "2022-01-01 12:00:00",
    dep: stubDep,
    arr: stubArr,
    distance: 1000,
  },
  {
    callsign: "test-2",
    aircraft: "aircraft-2",
    logontime: "2022-01-01 12:00:00",
    dep: stubDep,
    arr: stubArr,
    distance: 1000,
  },
  {
    callsign: "test-3",
    aircraft: "aircraft-3",
    logontime: "2022-01-01 12:00:00",
    dep: stubDep,
    arr: stubArr,
    distance: 1000,
  },
];

describe("shuffleMapPilots", () => {
  test("Expect length of arrays to be equal", () => {
    const result = shuffleMapPilots(stubPilots);
    expect(result.length).toEqual(stubPilots.length);
  });

  test("Expect all callsigns to be present", () => {
    const shuffledPilots = shuffleMapPilots(stubPilots);
    const shuffledCallsigns = shuffledPilots.map((pilot) => pilot.callsign);
    const callsigns = stubPilots.map((pilot) => pilot.callsign);
    const test = shuffledCallsigns.every((sign) => callsigns.includes(sign));
    expect(test).toBeTruthy();
  });
});
