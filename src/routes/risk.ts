import { Router } from "express";
import { scanPage, scanFormSubmit } from "../controllers/risk";

const router = Router();

router.post("/page", scanPage);
router.post("/form-submit", scanFormSubmit);

export default router;
