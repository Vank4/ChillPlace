import { AppError } from "../../common/errors/AppError.js";
import { createPagination } from "../../common/utils/apiResponse.js";
import { distanceKm, isOpenNow } from "../../common/utils/discovery.js";
import {
  serializeCategory,
  serializePlace,
  serializePost,
  serializeReview
} from "../discovery/discovery.serializer.js";
import {
  findPlaceBySlug,
  findPublicPlaceById,
  listActiveCategories,
  listPlaceCandidates,
  listPlacesPage,
  listPlacePromotions,
  listPlaceReviews,
  listRelatedPosts
} from "./places.repository.js";

function originFrom(query) {
  return query.lat !== undefined ? { lat: query.lat, lng: query.lng } : null;
}

function filterAndSortPlaces(places, query) {
  const origin = originFrom(query);
  let items = places.map((place) => ({
    place,
    distance:
      origin && place.lat !== null && place.lng !== null
        ? distanceKm(origin.lat, origin.lng, place.lat, place.lng)
        : null
  }));

  if (query.open_now) {
    items = items.filter(({ place }) => isOpenNow(place.openingHours) === true);
  }
  if (origin && query.radius) {
    items = items.filter(
      ({ distance }) => distance !== null && distance <= query.radius
    );
  }

  const sorters = {
    distance: (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity),
    rating: (a, b) =>
      Number(b.place.ratingAvg) - Number(a.place.ratingAvg) ||
      b.place.ratingCount - a.place.ratingCount,
    newest: (a, b) => b.place.id - a.place.id,
    popular: (a, b) =>
      b.place.ratingCount - a.place.ratingCount ||
      Number(b.place.ratingAvg) - Number(a.place.ratingAvg)
  };
  items.sort(sorters[query.sort] ?? sorters.popular);
  return items.map(({ place }) => serializePlace(place, origin));
}

export async function getCategories() {
  return (await listActiveCategories()).map(serializeCategory);
}

export async function getPlaces(query) {
  const requiresRuntimeFilter =
    query.open_now || query.lat !== undefined || query.sort === "distance";

  if (requiresRuntimeFilter) {
    const filtered = filterAndSortPlaces(
      await listPlaceCandidates(query),
      query
    );
    const start = (query.page - 1) * query.limit;
    return {
      items: filtered.slice(start, start + query.limit),
      pagination: createPagination({
        page: query.page,
        limit: query.limit,
        total: filtered.length
      })
    };
  }

  const [places, total] = await listPlacesPage(query);
  return {
    items: places.map((place) => serializePlace(place)),
    pagination: createPagination({ page: query.page, limit: query.limit, total })
  };
}

export async function getNearbyPlaces(query) {
  return getPlaces(query);
}

export async function getMapPlaces(query) {
  const places = await listPlaceCandidates(query, 1000);
  return filterAndSortPlaces(places, { ...query, sort: "popular" }).slice(
    0,
    query.limit
  );
}

export async function getPlaceDetail(slug) {
  const place = await findPlaceBySlug(slug);
  if (!place) throw AppError.notFound("Place not found");

  return {
    ...serializePlace(place),
    creator: place.creator,
    business: place.business,
    stats: {
      reviewCount: place._count.reviews,
      postCount: place._count.posts,
      favoriteCount: place._count.favorites
    }
  };
}

async function assertPlace(id) {
  if (!(await findPublicPlaceById(id))) {
    throw AppError.notFound("Place not found");
  }
}

export async function getPlaceReviews(id, query) {
  await assertPlace(id);
  const [reviews, total] = await listPlaceReviews(id, query);
  return {
    items: reviews.map(serializeReview),
    pagination: createPagination({ ...query, total })
  };
}

export async function getPlacePromotions(id, query) {
  await assertPlace(id);
  const [promotions, total] = await listPlacePromotions(id, query);
  return {
    items: promotions.map((promotion) => ({
      id: promotion.id,
      title: promotion.title,
      description: promotion.description,
      discountText: promotion.discountText,
      conditions: promotion.conditions,
      validFrom: promotion.validFrom,
      validTo: promotion.validTo,
      post: serializePost({
        ...promotion.post,
        promotion: undefined
      })
    })),
    pagination: createPagination({ ...query, total })
  };
}

export async function getRelatedPosts(id, query) {
  await assertPlace(id);
  const [posts, total] = await listRelatedPosts(id, query);
  return {
    items: posts.map(serializePost),
    pagination: createPagination({ ...query, total })
  };
}
