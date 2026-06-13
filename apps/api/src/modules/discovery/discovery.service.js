import { prisma } from "../../common/utils/prisma.js";
import { distanceKm } from "../../common/utils/discovery.js";
import {
  serializePlace,
  serializePost,
  serializeTag
} from "./discovery.serializer.js";
import { getPlaces } from "../places/places.service.js";
import { searchPosts } from "../posts/posts.service.js";
import { findTags } from "../tags/tags.service.js";
import { placeCardInclude } from "../places/places.repository.js";

export async function unifiedSearch(query) {
  const [places, posts, tags] = await Promise.all([
    getPlaces({
      q: query.q,
      sort: "popular",
      page: query.page,
      limit: query.limit,
      radius: 10
    }),
    searchPosts(query.q, query),
    findTags(query.q, query.limit)
  ]);

  return {
    query: query.q,
    places: {
      items: places.items,
      pagination: places.pagination
    },
    posts: {
      items: posts.items,
      pagination: posts.pagination
    },
    tags: {
      items: tags,
      total: tags.length
    }
  };
}

async function preferenceTagIds(userId) {
  if (!userId) return [];
  const preferences = await prisma.userTagPreference.findMany({
    where: { userId },
    orderBy: [{ score: "desc" }, { lastInteractedAt: "desc" }],
    take: 10,
    select: { tagId: true }
  });
  return preferences.map((item) => item.tagId);
}

export async function getRecommendations(query, userId) {
  const preferredTags = await preferenceTagIds(userId);
  const origin =
    query.lat !== undefined ? { lat: query.lat, lng: query.lng } : null;

  const [places, posts, tags] = await Promise.all([
    prisma.place.findMany({
      where: { status: "approved" },
      orderBy: [{ ratingCount: "desc" }, { ratingAvg: "desc" }],
      take: Math.max(query.limit * 3, 50),
      include: placeCardInclude
    }),
    prisma.post.findMany({
      where: {
        status: "approved",
        visibility: "public",
        author: { status: "active" },
        ...(preferredTags.length > 0
          ? { tags: { some: { tagId: { in: preferredTags } } } }
          : {})
      },
      orderBy: [
        { likeCount: "desc" },
        { commentCount: "desc" },
        { createdAt: "desc" }
      ],
      take: query.limit,
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
    prisma.tag.findMany({
      where: {
        status: "active",
        ...(preferredTags.length > 0 ? { id: { in: preferredTags } } : {})
      },
      orderBy: [{ usageCount: "desc" }],
      take: Math.min(query.limit, 10)
    })
  ]);

  const rankedPlaces = places
    .map((place) => ({
      place,
      distance: origin
        ? distanceKm(origin.lat, origin.lng, place.lat, place.lng)
        : null
    }))
    .sort((a, b) => {
      if (origin) return (a.distance ?? Infinity) - (b.distance ?? Infinity);
      return (
        b.place.ratingCount - a.place.ratingCount ||
        Number(b.place.ratingAvg) - Number(a.place.ratingAvg)
      );
    })
    .slice(0, query.limit)
    .map(({ place }) => serializePlace(place, origin));

  return {
    strategy:
      preferredTags.length > 0
        ? "personalized_tag_popularity"
        : origin
          ? "nearby_popularity"
          : "popularity",
    places: rankedPlaces,
    posts: posts.map(serializePost),
    tags: tags.map(serializeTag)
  };
}
