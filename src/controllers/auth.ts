import type { Request, Response, NextFunction } from "express";
import { registerUser, loginUser, getUserById } from "../services/auth.js";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await loginUser(req.body);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

const me = async (req: Request, res: Response, next: NextFunction) => {
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
};

export { register, login, me };
