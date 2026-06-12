import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./common/utils/prisma.js";
import { loggerError, loggerInfo } from "./common/logger/index.js";

const app = createApp();
let httpServer;

async function startServer() {
  await prisma.$connect();
  httpServer = app.listen(env.port, () => {
    loggerInfo("API server started", {
      environment: env.nodeEnv,
      port: env.port
    });
  });
}

async function shutdown(signal) {
  loggerInfo("Graceful shutdown started", { signal });
  if (httpServer) {
    await new Promise((resolve) => httpServer.close(resolve));
  }
  await prisma.$disconnect();
  loggerInfo("Graceful shutdown completed", { signal });
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer().catch(async (error) => {
  loggerError("Failed to start API server", { message: error.message });
  await prisma.$disconnect();
  process.exit(1);
});
