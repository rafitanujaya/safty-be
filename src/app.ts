import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error";

import authRoutes from "./routes/auth";
import dashboardRoutes from "./routes/dashboard";
import eventRoutes from "./routes/event";
import historyRoutes from "./routes/history";
import fileRoutes from "./routes/file";
import imageRoutes from "./routes/image";
import educationRoutes from "./routes/education";
import settingRoutes from "./routes/setting";
import threatSourceRoutes from "./routes/threat-source";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/threat-sources", threatSourceRoutes);

// Middleware
app.use(errorHandler);

export default app;
