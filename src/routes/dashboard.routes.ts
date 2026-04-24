import { Router } from "express";
import {
  getSummary,
  getRecentEvents,
} from "../controllers/dashboard.controller";

const router = Router();

router.get("/summary", getSummary);
router.get("/events", getRecentEvents);

export default router;
