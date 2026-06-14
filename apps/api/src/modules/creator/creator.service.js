import { AppError } from "../../common/errors/AppError.js";
import { createPagination } from "../../common/utils/apiResponse.js";
import { serializePost } from "../discovery/discovery.serializer.js";
import {
  aggregateCreatorPosts,
  countCreatorPostsByStatus,
  countCreatorPostsByType,
  findCreatorAccount,
  findCreatorPost,
  listCreatorPosts,
  listCreatorPostsForAnalytics,
  listCreatorPostsForRanking
} from "./creator.repository.js";

function number(value) {
  return Number(value ?? 0);
}

function engagement(post) {
  return (
    post.likeCount + post.commentCount + post.shareCount + post.saveCount
  );
}

function engagementRate(post) {
  return post.viewCount > 0
    ? Number(((engagement(post) / post.viewCount) * 100).toFixed(2))
    : 0;
}

export async function resolveCreatorId(user, requestedId) {
  if (user.role === "creator") {
    if (requestedId && requestedId !== user.id) {
      throw AppError.forbidden("Creators can access only their own analytics");
    }
    return user.id;
  }

  const creatorId = requestedId ?? user.id;
  if (!(await findCreatorAccount(creatorId))) {
    throw AppError.notFound("Creator not found");
  }
  return creatorId;
}

async function requireCreator(id) {
  const creator = await findCreatorAccount(id);
  if (!creator) throw AppError.notFound("Creator not found");
  return creator;
}

export async function getCreatorStats(creatorId) {
  const [creator, aggregate, statuses] = await Promise.all([
    requireCreator(creatorId),
    aggregateCreatorPosts(creatorId),
    countCreatorPostsByStatus(creatorId)
  ]);
  const totals = {
    views: number(aggregate._sum.viewCount),
    likes: number(aggregate._sum.likeCount),
    comments: number(aggregate._sum.commentCount),
    shares: number(aggregate._sum.shareCount),
    saves: number(aggregate._sum.saveCount)
  };
  const statusCounts = Object.fromEntries(
    statuses.map((item) => [item.status, item._count.id])
  );
  const { _count, ...creatorProfile } = creator;

  return {
    creator: creatorProfile,
    posts: {
      total: aggregate._count.id,
      approved: statusCounts.approved ?? 0,
      pending: statusCounts.pending ?? 0,
      rejected: statusCounts.rejected ?? 0,
      hidden: statusCounts.hidden ?? 0,
      deleted: statusCounts.deleted ?? 0
    },
    audience: {
      followers: _count.following,
      following: _count.followers
    },
    totals: {
      ...totals,
      engagement: totals.likes + totals.comments + totals.shares + totals.saves
    },
    averagesPerPost: {
      views: Number(number(aggregate._avg.viewCount).toFixed(2)),
      likes: Number(number(aggregate._avg.likeCount).toFixed(2)),
      comments: Number(number(aggregate._avg.commentCount).toFixed(2)),
      shares: Number(number(aggregate._avg.shareCount).toFixed(2)),
      saves: Number(number(aggregate._avg.saveCount).toFixed(2))
    }
  };
}

export async function getCreatorPosts(creatorId, query) {
  await requireCreator(creatorId);
  const [posts, total] = await listCreatorPosts(creatorId, query);
  return {
    items: posts.map((post) => ({
      ...serializePost(post),
      status: post.status,
      visibility: post.visibility,
      engagement: engagement(post),
      engagementRate: engagementRate(post)
    })),
    pagination: createPagination({ ...query, total })
  };
}

export async function getTopCreatorPosts(creatorId, query) {
  await requireCreator(creatorId);
  const posts = await listCreatorPostsForRanking(creatorId);
  const metricValue = {
    engagement,
    views: (post) => post.viewCount,
    likes: (post) => post.likeCount,
    comments: (post) => post.commentCount,
    saves: (post) => post.saveCount,
    shares: (post) => post.shareCount
  }[query.metric];

  return posts
    .sort(
      (left, right) =>
        metricValue(right) - metricValue(left) || right.id - left.id
    )
    .slice(0, query.limit)
    .map((post, index) => ({
      rank: index + 1,
      metric: query.metric,
      metricValue: metricValue(post),
      engagement: engagement(post),
      engagementRate: engagementRate(post),
      post: {
        ...serializePost(post),
        status: post.status,
        visibility: post.visibility
      }
    }));
}

function periodStart(period) {
  if (period === "all") return null;
  const days = { "7d": 7, "30d": 30, "90d": 90 }[period];
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function dailySeries(posts) {
  const buckets = new Map();
  for (const post of posts) {
    const date = post.createdAt.toISOString().slice(0, 10);
    const bucket = buckets.get(date) ?? {
      date,
      posts: 0,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      saves: 0,
      engagement: 0
    };
    bucket.posts += 1;
    bucket.views += post.viewCount;
    bucket.likes += post.likeCount;
    bucket.comments += post.commentCount;
    bucket.shares += post.shareCount;
    bucket.saves += post.saveCount;
    bucket.engagement += engagement(post);
    buckets.set(date, bucket);
  }
  return [...buckets.values()];
}

export async function getCreatorAnalytics(creatorId, period) {
  await requireCreator(creatorId);
  const start = periodStart(period);
  const [posts, byType] = await Promise.all([
    listCreatorPostsForAnalytics(creatorId, start),
    countCreatorPostsByType(creatorId, start)
  ]);
  const summary = posts.reduce(
    (result, post) => {
      result.posts += 1;
      result.views += post.viewCount;
      result.likes += post.likeCount;
      result.comments += post.commentCount;
      result.shares += post.shareCount;
      result.saves += post.saveCount;
      result.engagement += engagement(post);
      return result;
    },
    {
      posts: 0,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      saves: 0,
      engagement: 0
    }
  );

  return {
    period,
    from: start,
    to: new Date(),
    methodology:
      "Current post counters grouped by each post creation date",
    summary: {
      ...summary,
      engagementRate:
        summary.views > 0
          ? Number(((summary.engagement / summary.views) * 100).toFixed(2))
          : 0
    },
    daily: dailySeries(posts),
    byPostType: byType.map((item) => ({
      postType: item.postType,
      posts: item._count.id,
      views: number(item._sum.viewCount),
      likes: number(item._sum.likeCount),
      comments: number(item._sum.commentCount),
      shares: number(item._sum.shareCount),
      saves: number(item._sum.saveCount)
    }))
  };
}

export async function getCreatorPostAnalytics(creatorId, postId) {
  await requireCreator(creatorId);
  const post = await findCreatorPost(creatorId, postId);
  if (!post) throw AppError.notFound("Post not found");

  const allPosts = await listCreatorPostsForRanking(creatorId);
  const ranked = [...allPosts].sort(
    (left, right) => engagement(right) - engagement(left) || right.id - left.id
  );

  return {
    post: {
      ...serializePost(post),
      status: post.status,
      visibility: post.visibility
    },
    metrics: {
      views: post.viewCount,
      likes: post.likeCount,
      comments: post.commentCount,
      shares: post.shareCount,
      saves: post.saveCount,
      engagement: engagement(post),
      engagementRate: engagementRate(post)
    },
    rankByEngagement: ranked.findIndex((item) => item.id === post.id) + 1,
    creatorPostCount: ranked.length
  };
}
