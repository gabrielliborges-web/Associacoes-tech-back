import "dotenv/config";

export const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 3333,
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
  SESSION_EXPIRES_DAYS: process.env.SESSION_EXPIRES_DAYS
    ? Number(process.env.SESSION_EXPIRES_DAYS)
    : 7,
  NODE_ENV: process.env.NODE_ENV || "development",
};
