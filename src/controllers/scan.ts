import { Request, Response } from "express";
import { scanUrlForUser } from "../services/scan";

const scanUrl = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!req.body.url) {
      return res.status(400).json({
        success: false,
        message: "url is required",
      });
    }

    const result = await scanUrlForUser(user.userId, req.body.url);

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("scanUrl error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to scan URL",
    });
  }
};

export { scanUrl };
