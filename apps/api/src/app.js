import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { corsMiddleware } from "./config/cors.js";
import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { apiRateLimiter } from "./middlewares/security.middleware.js";
import { uploadConfig } from "./middlewares/upload.middleware.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", "loopback");
  app.use(helmet());
  app.use(corsMiddleware);
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));
  app.use(morgan("dev"));
  app.use("/uploads", express.static(uploadConfig.root));

  app.use("/api", apiRateLimiter, apiRouter);
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
