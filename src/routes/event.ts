import { Router } from "express";
import { getEvents } from "../controllers/event";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/", authenticate, getEvents);

export default router;
