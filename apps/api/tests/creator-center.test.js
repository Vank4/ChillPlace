import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "../src/app.js";
import { prisma } from "../src/common/utils/prisma.js";
import { signAccessToken } from "../src/common/utils/jwt.js";

async function request(baseUrl, path, token) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return { response, body: await response.json() };
}

test("creator center API workflow", async (t) => {
  const suffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const users = await Promise.all(
    [
      ["creator_main", "Main Creator", "creator"],
      ["creator_other", "Other Creator", "creator"],
      ["creator_admin", "Creator Admin", "admin"],
      ["creator_user", "Regular User", "user"]
    ].map(([prefix, fullName, role]) =>
      prisma.user.create({
        data: {
          username: `${prefix}_${suffix}`,
          fullName,
          email: `${prefix}_${suffix}@chillplace.test`,
          passwordHash: "test-only-hash",
          role,
          status: "active"
        }
      })
    )
  );
  const [creator, otherCreator, admin, regularUser] = users;
  await Promise.all([
    prisma.creatorProfile.create({
      data: {
        userId: creator.id,
        displayName: "Main Creator Studio",
        bio: "Creator center integration test"
      }
    }),
    prisma.creatorProfile.create({
      data: { userId: otherCreator.id, displayName: "Other Creator Studio" }
    }),
    prisma.follow.create({
      data: {
        followerId: regularUser.id,
        followingUserId: creator.id
      }
    })
  ]);

  const posts = await Promise.all([
    prisma.post.create({
      data: {
        authorId: creator.id,
        postType: "review",
        caption: `Top creator post ${suffix}`,
        status: "approved",
        visibility: "public",
        viewCount: 100,
        likeCount: 20,
        commentCount: 5,
        shareCount: 3,
        saveCount: 7
      }
    }),
    prisma.post.create({
      data: {
        authorId: creator.id,
        postType: "album",
        caption: `Pending creator post ${suffix}`,
        status: "pending",
        visibility: "public",
        viewCount: 20,
        likeCount: 2,
        commentCount: 1,
        shareCount: 0,
        saveCount: 1
      }
    }),
    prisma.post.create({
      data: {
        authorId: creator.id,
        postType: "event",
        caption: `Hidden creator post ${suffix}`,
        status: "hidden",
        visibility: "private",
        viewCount: 50,
        likeCount: 4,
        commentCount: 2,
        shareCount: 1,
        saveCount: 2
      }
    }),
    prisma.post.create({
      data: {
        authorId: otherCreator.id,
        postType: "review",
        caption: `Other creator post ${suffix}`,
        status: "approved",
        visibility: "public",
        viewCount: 999,
        likeCount: 99,
        commentCount: 99,
        shareCount: 99,
        saveCount: 99
      }
    })
  ]);
  const [topPost, pendingPost, hiddenPost, otherPost] = posts;

  const creatorToken = signAccessToken(creator);
  const otherCreatorToken = signAccessToken(otherCreator);
  const adminToken = signAccessToken(admin);
  const userToken = signAccessToken(regularUser);
  const server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  t.after(async () => {
    try {
      await prisma.post.deleteMany({
        where: { id: { in: posts.map((post) => post.id) } }
      });
      await prisma.user.deleteMany({
        where: { id: { in: users.map((user) => user.id) } }
      });
    } finally {
      await new Promise((resolve) => server.close(resolve));
      await prisma.$disconnect().catch(() => undefined);
    }
  });

  const unauthenticated = await request(baseUrl, "/api/creator/stats");
  assert.equal(unauthenticated.response.status, 401);

  const forbiddenRole = await request(
    baseUrl,
    "/api/creator/stats",
    userToken
  );
  assert.equal(forbiddenRole.response.status, 403);

  const stats = await request(baseUrl, "/api/creator/stats", creatorToken);
  assert.equal(stats.response.status, 200);
  assert.equal(stats.body.data.stats.posts.total, 3);
  assert.equal(stats.body.data.stats.posts.approved, 1);
  assert.equal(stats.body.data.stats.posts.pending, 1);
  assert.equal(stats.body.data.stats.audience.followers, 1);
  assert.equal(stats.body.data.stats.totals.views, 170);
  assert.equal(stats.body.data.stats.totals.engagement, 48);

  const pendingPosts = await request(
    baseUrl,
    "/api/creator/posts?status=pending&sort=views",
    creatorToken
  );
  assert.equal(pendingPosts.response.status, 200);
  assert.equal(pendingPosts.body.pagination.total, 1);
  assert.equal(pendingPosts.body.data.items[0].id, pendingPost.id);
  assert.equal(pendingPosts.body.data.items[0].status, "pending");

  const topPosts = await request(
    baseUrl,
    "/api/creator/top-posts?metric=engagement&limit=2",
    creatorToken
  );
  assert.equal(topPosts.response.status, 200);
  assert.equal(topPosts.body.data.items[0].post.id, topPost.id);
  assert.equal(topPosts.body.data.items[0].metricValue, 35);
  assert.equal(topPosts.body.data.items[0].rank, 1);

  const analytics = await request(
    baseUrl,
    "/api/creator/analytics?period=30d",
    creatorToken
  );
  assert.equal(analytics.response.status, 200);
  assert.equal(analytics.body.data.analytics.summary.posts, 3);
  assert.equal(analytics.body.data.analytics.summary.views, 170);
  assert.equal(analytics.body.data.analytics.summary.engagement, 48);
  assert.ok(analytics.body.data.analytics.daily.length >= 1);
  assert.equal(
    analytics.body.data.analytics.methodology,
    "Current post counters grouped by each post creation date"
  );

  const postAnalytics = await request(
    baseUrl,
    `/api/analytics/posts/${topPost.id}`,
    creatorToken
  );
  assert.equal(postAnalytics.response.status, 200);
  assert.equal(postAnalytics.body.data.analytics.metrics.engagement, 35);
  assert.equal(postAnalytics.body.data.analytics.metrics.engagementRate, 35);
  assert.equal(postAnalytics.body.data.analytics.rankByEngagement, 1);

  const otherPostDenied = await request(
    baseUrl,
    `/api/analytics/posts/${otherPost.id}`,
    creatorToken
  );
  assert.equal(otherPostDenied.response.status, 404);

  const otherCreatorScopeDenied = await request(
    baseUrl,
    `/api/creator/stats?creator_id=${otherCreator.id}`,
    creatorToken
  );
  assert.equal(otherCreatorScopeDenied.response.status, 403);

  const adminStats = await request(
    baseUrl,
    `/api/creator/stats?creator_id=${creator.id}`,
    adminToken
  );
  assert.equal(adminStats.response.status, 200);
  assert.equal(adminStats.body.data.stats.creator.id, creator.id);

  const adminPostAnalytics = await request(
    baseUrl,
    `/api/analytics/posts/${hiddenPost.id}?creator_id=${creator.id}`,
    adminToken
  );
  assert.equal(adminPostAnalytics.response.status, 200);
  assert.equal(adminPostAnalytics.body.data.analytics.post.status, "hidden");

  const invalidMetric = await request(
    baseUrl,
    "/api/creator/top-posts?metric=invalid",
    creatorToken
  );
  assert.equal(invalidMetric.response.status, 422);

  const otherCreatorOwnStats = await request(
    baseUrl,
    "/api/creator/stats",
    otherCreatorToken
  );
  assert.equal(otherCreatorOwnStats.response.status, 200);
  assert.equal(otherCreatorOwnStats.body.data.stats.posts.total, 1);
});
