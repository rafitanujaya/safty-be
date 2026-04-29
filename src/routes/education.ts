import { Router } from "express";
import { getEducation } from "../controllers/education";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/", authenticate, getEducation);

export default router;
