import { Request, Response } from "express";
import { getOverviewByUserId } from "../services/overview";

const getOverview = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const overview = await getOverviewByUserId(user.userId);

    return res.json({
      success: true,
      data: overview,
    });
  } catch (error) {
    console.error("getOverview error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get overview data",
    });
  }
};

export { getOverview };
