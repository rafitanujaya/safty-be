import { Request, Response, NextFunction } from "express";
import * as fileService from "../services/file";
import { sendSuccess } from "../utils/response";

export const getFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const result = await fileService.getFiles(userId, req.query);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getFileById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const fileId = req.params.id as string;
    const result = await fileService.getFileById(userId, fileId);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const scanFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    if (!req.file) {
      const error = new Error("No file uploaded");
      (error as any).status = 400;
      throw error;
    }
    const result = await fileService.scanFile(userId, req.file);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
