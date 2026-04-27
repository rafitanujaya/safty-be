import { Request, Response } from "express";

export const getSummary = async (_req: Request, res: Response) => {
  res.json({
    totalScans: 0,
    suspiciousCount: 0,
    highRiskCount: 0,
    preventedCount: 0,
  });
};

export const getRecentEvents = async (_req: Request, res: Response) => {
  res.json([]);
};
