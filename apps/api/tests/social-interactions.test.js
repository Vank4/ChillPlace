import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "../src/app.js";
import { prisma } from "../src/common/utils/prisma.js";
import { signAccessToken } from "../src/common/utils/jwt.js";

async function request(baseUrl, path, token, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  const body = response.status === 204 ? null : await response.json();
  return { response, body };
}

test("social interactions API workflow", async (t) => {
  const suffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const users = await Promise.all(
    [
      ["social_user", "Social User", "user"],
      ["social_other", "Social Other", "user"],
      ["social_business", "Social Business", "business"]
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
  const [user, otherUser, businessUser] = users;
  const business = await prisma.businessProfile.create({
    data: {
      userId: businessUser.id,
      businessName: `Social Business ${suffix}`,
      status: "approved"
    }
  });
  const place = await prisma.place.create({
    data: {
      name: `Social Place ${suffix}`,
      slug: `social-place-${suffix}`,
      status: "approved",
      businessProfileId: business.id
    }
  });
  const post = await prisma.post.create({
    data: {
      authorId: businessUser.id,
      placeId: place.id,
      postType: "review",
      caption: `Social post ${suffix}`,
      status: "approved",
      visibility: "public"
    }
  });

  const userToken = signAccessToken(user);
  const otherToken = signAccessToken(otherUser);
  const businessToken = signAccessToken(businessUser);
  const server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  t.after(async () => {
    try {
      await prisma.report.deleteMany({
        where: { reporterId: { in: users.map((item) => item.id) } }
      });
      await prisma.post.delete({ where: { id: post.id } }).catch(() => undefined);
      await prisma.place
        .delete({ where: { id: place.id } })
        .catch(() => undefined);
      await prisma.businessProfile
        .delete({ where: { id: business.id } })
        .catch(() => undefined);
      await prisma.user.deleteMany({
        where: { id: { in: users.map((item) => item.id) } }
      });
    } finally {
      await new Promise((resolve) => server.close(resolve));
      await prisma.$disconnect().catch(() => undefined);
    }
  });

  const unauthenticatedLike = await request(
    baseUrl,
    `/api/posts/${post.id}/like`,
    null,
    { method: "POST" }
  );
  assert.equal(unauthenticatedLike.response.status, 401);

  const like = await request(baseUrl, `/api/posts/${post.id}/like`, userToken, {
    method: "POST"
  });
  assert.equal(like.response.status, 200);
  assert.equal(like.body.data.liked, true);
  assert.equal(like.body.data.likeCount, 1);

  const unlike = await request(
    baseUrl,
    `/api/posts/${post.id}/like`,
    userToken,
    { method: "POST" }
  );
  assert.equal(unlike.body.data.liked, false);
  assert.equal(unlike.body.data.likeCount, 0);

  const save = await request(baseUrl, `/api/posts/${post.id}/save`, userToken, {
    method: "POST"
  });
  assert.equal(save.body.data.saved, true);
  assert.equal(save.body.data.saveCount, 1);

  const saved = await request(baseUrl, "/api/users/me/saved", userToken);
  assert.equal(saved.response.status, 200);
  assert.equal(saved.body.data.items[0].post.id, post.id);

  const favorite = await request(
    baseUrl,
    `/api/places/${place.id}/favorite`,
    userToken,
    { method: "POST" }
  );
  assert.equal(favorite.body.data.favorited, true);
  assert.equal(favorite.body.data.favoriteCount, 1);

  const favorites = await request(baseUrl, "/api/favorites", userToken);
  assert.equal(favorites.response.status, 200);
  assert.equal(favorites.body.data.items[0].place.id, place.id);

  const comment = await request(
    baseUrl,
    `/api/posts/${post.id}/comments`,
    userToken,
    {
      method: "POST",
      body: JSON.stringify({ content: "A useful social comment" })
    }
  );
  assert.equal(comment.response.status, 201);
  assert.equal(comment.body.data.commentCount, 1);
  const commentId = comment.body.data.comment.id;

  const reply = await request(
    baseUrl,
    `/api/posts/${post.id}/comments`,
    otherToken,
    {
      method: "POST",
      body: JSON.stringify({
        content: "A reply to the social comment",
        parentId: commentId
      })
    }
  );
  assert.equal(reply.response.status, 201);
  assert.equal(reply.body.data.commentCount, 2);

  const nestedReply = await request(
    baseUrl,
    `/api/posts/${post.id}/comments`,
    userToken,
    {
      method: "POST",
      body: JSON.stringify({
        content: "Nested reply should fail",
        parentId: reply.body.data.comment.id
      })
    }
  );
  assert.equal(nestedReply.response.status, 422);

  const comments = await request(
    baseUrl,
    `/api/posts/${post.id}/comments`,
    null
  );
  assert.equal(comments.response.status, 200);
  assert.equal(comments.body.data.items[0].replies.length, 1);

  const review = await request(
    baseUrl,
    `/api/places/${place.id}/reviews`,
    userToken,
    {
      method: "POST",
      body: JSON.stringify({ rating: 4, content: "A solid place" })
    }
  );
  assert.equal(review.response.status, 201);
  assert.equal(review.body.data.ratingAvg, 4);
  assert.equal(review.body.data.ratingCount, 1);
  const reviewId = review.body.data.review.id;

  const duplicateReview = await request(
    baseUrl,
    `/api/places/${place.id}/reviews`,
    userToken,
    {
      method: "POST",
      body: JSON.stringify({ rating: 5, content: "Duplicate review" })
    }
  );
  assert.equal(duplicateReview.response.status, 409);

  const forbiddenUpdate = await request(
    baseUrl,
    `/api/reviews/${reviewId}`,
    otherToken,
    {
      method: "PATCH",
      body: JSON.stringify({ rating: 1 })
    }
  );
  assert.equal(forbiddenUpdate.response.status, 403);

  const updateReview = await request(
    baseUrl,
    `/api/reviews/${reviewId}`,
    userToken,
    {
      method: "PATCH",
      body: JSON.stringify({ rating: 5, content: "Updated review" })
    }
  );
  assert.equal(updateReview.response.status, 200);
  assert.equal(updateReview.body.data.ratingAvg, 5);

  const forbiddenReply = await request(
    baseUrl,
    `/api/reviews/${reviewId}/reply`,
    otherToken,
    {
      method: "POST",
      body: JSON.stringify({ content: "Not the business owner" })
    }
  );
  assert.equal(forbiddenReply.response.status, 403);

  const reviewReply = await request(
    baseUrl,
    `/api/reviews/${reviewId}/reply`,
    businessToken,
    {
      method: "POST",
      body: JSON.stringify({ content: "Thank you for your review" })
    }
  );
  assert.equal(reviewReply.response.status, 201);
  assert.equal(reviewReply.body.data.reply.reviewId, reviewId);

  const publicReviews = await request(
    baseUrl,
    `/api/places/${place.id}/reviews`,
    null
  );
  assert.equal(publicReviews.response.status, 200);
  assert.equal(publicReviews.body.data.items[0].reply.id, reviewReply.body.data.reply.id);

  const duplicateReply = await request(
    baseUrl,
    `/api/reviews/${reviewId}/reply`,
    businessToken,
    {
      method: "POST",
      body: JSON.stringify({ content: "A second reply" })
    }
  );
  assert.equal(duplicateReply.response.status, 409);

  const report = await request(baseUrl, "/api/reports", userToken, {
    method: "POST",
    body: JSON.stringify({
      targetType: "post",
      targetId: post.id,
      reason: "This is a valid test report reason"
    })
  });
  assert.equal(report.response.status, 201);
  assert.equal(report.body.data.report.status, "pending");

  const duplicateReport = await request(baseUrl, "/api/reports", userToken, {
    method: "POST",
    body: JSON.stringify({
      targetType: "post",
      targetId: post.id,
      reason: "This is another valid report reason"
    })
  });
  assert.equal(duplicateReport.response.status, 409);

  const postCounters = await prisma.post.findUnique({
    where: { id: post.id },
    select: { likeCount: true, saveCount: true, commentCount: true }
  });
  assert.deepEqual(postCounters, {
    likeCount: 0,
    saveCount: 1,
    commentCount: 2
  });

  const notificationTypes = await prisma.notification.findMany({
    where: { userId: { in: [user.id, businessUser.id] } },
    select: { type: true }
  });
  const types = new Set(notificationTypes.map((item) => item.type));
  assert.ok(types.has("post_like"));
  assert.ok(types.has("post_comment"));
  assert.ok(types.has("comment_reply"));
  assert.ok(types.has("place_review"));
  assert.ok(types.has("review_reply"));

  const unsave = await request(
    baseUrl,
    `/api/posts/${post.id}/save`,
    userToken,
    { method: "POST" }
  );
  assert.equal(unsave.body.data.saved, false);
  assert.equal(unsave.body.data.saveCount, 0);

  const unfavorite = await request(
    baseUrl,
    `/api/places/${place.id}/favorite`,
    userToken,
    { method: "POST" }
  );
  assert.equal(unfavorite.body.data.favorited, false);
  assert.equal(unfavorite.body.data.favoriteCount, 0);
});
