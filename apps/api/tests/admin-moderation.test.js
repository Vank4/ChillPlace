import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "../src/app.js";
import { prisma } from "../src/common/utils/prisma.js";
import { signAccessToken } from "../src/common/utils/jwt.js";

async function request(baseUrl, route, token, options = {}) {
  const response = await fetch(`${baseUrl}${route}`, {
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

test("admin moderation and role request API workflow", async (t) => {
  const suffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const slugSuffix = suffix.replaceAll("_", "-");
  const users = await Promise.all(
    [
      ["moderation_admin", "Moderation Admin", "admin"],
      ["creator_candidate", "Creator Candidate", "user"],
      ["business_candidate", "Business Candidate", "user"],
      ["moderation_target", "Moderation Target", "user"],
      ["moderation_reporter", "Moderation Reporter", "user"]
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
  const [admin, creatorCandidate, businessCandidate, targetUser, reporter] =
    users;

  const baseCategory = await prisma.category.create({
    data: {
      name: `Moderation Base ${suffix}`,
      slug: `moderation-base-${suffix}`
    }
  });
  const place = await prisma.place.create({
    data: {
      name: `Moderation Place ${suffix}`,
      slug: `moderation-place-${suffix}`,
      categoryId: baseCategory.id,
      createdByUserId: targetUser.id,
      status: "pending"
    }
  });
  const post = await prisma.post.create({
    data: {
      authorId: targetUser.id,
      placeId: place.id,
      postType: "review",
      caption: "Content awaiting moderation",
      status: "approved",
      commentCount: 1
    }
  });
  const comment = await prisma.comment.create({
    data: {
      postId: post.id,
      userId: reporter.id,
      content: "Comment awaiting moderation",
      status: "approved"
    }
  });
  const report = await prisma.report.create({
    data: {
      reporterId: reporter.id,
      targetType: "post",
      targetId: post.id,
      reason: "This content should be reviewed",
      status: "pending"
    }
  });
  const [sourceTag, targetTag] = await Promise.all([
    prisma.tag.create({
      data: {
        name: `Source Tag ${suffix}`,
        slug: `source-tag-${suffix}`,
        usageCount: 1
      }
    }),
    prisma.tag.create({
      data: {
        name: `Target Tag ${suffix}`,
        slug: `target-tag-${suffix}`,
        usageCount: 1
      }
    })
  ]);
  await prisma.postTag.createMany({
    data: [
      { postId: post.id, tagId: sourceTag.id },
      { postId: post.id, tagId: targetTag.id }
    ]
  });
  await prisma.userTagPreference.createMany({
    data: [
      { userId: reporter.id, tagId: sourceTag.id, score: 2 },
      { userId: reporter.id, tagId: targetTag.id, score: 3 }
    ]
  });

  const adminToken = signAccessToken(admin);
  const creatorToken = signAccessToken(creatorCandidate);
  const businessToken = signAccessToken(businessCandidate);
  const userToken = signAccessToken(targetUser);
  const server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  t.after(async () => {
    try {
      await prisma.post.deleteMany({ where: { id: post.id } });
      await prisma.place.deleteMany({ where: { id: place.id } });
      await prisma.tag.deleteMany({
        where: { id: { in: [sourceTag.id, targetTag.id] } }
      });
      await prisma.category.deleteMany({
        where: { slug: { endsWith: suffix } }
      });
      await prisma.user.deleteMany({
        where: { id: { in: users.map((user) => user.id) } }
      });
    } finally {
      await new Promise((resolve) => server.close(resolve));
      await prisma.$disconnect().catch(() => undefined);
    }
  });

  const forbidden = await request(baseUrl, "/api/admin/stats", userToken);
  assert.equal(forbidden.response.status, 403);

  const creatorRequest = await request(
    baseUrl,
    "/api/role-requests/creator",
    creatorToken,
    {
      method: "POST",
      body: JSON.stringify({
        reason: "I consistently publish useful local discovery content.",
        evidenceUrl: "https://example.com/creator-proof",
        displayName: `Creator ${suffix}`,
        bio: "Local discovery creator",
        socialLinks: { portfolio: "https://example.com/creator" }
      })
    }
  );
  assert.equal(creatorRequest.response.status, 201);
  const creatorRequestId = creatorRequest.body.data.request.id;

  const duplicateCreatorRequest = await request(
    baseUrl,
    "/api/role-requests/creator",
    creatorToken,
    {
      method: "POST",
      body: JSON.stringify({
        reason: "I consistently publish useful local discovery content.",
        displayName: `Creator ${suffix}`
      })
    }
  );
  assert.equal(duplicateCreatorRequest.response.status, 409);

  const businessRequest = await request(
    baseUrl,
    "/api/role-requests/business",
    businessToken,
    {
      method: "POST",
      body: JSON.stringify({
        reason: "I own and operate this local venue and can verify it.",
        businessName: `Business ${suffix}`,
        slug: `business-request-${slugSuffix}`,
        phone: "0901234567",
        address: "District 1, Ho Chi Minh City"
      })
    }
  );
  assert.equal(businessRequest.response.status, 201);
  const businessRequestId = businessRequest.body.data.request.id;

  const myRequests = await request(
    baseUrl,
    "/api/role-requests/me",
    creatorToken
  );
  assert.equal(myRequests.response.status, 200);
  assert.equal(myRequests.body.data.items[0].id, creatorRequestId);

  const roleRequests = await request(
    baseUrl,
    "/api/admin/role-requests?status=pending",
    adminToken
  );
  assert.equal(roleRequests.response.status, 200);
  assert.ok(
    roleRequests.body.data.items.some((item) => item.id === creatorRequestId)
  );

  const approveCreator = await request(
    baseUrl,
    `/api/admin/role-requests/${creatorRequestId}/approve`,
    adminToken,
    {
      method: "PATCH",
      body: JSON.stringify({ adminNote: "Creator evidence verified." })
    }
  );
  assert.equal(approveCreator.response.status, 200);
  assert.equal(approveCreator.body.data.request.status, "approved");
  const promotedCreator = await prisma.user.findUnique({
    where: { id: creatorCandidate.id },
    include: { creatorProfile: true }
  });
  assert.equal(promotedCreator.role, "creator");
  assert.equal(promotedCreator.creatorProfile.displayName, `Creator ${suffix}`);

  const approveAgain = await request(
    baseUrl,
    `/api/admin/role-requests/${creatorRequestId}/approve`,
    adminToken,
    {
      method: "PATCH",
      body: JSON.stringify({ adminNote: "Already reviewed." })
    }
  );
  assert.equal(approveAgain.response.status, 409);

  const rejectBusiness = await request(
    baseUrl,
    `/api/admin/role-requests/${businessRequestId}/reject`,
    adminToken,
    {
      method: "PATCH",
      body: JSON.stringify({ adminNote: "Business proof is incomplete." })
    }
  );
  assert.equal(rejectBusiness.response.status, 200);
  assert.equal(rejectBusiness.body.data.request.status, "rejected");
  const rejectedBusiness = await prisma.user.findUnique({
    where: { id: businessCandidate.id },
    include: { businessProfile: true }
  });
  assert.equal(rejectedBusiness.role, "user");
  assert.equal(rejectedBusiness.businessProfile, null);

  const stats = await request(baseUrl, "/api/admin/stats", adminToken);
  assert.equal(stats.response.status, 200);
  assert.ok(stats.body.data.stats.users.admin.active >= 1);
  assert.ok(stats.body.data.stats.roleRequests.creator.approved >= 1);

  const invalidUserFilter = await request(
    baseUrl,
    "/api/admin/users?status=unknown",
    adminToken
  );
  assert.equal(invalidUserFilter.response.status, 422);

  const usersList = await request(
    baseUrl,
    `/api/admin/users?q=${encodeURIComponent(targetUser.username)}`,
    adminToken
  );
  assert.equal(usersList.response.status, 200);
  assert.equal(usersList.body.data.items[0].id, targetUser.id);
  assert.equal(usersList.body.data.items[0].passwordHash, undefined);

  const blockUser = await request(
    baseUrl,
    `/api/admin/users/${targetUser.id}/status`,
    adminToken,
    {
      method: "PATCH",
      body: JSON.stringify({ status: "blocked" })
    }
  );
  assert.equal(blockUser.response.status, 200);
  assert.equal(blockUser.body.data.user.status, "blocked");

  const deleteSelf = await request(
    baseUrl,
    `/api/admin/users/${admin.id}/status`,
    adminToken,
    {
      method: "PATCH",
      body: JSON.stringify({ status: "deleted" })
    }
  );
  assert.equal(deleteSelf.response.status, 409);

  const places = await request(
    baseUrl,
    "/api/admin/places?status=pending",
    adminToken
  );
  assert.equal(places.response.status, 200);
  assert.ok(places.body.data.items.some((item) => item.id === place.id));

  const approvePlace = await request(
    baseUrl,
    `/api/admin/places/${place.id}/status`,
    adminToken,
    {
      method: "PATCH",
      body: JSON.stringify({ status: "approved" })
    }
  );
  assert.equal(approvePlace.response.status, 200);
  assert.equal(approvePlace.body.data.place.status, "approved");

  const reports = await request(
    baseUrl,
    "/api/admin/reports?status=pending&target_type=post",
    adminToken
  );
  assert.equal(reports.response.status, 200);
  assert.ok(reports.body.data.items.some((item) => item.id === report.id));

  const resolveReport = await request(
    baseUrl,
    `/api/admin/reports/${report.id}/resolve`,
    adminToken,
    {
      method: "PATCH",
      body: JSON.stringify({
        resolution: "resolved",
        adminNote: "The report was reviewed and action was taken."
      })
    }
  );
  assert.equal(resolveReport.response.status, 200);
  assert.equal(resolveReport.body.data.report.status, "approved");

  const resolveAgain = await request(
    baseUrl,
    `/api/admin/reports/${report.id}/resolve`,
    adminToken,
    {
      method: "PATCH",
      body: JSON.stringify({
        resolution: "dismissed",
        adminNote: "Attempt to resolve the same report again."
      })
    }
  );
  assert.equal(resolveAgain.response.status, 409);

  const hidePost = await request(
    baseUrl,
    `/api/admin/posts/${post.id}/status`,
    adminToken,
    {
      method: "PATCH",
      body: JSON.stringify({ status: "hidden" })
    }
  );
  assert.equal(hidePost.response.status, 200);
  assert.equal(hidePost.body.data.post.status, "hidden");

  const hideComment = await request(
    baseUrl,
    `/api/admin/comments/${comment.id}/status`,
    adminToken,
    {
      method: "PATCH",
      body: JSON.stringify({ status: "hidden" })
    }
  );
  assert.equal(hideComment.response.status, 200);
  const postAfterCommentModeration = await prisma.post.findUnique({
    where: { id: post.id }
  });
  assert.equal(postAfterCommentModeration.commentCount, 0);

  const tags = await request(
    baseUrl,
    `/api/admin/tags?q=${encodeURIComponent(`Source Tag ${suffix}`)}`,
    adminToken
  );
  assert.equal(tags.response.status, 200);
  assert.equal(tags.body.data.items[0].id, sourceTag.id);

  const hideSourceTag = await request(
    baseUrl,
    `/api/admin/tags/${sourceTag.id}/status`,
    adminToken,
    {
      method: "PATCH",
      body: JSON.stringify({ status: "hidden" })
    }
  );
  assert.equal(hideSourceTag.response.status, 200);

  const mergeTags = await request(
    baseUrl,
    "/api/admin/tags/merge",
    adminToken,
    {
      method: "POST",
      body: JSON.stringify({
        sourceTagId: sourceTag.id,
        targetTagId: targetTag.id
      })
    }
  );
  assert.equal(mergeTags.response.status, 200);
  assert.equal(mergeTags.body.data.merge.source.status, "merged");
  assert.equal(mergeTags.body.data.merge.targetId, targetTag.id);
  assert.equal(
    await prisma.postTag.count({ where: { postId: post.id } }),
    1
  );
  const mergedPreference = await prisma.userTagPreference.findUnique({
    where: {
      userId_tagId: { userId: reporter.id, tagId: targetTag.id }
    }
  });
  assert.equal(Number(mergedPreference.score), 5);

  const mergedTagStatus = await request(
    baseUrl,
    `/api/admin/tags/${sourceTag.id}/status`,
    adminToken,
    {
      method: "PATCH",
      body: JSON.stringify({ status: "active" })
    }
  );
  assert.equal(mergedTagStatus.response.status, 409);

  const createCategory = await request(
    baseUrl,
    "/api/admin/categories",
    adminToken,
    {
      method: "POST",
      body: JSON.stringify({
        name: `Moderation Child ${suffix}`,
        slug: `moderation-child-${slugSuffix}`,
        parentId: baseCategory.id,
        icon: "map-pin"
      })
    }
  );
  assert.equal(createCategory.response.status, 201);
  const childCategoryId = createCategory.body.data.category.id;

  const updateCategory = await request(
    baseUrl,
    `/api/admin/categories/${childCategoryId}`,
    adminToken,
    {
      method: "PATCH",
      body: JSON.stringify({
        name: `Moderation Child Updated ${suffix}`,
        status: "inactive"
      })
    }
  );
  assert.equal(updateCategory.response.status, 200);
  assert.equal(updateCategory.body.data.category.status, "inactive");

  const selfParent = await request(
    baseUrl,
    `/api/admin/categories/${childCategoryId}`,
    adminToken,
    {
      method: "PATCH",
      body: JSON.stringify({ parentId: childCategoryId })
    }
  );
  assert.equal(selfParent.response.status, 422);

  const categories = await request(
    baseUrl,
    `/api/admin/categories?q=${encodeURIComponent("Moderation Child")}`,
    adminToken
  );
  assert.equal(categories.response.status, 200);
  assert.ok(
    categories.body.data.items.some((item) => item.id === childCategoryId)
  );

  const auditLogs = await request(
    baseUrl,
    `/api/admin/audit-logs?admin_id=${admin.id}`,
    adminToken
  );
  assert.equal(auditLogs.response.status, 200);
  assert.ok(auditLogs.body.data.items.length >= 10);
  assert.ok(
    auditLogs.body.data.items.some(
      (item) => item.action === "role_request.approve"
    )
  );

  const notifications = await prisma.notification.count({
    where: {
      userId: { in: [creatorCandidate.id, businessCandidate.id, reporter.id] }
    }
  });
  assert.equal(notifications, 3);
});
