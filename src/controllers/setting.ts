import { Request, Response, NextFunction } from "express";
import * as settingService from "../services/setting";
import { sendSuccess } from "../utils/response";

export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const result = await settingService.getSettings(userId);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    
    // Basic validation
    if (req.body.riskThreshold !== undefined) {
      if (typeof req.body.riskThreshold !== 'number' || req.body.riskThreshold < 0 || req.body.riskThreshold > 100) {
        const err = new Error("riskThreshold must be a number between 0 and 100");
        (err as any).status = 400;
        throw err;
      }
    }

    if (req.body.themePreference !== undefined) {
      if (!["LIGHT", "DARK", "SYSTEM"].includes(req.body.themePreference)) {
        const err = new Error("themePreference must be LIGHT, DARK, or SYSTEM");
        (err as any).status = 400;
        throw err;
      }
    }

    const result = await settingService.updateSettings(userId, req.body);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
