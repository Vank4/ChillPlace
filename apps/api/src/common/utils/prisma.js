import { PrismaClient } from "@prisma/client";
import { env } from "../../config/env.js";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.__chillplacePrisma ??
  new PrismaClient({
    datasourceUrl: env.databaseUrl,
    log: env.nodeEnv === "development" ? ["warn", "error"] : ["error"]
  });

if (env.nodeEnv !== "production") {
  globalForPrisma.__chillplacePrisma = prisma;
}
