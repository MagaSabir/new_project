import { NextFunction, Response, Request } from "express";
import { STATUS_CODE } from "../adapters/http-statuses-code";
import { SETTINGS } from "../../settings";

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers["authorization"];

  if (!auth) {
    res.sendStatus(STATUS_CODE.UNAUTHORIZED_401);
    return;
  }

  const [authType, token] = auth.split(" ");

  if (authType !== "Basic") {
    res.sendStatus(STATUS_CODE.UNAUTHORIZED_401);
    return;
  }

  const newToken = Buffer.from(token, "base64").toString();
  const [newLogin, newPassword] = newToken.split(":");
  const [loginUser, passwordUser] = SETTINGS.ADMIN_AUTH.split(":");

  if (newLogin !== loginUser || newPassword !== passwordUser) {
    res.sendStatus(STATUS_CODE.UNAUTHORIZED_401);
    return;
  }
  next();
};
