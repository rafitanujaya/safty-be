import { Router } from "express";
import { scanUrl } from "../controllers/scan";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/url", authenticate, scanUrl);

export default router;
