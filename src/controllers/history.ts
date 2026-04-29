import { Request, Response, NextFunction } from "express";
import * as historyService from "../services/history";
import { sendSuccess } from "../utils/response";

export const getHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    // Default limit 20 for history
    if (!req.query.limit) {
      req.query.limit = "20";
    }
    const result = await historyService.getHistory(userId, req.query);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
