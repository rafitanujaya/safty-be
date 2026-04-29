import { Request, Response, NextFunction } from "express";
import * as educationService from "../services/education";
import { sendSuccess } from "../utils/response";

export const getEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await educationService.getEducationArticles(req.query);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
