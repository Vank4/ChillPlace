import { prisma } from "../../common/utils/prisma.js";
import { placeCardInclude } from "../places/places.repository.js";

export const creatorPostInclude = {
  author: {
    select: {
      id: true,
      username: true,
      fullName: true,
      avatarUrl: true,
      role: true
    }
  },
  place: { include: placeCardInclude },
  media: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
  tags: {
    include: { tag: true }
  },
  promotion: true
};

export function findCreatorAccount(id) {
  return prisma.user.findFirst({
    where: { id, role: "creator", status: "active" },
    select: {
      id: true,
      username: true,
      fullName: true,
      avatarUrl: true,
      coverUrl: true,
      bio: true,
      location: true,
      creatorProfile: true,
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true
        }
      }
    }
  });
}

export function aggregateCreatorPosts(authorId) {
  return prisma.post.aggregate({
    where: { authorId, status: { not: "deleted" } },
    _count: { id: true },
    _sum: {
      viewCount: true,
      likeCount: true,
      commentCount: true,
      shareCount: true,
      saveCount: true
    },
    _avg: {
      viewCount: true,
      likeCount: true,
      commentCount: true,
      shareCount: true,
      saveCount: true
    }
  });
}

export function countCreatorPostsByStatus(authorId) {
  return prisma.post.groupBy({
    by: ["status"],
    where: { authorId },
    _count: { id: true }
  });
}

export function countCreatorPostsByType(authorId, createdAt) {
  return prisma.post.groupBy({
    by: ["postType"],
    where: {
      authorId,
      status: { not: "deleted" },
      ...(createdAt ? { createdAt: { gte: createdAt } } : {})
    },
    _count: { id: true },
    _sum: {
      viewCount: true,
      likeCount: true,
      commentCount: true,
      shareCount: true,
      saveCount: true
    }
  });
}

export function listCreatorPosts(authorId, query) {
  const where = {
    authorId,
    ...(query.status ? { status: query.status } : {}),
    ...(query.type ? { postType: query.type } : {}),
    ...(query.q
      ? {
          OR: [
            { caption: { contains: query.q } },
            { place: { is: { name: { contains: query.q } } } },
            {
              tags: {
                some: {
                  tag: {
                    OR: [
                      { name: { contains: query.q } },
                      { slug: { contains: query.q } }
                    ]
                  }
                }
              }
            }
          ]
        }
      : {})
  };
  const orderBy = {
    newest: [{ createdAt: "desc" }, { id: "desc" }],
    oldest: [{ createdAt: "asc" }, { id: "asc" }],
    views: [{ viewCount: "desc" }, { id: "desc" }],
    likes: [{ likeCount: "desc" }, { id: "desc" }],
    comments: [{ commentCount: "desc" }, { id: "desc" }],
    saves: [{ saveCount: "desc" }, { id: "desc" }]
  }[query.sort];

  return prisma.$transaction([
    prisma.post.findMany({
      where,
      orderBy,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: creatorPostInclude
    }),
    prisma.post.count({ where })
  ]);
}

export function listCreatorPostsForRanking(authorId, limit = 500) {
  return prisma.post.findMany({
    where: { authorId, status: { not: "deleted" } },
    orderBy: [{ createdAt: "desc" }],
    take: limit,
    include: creatorPostInclude
  });
}

export function listCreatorPostsForAnalytics(authorId, createdAt) {
  return prisma.post.findMany({
    where: {
      authorId,
      status: { not: "deleted" },
      ...(createdAt ? { createdAt: { gte: createdAt } } : {})
    },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    select: {
      id: true,
      postType: true,
      status: true,
      viewCount: true,
      likeCount: true,
      commentCount: true,
      shareCount: true,
      saveCount: true,
      createdAt: true
    }
  });
}

export function findCreatorPost(authorId, postId) {
  return prisma.post.findFirst({
    where: { id: postId, authorId, status: { not: "deleted" } },
    include: creatorPostInclude
  });
}
