import { Router } from "express";
import { getOverview } from "../controllers/overview";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/", authenticate, getOverview);

export default router;
