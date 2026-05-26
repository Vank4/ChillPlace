import { ok } from "../../common/utils/apiResponse.js";
import { checkDatabaseHealth } from "../../common/utils/dbHealth.js";

export async function getHealth(req, res) {
  const db = await checkDatabaseHealth();

  return ok(
    res,
    {
      service: "chillplace-api",
      env: process.env.NODE_ENV || "development",
      uptimeSec: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      db
    },
    "OK"
  );
}

