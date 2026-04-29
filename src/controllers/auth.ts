import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth";
import { sendSuccess } from "../utils/response";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.registerUser(req.body);
    return sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.loginUser(req.body);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    const user = await authService.getUserById(userId);
    return sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};
