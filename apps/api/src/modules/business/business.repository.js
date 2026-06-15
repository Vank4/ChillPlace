import { prisma } from "../../common/utils/prisma.js";
import { placeCardInclude } from "../places/places.repository.js";
import { publicPostInclude } from "../posts/posts.repository.js";

const businessInclude = {
  user: {
    select: {
      id: true,
      username: true,
      fullName: true,
      avatarUrl: true,
      coverUrl: true,
      email: true,
      status: true
    }
  },
  places: {
    orderBy: [{ id: "asc" }],
    include: {
      ...placeCardInclude,
      media: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
      _count: {
        select: {
          reviews: { where: { status: "approved" } },
          posts: { where: { status: "approved", visibility: "public" } },
          favorites: true
        }
      }
    }
  }
};

export function findBusinessByUserId(userId) {
  return prisma.businessProfile.findUnique({
    where: { userId },
    include: businessInclude
  });
}

export function findBusinessById(id) {
  return prisma.businessProfile.findUnique({
    where: { id },
    include: businessInclude
  });
}

export function findPublicBusinessBySlug(slug) {
  return prisma.businessProfile.findFirst({
    where: { slug, status: "approved", user: { status: "active" } },
    include: {
      ...businessInclude,
      places: {
        where: { status: "approved" },
        orderBy: [{ id: "asc" }],
        include: {
          ...placeCardInclude,
          media: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
          _count: {
            select: {
              reviews: { where: { status: "approved" } },
              posts: {
                where: { status: "approved", visibility: "public" }
              },
              favorites: true
            }
          }
        }
      }
    }
  });
}

export function updateBusinessProfile(id, data) {
  return prisma.businessProfile.update({
    where: { id },
    data,
    include: businessInclude
  });
}

export function findBusinessPlace(businessProfileId, placeId) {
  return prisma.place.findFirst({
    where: {
      businessProfileId,
      ...(placeId ? { id: placeId } : {})
    },
    orderBy: [{ id: "asc" }],
    include: {
      ...placeCardInclude,
      media: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
      _count: {
        select: {
          reviews: { where: { status: "approved" } },
          posts: { where: { status: "approved", visibility: "public" } },
          favorites: true
        }
      }
    }
  });
}

export function updateBusinessPlace(id, data) {
  return prisma.place.update({
    where: { id },
    data,
    include: {
      ...placeCardInclude,
      media: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
      _count: {
        select: {
          reviews: { where: { status: "approved" } },
          posts: { where: { status: "approved", visibility: "public" } },
          favorites: true
        }
      }
    }
  });
}

export function updatePlaceMenu(id, menuJson) {
  return prisma.place.update({
    where: { id },
    data: { menuJson },
    select: { id: true, menuJson: true, updatedAt: true }
  });
}

export function listBusinessMedia(placeId) {
  return prisma.placeMedia.findMany({
    where: { placeId },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }]
  });
}

export function createBusinessMedia(placeId, items) {
  return prisma.$transaction(
    items.map((item) =>
      prisma.placeMedia.create({
        data: { placeId, ...item }
      })
    )
  );
}

export async function reorderBusinessMedia(placeId, items) {
  return prisma.$transaction(async (tx) => {
    const count = await tx.placeMedia.count({
      where: { placeId, id: { in: items.map((item) => item.id) } }
    });
    if (count !== items.length) return null;
    await Promise.all(
      items.map((item) =>
        tx.placeMedia.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder }
        })
      )
    );
    return tx.placeMedia.findMany({
      where: { placeId },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }]
    });
  });
}

export function findBusinessMedia(placeId, id) {
  return prisma.placeMedia.findFirst({ where: { id, placeId } });
}

export function deleteBusinessMedia(id) {
  return prisma.placeMedia.delete({ where: { id } });
}

export async function getBusinessStatsData(businessProfileId) {
  const placeIds = (
    await prisma.place.findMany({
      where: { businessProfileId },
      select: { id: true }
    })
  ).map((place) => place.id);
  const [places, reviews, favorites, posts, promotions] = await Promise.all([
    prisma.place.aggregate({
      where: { businessProfileId },
      _count: { id: true },
      _sum: { ratingCount: true },
      _avg: { ratingAvg: true }
    }),
    prisma.review.aggregate({
      where: { placeId: { in: placeIds }, status: "approved" },
      _count: { id: true },
      _avg: { rating: true }
    }),
    prisma.favorite.count({ where: { placeId: { in: placeIds } } }),
    prisma.post.aggregate({
      where: {
        placeId: { in: placeIds },
        status: { not: "deleted" }
      },
      _count: { id: true },
      _sum: {
        viewCount: true,
        likeCount: true,
        commentCount: true,
        shareCount: true,
        saveCount: true
      }
    }),
    prisma.promotion.groupBy({
      by: ["status"],
      where: { businessProfileId },
      _count: { id: true }
    })
  ]);
  return { places, reviews, favorites, posts, promotions };
}

export function listBusinessReviews(businessProfileId, { page, limit }) {
  const where = {
    place: { businessProfileId },
    status: "approved",
    user: { status: "active" }
  };
  return prisma.$transaction([
    prisma.review.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true
          }
        },
        place: { select: { id: true, name: true, slug: true } },
        reply: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatarUrl: true,
                role: true,
                status: true
              }
            }
          }
        }
      }
    }),
    prisma.review.count({ where })
  ]);
}

export function listBusinessPromotions(businessProfileId, { page, limit }) {
  const where = { businessProfileId, status: { not: "deleted" } };
  return prisma.$transaction([
    prisma.promotion.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: { post: { include: publicPostInclude } }
    }),
    prisma.promotion.count({ where })
  ]);
}

export async function createBusinessPromotion(input) {
  return prisma.$transaction(async (tx) => {
    const post = await tx.post.create({
      data: {
        authorId: input.authorId,
        placeId: input.placeId,
        postType: "promotion",
        caption: input.caption ?? input.description ?? input.title,
        visibility: "public",
        status: "approved"
      }
    });
    return tx.promotion.create({
      data: {
        postId: post.id,
        businessProfileId: input.businessProfileId,
        title: input.title,
        description: input.description,
        discountText: input.discountText,
        conditions: input.conditions,
        validFrom: input.validFrom,
        validTo: input.validTo,
        status: "active"
      },
      include: { post: { include: publicPostInclude } }
    });
  });
}

export function findBusinessPromotion(businessProfileId, id) {
  return prisma.promotion.findFirst({
    where: { id, businessProfileId, status: { not: "deleted" } },
    include: { post: { include: publicPostInclude } }
  });
}

export async function updateBusinessPromotion(id, data, caption) {
  return prisma.$transaction(async (tx) => {
    const promotion = await tx.promotion.update({
      where: { id },
      data
    });
    if (caption !== undefined) {
      await tx.post.update({
        where: { id: promotion.postId },
        data: { caption }
      });
    }
    return tx.promotion.findUnique({
      where: { id },
      include: { post: { include: publicPostInclude } }
    });
  });
}

export async function softDeleteBusinessPromotion(id) {
  return prisma.$transaction(async (tx) => {
    const promotion = await tx.promotion.update({
      where: { id },
      data: { status: "deleted" }
    });
    await tx.post.update({
      where: { id: promotion.postId },
      data: { status: "deleted" }
    });
  });
}
