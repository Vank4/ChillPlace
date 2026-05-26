import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./common/utils/prisma.js";

const app = createApp();
let httpServer;

async function startServer() {
  await prisma.$connect();
  httpServer = app.listen(env.port, () => {
    console.log(`API listening on port ${env.port}`);
  });
}

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down gracefully...`);
  if (httpServer) {
    await new Promise((resolve) => httpServer.close(resolve));
  }
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer().catch(async (error) => {
  console.error("Failed to start server:", error.message);
  await prisma.$disconnect();
  process.exit(1);
});

