import type { Request, Response, NextFunction } from "express";
import { registerUser, loginUser, getUserById } from "../services/auth.js";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await loginUser(req.body);
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      const err = new Error("Unauthorized");
      (err as any).status = 401;
      throw err;
    }

    const user = await getUserById(userId);

    if (!user) {
      const err = new Error("User not found");
      (err as any).status = 404;
      throw err;
    }

    return res.json(user);
  } catch (error) {
    next(error);
  }
}
