import { prisma } from "../../common/utils/prisma.js";
import { placeCardInclude } from "../places/places.repository.js";

export const publicPostInclude = {
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
    where: { tag: { status: "active" } },
    include: { tag: true }
  },
  promotion: true
};

export function listFeedPosts({ cursorId, limit, type, tag }) {
  const where = {
    status: "approved",
    visibility: "public",
    author: { status: "active" }
  };
  if (cursorId) where.id = { lt: cursorId };
  if (type) where.postType = type;
  if (tag) {
    where.tags = {
      some: {
        tag: {
          status: "active",
          OR: [{ slug: tag }, { name: tag }]
        }
      }
    };
  }

  return prisma.post.findMany({
    where,
    orderBy: [{ id: "desc" }],
    take: limit + 1,
    include: publicPostInclude
  });
}

export function findPublicPostById(id) {
  return prisma.post.findFirst({
    where: {
      id,
      status: "approved",
      visibility: "public",
      author: { status: "active" }
    },
    include: publicPostInclude
  });
}

export function searchPublicPosts(q, { page, limit }) {
  const where = {
    status: "approved",
    visibility: "public",
    author: { status: "active" },
    OR: [
      { caption: { contains: q } },
      { place: { is: { name: { contains: q }, status: "approved" } } },
      {
        tags: {
          some: {
            tag: {
              status: "active",
              OR: [{ name: { contains: q } }, { slug: { contains: q } }]
            }
          }
        }
      }
    ]
  };

  return prisma.$transaction([
    prisma.post.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: publicPostInclude
    }),
    prisma.post.count({ where })
  ]);
}
