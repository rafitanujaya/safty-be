import { Request, Response } from "express";

export const createEvent = async (_req: Request, res: Response) => {
  res.status(201).json({ success: true });
};
