import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes";
import riskRoutes from "./routes/risk.routes";
import eventsRoutes from "./routes/event.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import configRoutes from "./routes/config.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/config", configRoutes);

export default app;
