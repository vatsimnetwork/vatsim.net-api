import setCacheControl from "./setCacheControl";
import { Response } from "express";

describe("setCacheControl", () => {
  const mockResponse = {
    set: jest.fn().mockReturnValue({}),
  };

  it("sets default cache control time of 600", () => {
    const res = mockResponse;

    setCacheControl(res as unknown as Response);
    expect(res.set).toHaveBeenCalledWith(
      "Cache-Control",
      "public, max-age=600"
    );
  });

  it("sets custom cache control time when passed in", () => {
    const res = mockResponse;

    setCacheControl(res as unknown as Response, 100);
    expect(res.set).toHaveBeenCalledWith(
      "Cache-Control",
      "public, max-age=100"
    );
  });
});
