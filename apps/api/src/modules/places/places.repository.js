import { prisma } from "../../common/utils/prisma.js";

export const placeCardInclude = {
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
      parentId: true
    }
  },
  media: {
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    take: 5
  }
};

function publicPlaceWhere(query = {}) {
  const where = { status: "approved" };

  if (query.q) {
    where.OR = [
      { name: { contains: query.q } },
      { address: { contains: query.q } },
      { ward: { contains: query.q } },
      { district: { contains: query.q } },
      { city: { contains: query.q } }
    ];
  }
  if (query.category) {
    where.category = {
      status: "active",
      OR: [
        { slug: query.category },
        { name: { contains: query.category } }
      ]
    };
  }
  if (query.city) where.city = { contains: query.city };
  if (query.district) where.district = { contains: query.district };
  if (query.rating_min !== undefined) where.ratingAvg = { gte: query.rating_min };

  return where;
}

export function listActiveCategories() {
  return prisma.category.findMany({
    where: { status: "active" },
    orderBy: [{ name: "asc" }],
    include: {
      _count: {
        select: {
          places: { where: { status: "approved" } }
        }
      }
    }
  });
}

export function listPlaceCandidates(query, take = 1000) {
  const where = publicPlaceWhere(query);

  if (query.north !== undefined) {
    where.lat = { gte: query.south, lte: query.north };
    where.lng = { gte: query.west, lte: query.east };
  }

  return prisma.place.findMany({
    where,
    orderBy: [{ ratingCount: "desc" }, { ratingAvg: "desc" }, { id: "desc" }],
    take,
    include: placeCardInclude
  });
}

export function listPlacesPage(query) {
  const orderBy = {
    newest: [{ createdAt: "desc" }, { id: "desc" }],
    rating: [
      { ratingAvg: "desc" },
      { ratingCount: "desc" },
      { id: "desc" }
    ],
    popular: [
      { ratingCount: "desc" },
      { ratingAvg: "desc" },
      { id: "desc" }
    ]
  }[query.sort ?? "popular"];
  const where = publicPlaceWhere(query);

  return prisma.$transaction([
    prisma.place.findMany({
      where,
      orderBy,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: placeCardInclude
    }),
    prisma.place.count({ where })
  ]);
}

export function findPlaceBySlug(slug) {
  return prisma.place.findFirst({
    where: { slug, status: "approved" },
    include: {
      ...placeCardInclude,
      media: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }]
      },
      creator: {
        select: {
          id: true,
          username: true,
          fullName: true,
          avatarUrl: true,
          role: true
        }
      },
      business: {
        where: { status: "approved" },
        select: {
          id: true,
          businessName: true,
          phone: true,
          address: true,
          verifiedAt: true
        }
      },
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
  });
}

export function findPublicPlaceById(id) {
  return prisma.place.findFirst({
    where: { id, status: "approved" },
    select: { id: true }
  });
}

export function listPlaceReviews(placeId, { page, limit }) {
  const where = {
    placeId,
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
        }
      }
    }),
    prisma.review.count({ where })
  ]);
}

export function listPlacePromotions(placeId, { page, limit }, now = new Date()) {
  const where = {
    post: {
      placeId,
      status: "approved",
      visibility: "public"
    },
    status: "active",
    AND: [
      { OR: [{ validFrom: null }, { validFrom: { lte: now } }] },
      { OR: [{ validTo: null }, { validTo: { gte: now } }] }
    ]
  };
  return prisma.$transaction([
    prisma.promotion.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        post: {
          include: {
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
            media: { orderBy: { sortOrder: "asc" } },
            tags: {
              where: { tag: { status: "active" } },
              include: { tag: true }
            }
          }
        }
      }
    }),
    prisma.promotion.count({ where })
  ]);
}

export function listRelatedPosts(placeId, { page, limit }) {
  const where = {
    placeId,
    status: "approved",
    visibility: "public",
    author: { status: "active" }
  };
  return prisma.$transaction([
    prisma.post.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: {
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
        media: { orderBy: { sortOrder: "asc" } },
        tags: {
          where: { tag: { status: "active" } },
          include: { tag: true }
        },
        promotion: true
      }
    }),
    prisma.post.count({ where })
  ]);
}
