import { prisma } from "./prisma.js";

export async function checkDatabaseHealth() {
  const start = Date.now();
  await prisma.$queryRaw`SELECT 1`;
  return {
    status: "up",
    latencyMs: Date.now() - start
  };
}

