import { ok } from "../../common/utils/apiResponse.js";
import { checkDatabaseHealth } from "../../common/utils/dbHealth.js";
import { env } from "../../config/env.js";

export async function getHealth(req, res) {
  const db = await checkDatabaseHealth();

  return ok(
    res,
    {
      service: "chillplace-api",
      env: env.nodeEnv,
      uptimeSec: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      db
    },
    "OK"
  );
}
