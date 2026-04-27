import { Router } from "express";
import { register, login, me } from "../controllers/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/auth.js";
import { registerSchema, loginSchema } from "../validators/auth.js";

const router = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.get("/me", authenticate, me);

export default router;
