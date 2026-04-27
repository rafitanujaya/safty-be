import { Request, Response } from "express";

export const scanPage = async (_req: Request, res: Response) => {
  res.json({
    riskScore: 0,
    riskLevel: "safe",
    reasons: [],
    recommendedAction: "allow",
  });
};

export const scanFormSubmit = async (_req: Request, res: Response) => {
  res.json({
    decision: "allow",
    riskScore: 0,
    reasons: [],
  });
};
