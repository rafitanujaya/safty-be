import { Router } from "express";
import { createEvent, getEvents } from "../controllers/event";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/", authenticate, getEvents);
router.post("/", authenticate, createEvent);

export default router;
