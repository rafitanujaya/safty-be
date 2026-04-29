import { Router } from "express";
import { getFiles, getFileById, scanFile } from "../controllers/file";
import { authenticate } from "../middlewares/auth";
import { upload } from "../middlewares/upload";

const router = Router();

router.use(authenticate);

router.get("/", getFiles);
router.post("/scan", upload.single("file"), scanFile);
router.get("/:id", getFileById);

export default router;
