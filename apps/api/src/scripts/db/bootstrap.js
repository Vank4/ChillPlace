import { createConnection } from "mysql2/promise";
import { env } from "../../config/env.js";

function parseDatabaseUrl(databaseUrl) {
  let parsed;
  try {
    parsed = new URL(databaseUrl);
  } catch {
    throw new Error("DATABASE_URL is invalid.");
  }

  if (parsed.protocol !== "mysql:") {
    throw new Error("DATABASE_URL must use mysql protocol.");
  }

  const database = parsed.pathname.replace("/", "");
  if (!database) {
    throw new Error("DATABASE_URL must include a database name.");
  }
  if (!/^[A-Za-z0-9_]+$/.test(database)) {
    throw new Error(
      "Database name may contain only letters, numbers, and underscores."
    );
  }

  return {
    host: parsed.hostname,
    port: Number(parsed.port || 3306),
    user: decodeURIComponent(parsed.username || "root"),
    password: decodeURIComponent(parsed.password || ""),
    database
  };
}

async function bootstrapDatabase() {
  const cfg = parseDatabaseUrl(env.databaseUrl);
  const connection = await createConnection({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    multipleStatements: false
  });

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${cfg.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    console.log(`[db:bootstrap] Database "${cfg.database}" is ready.`);
  } finally {
    await connection.end();
  }
}

bootstrapDatabase().catch((error) => {
  console.error("[db:bootstrap] Failed:", error.message);
  process.exit(1);
});
