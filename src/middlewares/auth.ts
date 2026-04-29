import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../utils/response";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, "Unauthorized", 401);
    }
    
    const token = authHeader.split(" ")[1];
    
    const secret = process.env.JWT_SECRET || "default_secret";
    const decoded = jwt.verify(token, secret) as any;
    
    // Attach user to req
    (req as any).user = {
      userId: decoded.userId,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    return sendError(res, "Invalid or expired token", 401);
  }
};
