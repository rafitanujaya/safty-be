import { Request, Response, NextFunction } from "express";
import * as eventService from "../services/event";
import { sendSuccess } from "../utils/response";

export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const result = await eventService.getEvents(userId, req.query);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
