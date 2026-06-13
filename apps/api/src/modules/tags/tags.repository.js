import { prisma } from "../../common/utils/prisma.js";
import { publicPostInclude } from "../posts/posts.repository.js";
import { placeCardInclude } from "../places/places.repository.js";

export function listTrendingTags(limit) {
  return prisma.tag.findMany({
    where: { status: "active" },
    orderBy: [{ usageCount: "desc" }, { id: "desc" }],
    take: limit,
    include: {
      _count: {
        select: {
          posts: {
            where: {
              post: { status: "approved", visibility: "public" }
            }
          }
        }
      }
    }
  });
}

export function searchTags(q, limit) {
  return prisma.tag.findMany({
    where: {
      status: "active",
      OR: [{ name: { contains: q } }, { slug: { contains: q } }]
    },
    orderBy: [{ usageCount: "desc" }, { name: "asc" }],
    take: limit,
    include: { _count: { select: { posts: true } } }
  });
}

export function findTagBySlug(slug) {
  return prisma.tag.findFirst({
    where: {
      status: "active",
      OR: [{ slug }, { name: slug }]
    },
    include: {
      _count: {
        select: {
          posts: {
            where: {
              post: { status: "approved", visibility: "public" }
            }
          }
        }
      }
    }
  });
}

export async function getTagContent(tagId, limit = 20) {
  const posts = await prisma.post.findMany({
    where: {
      status: "approved",
      visibility: "public",
      author: { status: "active" },
      tags: { some: { tagId } }
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit,
    include: publicPostInclude
  });

  const placeIds = [
    ...new Set(posts.map((post) => post.placeId).filter(Boolean))
  ];
  const places =
    placeIds.length === 0
      ? []
      : await prisma.place.findMany({
          where: { id: { in: placeIds }, status: "approved" },
          take: limit,
          include: placeCardInclude
        });

  return { posts, places };
}

export async function listRelatedTags(tagId, limit) {
  const taggedPosts = await prisma.postTag.findMany({
    where: {
      tagId,
      post: { status: "approved", visibility: "public" }
    },
    select: { postId: true },
    take: 500
  });
  const postIds = taggedPosts.map((item) => item.postId);
  if (postIds.length === 0) return [];

  const related = await prisma.postTag.groupBy({
    by: ["tagId"],
    where: {
      postId: { in: postIds },
      tagId: { not: tagId },
      tag: { status: "active" }
    },
    _count: { tagId: true },
    orderBy: { _count: { tagId: "desc" } },
    take: limit
  });
  const ids = related.map((item) => item.tagId);
  const tags = await prisma.tag.findMany({
    where: { id: { in: ids }, status: "active" }
  });
  const countById = new Map(
    related.map((item) => [item.tagId, item._count.tagId])
  );
  return tags
    .map((tag) => ({ ...tag, relatedPostCount: countById.get(tag.id) }))
    .sort((a, b) => b.relatedPostCount - a.relatedPostCount);
}
