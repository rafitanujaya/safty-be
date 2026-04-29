import { Request, Response } from "express";
import { createThreatEvent, getThreatEvents } from "../services/event";

const getEvents = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const events = await getThreatEvents(user.userId, {
      riskLevel: req.query.riskLevel as string | undefined,
      eventType: req.query.eventType as string | undefined,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    });

    return res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error("getEvents error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get threat events",
    });
  }
};

const createEvent = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!req.body.eventType || !req.body.title) {
      return res.status(400).json({
        success: false,
        message: "eventType and title are required",
      });
    }

    const event = await createThreatEvent(user.userId, req.body);

    return res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("createEvent error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create threat event",
    });
  }
};

export { getEvents, createEvent };
