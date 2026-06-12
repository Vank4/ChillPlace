import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import { z } from "zod";
import { AppError } from "../src/common/errors/AppError.js";
import {
  createCursor,
  createPagination,
  created,
  ok
} from "../src/common/utils/apiResponse.js";
import { checkDatabaseHealth } from "../src/common/utils/dbHealth.js";
import { prisma } from "../src/common/utils/prisma.js";
import { errorMiddleware } from "../src/middlewares/error.middleware.js";
import { createRateLimiter } from "../src/middlewares/security.middleware.js";
import {
  createStoredFilename,
  uploadFiles
} from "../src/middlewares/upload.middleware.js";
import { validateRequest } from "../src/middlewares/validate.middleware.js";

async function withServer(app, callback) {
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));

  try {
    const { port } = server.address();
    await callback(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test("database health probe connects to MySQL", async () => {
  const health = await checkDatabaseHealth();
  assert.equal(health.status, "up");
  assert.equal(Number.isInteger(health.latencyMs), true);
  await prisma.$disconnect();
});

test("response helpers return pagination, cursor and created status", async () => {
  const app = express();
  app.get("/list", (req, res) =>
    ok(
      res,
      { items: [] },
      "OK",
      createPagination({ page: 1, limit: 20, total: 41 })
    )
  );
  app.get("/cursor", (req, res) =>
    res.json({
      success: true,
      message: "OK",
      data: [],
      cursor: createCursor({ nextCursor: "next", hasMore: true })
    })
  );
  app.post("/resource", (req, res) =>
    created(res, { id: 1 }, "Resource created")
  );

  await withServer(app, async (baseUrl) => {
    const list = await fetch(`${baseUrl}/list`).then((response) =>
      response.json()
    );
    const cursor = await fetch(`${baseUrl}/cursor`).then((response) =>
      response.json()
    );
    const resourceResponse = await fetch(`${baseUrl}/resource`, {
      method: "POST"
    });

    assert.equal(list.pagination.total_pages, 3);
    assert.deepEqual(cursor.cursor, {
      next_cursor: "next",
      has_more: true
    });
    assert.equal(resourceResponse.status, 201);
  });
});

test("validation middleware normalizes body and reports field errors", async () => {
  const app = express();
  app.use(express.json());
  app.post(
    "/validate",
    validateRequest({
      body: z.object({
        email: z.email(),
        age: z.coerce.number().int().min(18)
      })
    }),
    (req, res) => ok(res, req.validated.body)
  );
  app.use(errorMiddleware);

  await withServer(app, async (baseUrl) => {
    const validResponse = await fetch(`${baseUrl}/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "user@chillplace.test", age: "20" })
    });
    const validBody = await validResponse.json();
    assert.equal(validBody.data.age, 20);

    const invalidResponse = await fetch(`${baseUrl}/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "invalid", age: 15 })
    });
    const invalidBody = await invalidResponse.json();
    assert.equal(invalidResponse.status, 422);
    assert.equal(typeof invalidBody.errors.email, "string");
    assert.equal(typeof invalidBody.errors.age, "string");
  });
});

test("error middleware hides internal errors and handles invalid JSON", async () => {
  const app = express();
  app.use(express.json());
  app.get("/app-error", (req, res, next) =>
    next(AppError.conflict("Duplicate resource"))
  );
  app.get("/internal", () => {
    throw new Error("database password must stay private");
  });
  app.post("/json", (req, res) => ok(res, req.body));
  app.use(errorMiddleware);

  await withServer(app, async (baseUrl) => {
    const conflict = await fetch(`${baseUrl}/app-error`).then((response) =>
      response.json()
    );
    assert.equal(conflict.message, "Duplicate resource");

    const internal = await fetch(`${baseUrl}/internal`).then((response) =>
      response.json()
    );
    assert.equal(internal.message, "Internal server error");

    const invalidJsonResponse = await fetch(`${baseUrl}/json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{invalid"
    });
    const invalidJson = await invalidJsonResponse.json();
    assert.equal(invalidJsonResponse.status, 400);
    assert.equal(invalidJson.message, "Invalid JSON body");
  });
});

test("rate limiter returns the standard 429 response", async () => {
  const app = express();
  app.use(
    createRateLimiter({
      windowMs: 60_000,
      limit: 1,
      validate: false
    })
  );
  app.get("/", (req, res) => ok(res));

  await withServer(app, async (baseUrl) => {
    assert.equal((await fetch(baseUrl)).status, 200);
    const limitedResponse = await fetch(baseUrl);
    const limitedBody = await limitedResponse.json();
    assert.equal(limitedResponse.status, 429);
    assert.equal(limitedBody.success, false);
  });
});

test("upload middleware stores safe files and rejects unsupported MIME", async () => {
  const app = express();
  app.post("/upload", uploadFiles("files", 2, { storage: "memory" }), (req, res) =>
    ok(
      res,
      req.files.map((file) => ({
        filename: createStoredFilename(file),
        mimetype: file.mimetype
      }))
    )
  );
  app.use(errorMiddleware);

  await withServer(app, async (baseUrl) => {
    const validForm = new FormData();
    validForm.append(
      "files",
      new Blob(["image-bytes"], { type: "image/png" }),
      "unsafe-name.exe"
    );
    const validResponse = await fetch(`${baseUrl}/upload`, {
      method: "POST",
      body: validForm
    });
    const validBody = await validResponse.json();
    assert.equal(validResponse.status, 200);
    assert.match(validBody.data[0].filename, /^[a-f0-9-]+\.png$/);

    const invalidForm = new FormData();
    invalidForm.append(
      "files",
      new Blob(["script"], { type: "application/javascript" }),
      "payload.js"
    );
    const invalidResponse = await fetch(`${baseUrl}/upload`, {
      method: "POST",
      body: invalidForm
    });
    const invalidBody = await invalidResponse.json();
    assert.equal(invalidResponse.status, 400);
    assert.match(invalidBody.message, /Unsupported file type/);

    const oversizedForm = new FormData();
    oversizedForm.append(
      "files",
      new Blob([new Uint8Array(5 * 1024 * 1024 + 1)], {
        type: "image/png"
      }),
      "large.png"
    );
    const oversizedResponse = await fetch(`${baseUrl}/upload`, {
      method: "POST",
      body: oversizedForm
    });
    const oversizedBody = await oversizedResponse.json();
    assert.equal(oversizedResponse.status, 400);
    assert.match(oversizedBody.message, /must not exceed 5 MB/);
  });
});
