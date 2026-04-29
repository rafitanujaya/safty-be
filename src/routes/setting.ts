import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/setting.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.get("/", authenticate, getSettings);
router.post("/", authenticate, updateSettings);

export default router;
