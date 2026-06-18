import assert from "node:assert/strict";
import test from "node:test";
import { loadEnv } from "../src/config/env.js";
import { createApp } from "../src/app.js";

const validEnv = {
  NODE_ENV: "test",
  DATABASE_URL: "mysql://root@127.0.0.1:3306/chillplace_test",
  JWT_SECRET: "test-secret"
};

test("loadEnv applies foundation defaults", () => {
  const config = loadEnv(validEnv);

  assert.equal(config.nodeEnv, "test");
  assert.equal(config.port, 3000);
  assert.equal(config.corsOrigin, "http://localhost:5173");
  assert.equal(config.maxImageSizeMb, 5);
  assert.equal(config.maxVideoSizeMb, 80);
  assert.equal(config.uploadDriver, "local");
});

test("loadEnv rejects missing required variables", () => {
  assert.throws(
    () => loadEnv({ NODE_ENV: "test", JWT_SECRET: "test-secret" }),
    /Missing DATABASE_URL/
  );
  assert.throws(
    () => loadEnv({ NODE_ENV: "test", DATABASE_URL: validEnv.DATABASE_URL }),
    /Missing JWT_SECRET/
  );
});

test("loadEnv rejects unsafe production JWT secret", () => {
  assert.throws(
    () =>
      loadEnv({
        ...validEnv,
        NODE_ENV: "production",
        JWT_SECRET: "change_me"
      }),
    /JWT_SECRET must be changed/
  );
});

test("loadEnv validates Cloudinary deployment settings", () => {
  assert.throws(
    () => loadEnv({ ...validEnv, UPLOAD_DRIVER: "cloudinary" }),
    /Missing CLOUDINARY_CLOUD_NAME/
  );
  const config = loadEnv({
    ...validEnv,
    UPLOAD_DRIVER: "cloudinary",
    CLOUDINARY_CLOUD_NAME: "demo",
    CLOUDINARY_API_KEY: "key",
    CLOUDINARY_API_SECRET: "secret"
  });
  assert.equal(config.uploadDriver, "cloudinary");
  assert.equal(config.cloudinaryFolder, "chillplace");
});

test("unknown API route returns the standard error response", async (t) => {
  const server = createApp().listen(0);
  t.after(() => new Promise((resolve) => server.close(resolve)));

  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/unknown`);
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.deepEqual(body, {
    success: false,
    message: "Route GET /api/unknown not found"
  });
  assert.equal(response.headers.has("x-powered-by"), false);
  assert.equal(
    response.headers.get("x-content-type-options"),
    "nosniff"
  );
});

test("CORS rejects origins outside the configured allowlist", async (t) => {
  const server = createApp().listen(0);
  t.after(() => new Promise((resolve) => server.close(resolve)));

  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/health`, {
    headers: { Origin: "https://malicious.example" }
  });
  const body = await response.json();

  assert.equal(response.status, 403);
  assert.equal(body.message, "Origin is not allowed by CORS");
});
