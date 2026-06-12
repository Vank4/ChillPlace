import dotenv from "dotenv";

dotenv.config();

const SUPPORTED_NODE_ENVS = new Set(["development", "test", "production"]);

function required(source, key) {
  const value = source[key]?.trim();

  if (!value) {
    throw new Error(`Missing ${key} in environment.`);
  }

  return value;
}

function positiveInteger(source, key, fallback) {
  const value = Number(source[key] || fallback);

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${key} must be a positive integer.`);
  }

  return value;
}

export function loadEnv(source = process.env) {
  const nodeEnv = source.NODE_ENV?.trim() || "development";

  if (!SUPPORTED_NODE_ENVS.has(nodeEnv)) {
    throw new Error(
      `NODE_ENV must be one of: ${Array.from(SUPPORTED_NODE_ENVS).join(", ")}.`
    );
  }

  const jwtSecret = required(source, "JWT_SECRET");
  if (nodeEnv === "production" && jwtSecret === "change_me") {
    throw new Error("JWT_SECRET must be changed in production.");
  }

  return Object.freeze({
    nodeEnv,
    port: positiveInteger(source, "PORT", "3000"),
    appUrl: source.APP_URL?.trim() || "http://localhost:3000",
    databaseUrl: required(source, "DATABASE_URL"),
    jwtSecret,
    jwtExpiresIn: source.JWT_EXPIRES_IN?.trim() || "7d",
    corsOrigin:
      source.FRONTEND_URL?.trim() ||
      source.CORS_ORIGIN?.trim() ||
      "http://localhost:5173",
    uploadDriver: source.UPLOAD_DRIVER?.trim() || "local",
    uploadDir: source.UPLOAD_DIR?.trim() || "uploads",
    maxImageSizeMb: positiveInteger(source, "MAX_IMAGE_SIZE_MB", "5"),
    maxVideoSizeMb: positiveInteger(source, "MAX_VIDEO_SIZE_MB", "80")
  });
}

export const env = loadEnv();
