import { Router } from "express";
import { getHistory } from "../controllers/history";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/", authenticate, getHistory);

export default router;
