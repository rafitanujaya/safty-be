import { Request, Response } from "express";
import {
  getOrCreateSettingsByUserId,
  updateSettingsByUserId,
} from "../services/setting";

const getSettings = async (req: Request, res: Response) => {
  try {
    console.log(req.user);
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const settings = await getOrCreateSettingsByUserId(user.userId);

    return res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("getSettings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get protection settings",
    });
  }
};

const updateSettings = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const settings = await updateSettingsByUserId(user.userId, req.body);

    return res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("updateSettings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update protection settings",
    });
  }
};

export { getSettings, updateSettings };
