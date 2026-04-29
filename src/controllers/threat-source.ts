import { Request, Response, NextFunction } from "express";
import * as threatSourceService from "../services/threat-source";
import { sendSuccess } from "../utils/response";

export const getTopThreatSources = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const result = await threatSourceService.getTopThreatSources(userId, limit);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
