import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error Middleware:", err);

  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  return sendError(res, message, statusCode);
};
