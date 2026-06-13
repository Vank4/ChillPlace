import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "../src/app.js";
import { prisma } from "../src/common/utils/prisma.js";

async function request(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    }
  });

  const body = response.status === 204 ? null : await response.json();
  return { response, body };
}

test("auth-user API workflow", async (t) => {
  const suffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const firstEmail = `auth_${suffix}@chillplace.test`;
  const secondEmail = `follow_${suffix}@chillplace.test`;
  const password = "ChillPlace123!";

  const server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  t.after(async () => {
    try {
      await prisma.user.deleteMany({
        where: { email: { in: [firstEmail, secondEmail] } }
      });
    } finally {
      await new Promise((resolve) => server.close(resolve));
      await prisma.$disconnect().catch(() => undefined);
    }
  });

  const register = await request(baseUrl, "/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      firstName: "An",
      lastName: "Nguyen",
      email: firstEmail,
      phone: "0901234567",
      password,
      acceptedTerms: true
    })
  });

  assert.equal(register.response.status, 201);
  assert.equal(register.body.data.user.role, "user");
  assert.equal(register.body.data.user.status, "active");
  assert.equal(register.body.data.user.passwordHash, undefined);
  assert.equal(typeof register.body.data.accessToken, "string");

  const firstUser = register.body.data.user;
  const firstToken = register.body.data.accessToken;

  const duplicate = await request(baseUrl, "/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      fullName: "Duplicate User",
      email: firstEmail,
      phone: "0901234567",
      password,
      acceptedTerms: true
    })
  });
  assert.equal(duplicate.response.status, 409);
  assert.equal(typeof duplicate.body.errors.email, "string");

  const invalidLogin = await request(baseUrl, "/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: firstEmail,
      password: "WrongPassword!"
    })
  });
  assert.equal(invalidLogin.response.status, 401);
  assert.equal(invalidLogin.body.message, "Email or password is incorrect");

  const login = await request(baseUrl, "/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: firstEmail, password })
  });
  assert.equal(login.response.status, 200);
  assert.equal(login.body.data.user.passwordHash, undefined);

  const missingToken = await request(baseUrl, "/api/auth/me");
  assert.equal(missingToken.response.status, 401);

  const invalidToken = await request(baseUrl, "/api/auth/me", {
    headers: { Authorization: "Bearer invalid-token" }
  });
  assert.equal(invalidToken.response.status, 401);

  const me = await request(baseUrl, "/api/auth/me", {
    headers: { Authorization: `Bearer ${firstToken}` }
  });
  assert.equal(me.response.status, 200);
  assert.equal(me.body.data.user.email, firstEmail);
  assert.equal(me.body.data.user.passwordHash, undefined);

  const forbiddenProfileField = await request(baseUrl, "/api/users/me", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${firstToken}` },
    body: JSON.stringify({ role: "admin" })
  });
  assert.equal(forbiddenProfileField.response.status, 422);

  const updatedProfile = await request(baseUrl, "/api/users/me", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${firstToken}` },
    body: JSON.stringify({
      fullName: "An Nguyen Updated",
      username: `an_${suffix}`,
      bio: "Backend auth integration test",
      location: "Ho Chi Minh City"
    })
  });
  assert.equal(updatedProfile.response.status, 200);
  assert.equal(updatedProfile.body.data.user.username, `an_${suffix}`);
  assert.equal(updatedProfile.body.data.user.role, "user");

  const secondRegister = await request(baseUrl, "/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      fullName: "Follow Target",
      username: `target_${suffix}`,
      email: secondEmail,
      phone: "0907654321",
      password,
      acceptedTerms: true
    })
  });
  assert.equal(secondRegister.response.status, 201);
  const secondUser = secondRegister.body.data.user;

  const publicProfile = await request(
    baseUrl,
    `/api/users/${secondUser.username}/public`,
    { headers: { Authorization: `Bearer ${firstToken}` } }
  );
  assert.equal(publicProfile.response.status, 200);
  assert.equal(publicProfile.body.data.profile.email, undefined);
  assert.equal(publicProfile.body.data.profile.isFollowing, false);

  const publicPosts = await request(
    baseUrl,
    `/api/users/${secondUser.id}/posts?page=1&limit=10`
  );
  assert.equal(publicPosts.response.status, 200);
  assert.deepEqual(publicPosts.body.data.items, []);
  assert.equal(publicPosts.body.pagination.total, 0);

  const selfFollow = await request(
    baseUrl,
    `/api/users/${firstUser.id}/follow`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${firstToken}` }
    }
  );
  assert.equal(selfFollow.response.status, 400);

  const follow = await request(
    baseUrl,
    `/api/users/${secondUser.id}/follow`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${firstToken}` }
    }
  );
  assert.equal(follow.response.status, 200);
  assert.equal(follow.body.data.following, true);
  assert.equal(follow.body.data.followerCount, 1);

  const followNotification = await prisma.notification.count({
    where: {
      userId: secondUser.id,
      type: "new_follower"
    }
  });
  assert.equal(followNotification, 1);

  const unfollow = await request(
    baseUrl,
    `/api/users/${secondUser.id}/follow`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${firstToken}` }
    }
  );
  assert.equal(unfollow.response.status, 200);
  assert.equal(unfollow.body.data.following, false);
  assert.equal(unfollow.body.data.followerCount, 0);

  await prisma.user.update({
    where: { id: firstUser.id },
    data: { status: "blocked" }
  });

  const blocked = await request(baseUrl, "/api/auth/me", {
    headers: { Authorization: `Bearer ${firstToken}` }
  });
  assert.equal(blocked.response.status, 403);
});
