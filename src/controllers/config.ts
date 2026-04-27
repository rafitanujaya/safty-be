import { Request, Response } from "express";

export const getConfig = async (_req: Request, res: Response) => {
  res.json({
    urlGuardEnabled: true,
    formProtectionEnabled: true,
    highRiskThreshold: 60,
    suspiciousThreshold: 30,
  });
};

export const updateConfig = async (_req: Request, res: Response) => {
  res.json({ success: true });
};
