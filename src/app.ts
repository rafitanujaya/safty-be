import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth";
import settingRoutes from "./routes/setting";
import eventRoutes from "./routes/event";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/setting", settingRoutes);
app.use("/api/event", eventRoutes);

// Middleware
app.use(errorHandler);

export default app;
