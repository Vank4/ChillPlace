import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "../src/app.js";
import {
  cloudinaryAssetFromUrl
} from "../src/common/utils/cloudinary.js";
import { prisma } from "../src/common/utils/prisma.js";

test("OpenAPI contract and API docs are publicly available", async (t) => {
  const server = createApp().listen(0);
  t.after(() => new Promise((resolve) => server.close(resolve)));
  await new Promise((resolve) => server.once("listening", resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  const contractResponse = await fetch(`${baseUrl}/api/docs/openapi.json`);
  const contract = await contractResponse.json();
  assert.equal(contractResponse.status, 200);
  assert.equal(contract.openapi, "3.0.3");
  assert.ok(Object.keys(contract.paths).length >= 60);
  assert.equal(
    contract.paths["/admin/users"].get.security[0].bearerAuth.length,
    0
  );

  const docsResponse = await fetch(`${baseUrl}/api/docs`);
  const html = await docsResponse.text();
  assert.equal(docsResponse.status, 200);
  assert.match(docsResponse.headers.get("content-type"), /text\/html/);
  assert.match(html, /ChillPlace API/);
  assert.match(html, /\/api\/docs\/openapi\.json/);
});

test("database transaction rolls back all writes on failure", async () => {
  const email = `rollback_${Date.now()}@chillplace.test`;

  await assert.rejects(
    prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          username: `rollback_${Date.now()}`,
          fullName: "Rollback Test",
          email,
          passwordHash: "test-only-hash",
          status: "active"
        }
      });
      throw new Error("force rollback");
    }),
    /force rollback/
  );

  assert.equal(await prisma.user.count({ where: { email } }), 0);
});

test("Cloudinary URLs can be mapped back to deploy-safe asset ids", () => {
  assert.deepEqual(
    cloudinaryAssetFromUrl(
      "https://res.cloudinary.com/demo/image/upload/v123/chillplace/cafe.jpg"
    ),
    { publicId: "chillplace/cafe", resourceType: "image" }
  );
  assert.equal(cloudinaryAssetFromUrl("https://example.com/cafe.jpg"), null);
});
