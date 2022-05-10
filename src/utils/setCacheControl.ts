import { Response } from "express";

const setCacheControl = (res: Response, maxAge = 600): void => {
  res.set("Cache-Control", `public, max-age=${maxAge}`);
};

export default setCacheControl;
