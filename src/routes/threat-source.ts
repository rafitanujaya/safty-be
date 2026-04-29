import { Router } from "express";
import { getTopThreatSources } from "../controllers/threat-source";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/top", authenticate, getTopThreatSources);

export default router;
