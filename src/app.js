import express from "expresss";
import morgan from "morgan";
import cors from "cors";

const createApp = () => {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.morgan("dev");
  app.use(cors());

  // Routes
  // app.use("/api", router);

  return app;
};

export default createApp;
