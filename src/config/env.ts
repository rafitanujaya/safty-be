import dotenv from "dotenv";

dotenv.config();

const env = {
  PORT: Number(process.env.PORT) || 3000,
  DATABASE_URL: process.env.DATABASE_URL || "",
};

export default env;
