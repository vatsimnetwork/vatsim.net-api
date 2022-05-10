import degreesToRadians from "./degreesToRadians";

describe("degreesToRadians", () => {
  test("0 degrees", () => {
    expect(degreesToRadians(0)).toEqual(0);
  });
  test("90 degrees", () => {
    expect(degreesToRadians(90)).toEqual(1.5707963267948966);
  });
  test("180 degrees", () => {
    expect(degreesToRadians(180)).toEqual(3.141592653589793);
  });
  test("270 degrees", () => {
    expect(degreesToRadians(270)).toEqual(4.71238898038469);
  });
  test("360 degrees", () => {
    expect(degreesToRadians(360)).toEqual(6.283185307179586);
  });
});
