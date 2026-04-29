import { Request, Response, NextFunction } from "express";
import * as dashboardService from "../services/dashboard";
import { sendSuccess } from "../utils/response";

export const getSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const days = req.query.days ? parseInt(req.query.days as string) : 7;
    const result = await dashboardService.getDashboardSummary(userId, days);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getTrend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const days = req.query.days ? parseInt(req.query.days as string) : 7;
    const result = await dashboardService.getDashboardTrend(userId, days);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getSeverity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const days = req.query.days ? parseInt(req.query.days as string) : 7;
    const result = await dashboardService.getDashboardSeverity(userId, days);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getRecentEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const result = await dashboardService.getDashboardRecentEvents(userId);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getRiskLevel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const days = req.query.days ? parseInt(req.query.days as string) : 7;
    const result = await dashboardService.getDashboardRiskLevel(userId, days);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
