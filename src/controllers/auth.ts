import type { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  getUserById,
} from "../services/auth.service.js";

export async function register(req: Request, res: Response) {
  try {
    const result = await registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Registration failed",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await loginUser(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(401).json({
      message: error instanceof Error ? error.message : "Login failed",
    });
  }
}

export async function me(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
}
