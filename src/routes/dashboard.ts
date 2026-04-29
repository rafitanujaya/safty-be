import { Router } from "express";
import { getSummary, getTrend, getSeverity, getRecentEvents, getRiskLevel } from "../controllers/dashboard";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate);

router.get("/summary", getSummary);
router.get("/trend", getTrend);
router.get("/severity", getSeverity);
router.get("/recent-events", getRecentEvents);
router.get("/risk-level", getRiskLevel);

export default router;
