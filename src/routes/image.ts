import { Router } from "express";
import { getImages, getImageById, scanImage } from "../controllers/image";
import { authenticate } from "../middlewares/auth";
import { upload } from "../middlewares/upload";

const router = Router();

router.use(authenticate);

router.get("/", getImages);
router.post("/scan", upload.single("image"), scanImage);
router.get("/:id", getImageById);

export default router;
