import { Request, Response, NextFunction } from "express";
import * as imageService from "../services/image";
import { sendSuccess } from "../utils/response";

export const getImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const result = await imageService.getImages(userId, req.query);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const getImageById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const imageId = req.params.id as string;
    const result = await imageService.getImageById(userId, imageId);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const scanImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    if (!req.file) {
      const error = new Error("No image uploaded");
      (error as any).status = 400;
      throw error;
    }
    const result = await imageService.scanImage(userId, req.file);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
