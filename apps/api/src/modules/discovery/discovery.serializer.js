import {
  distanceKm,
  isOpenNow,
  toNumber
} from "../../common/utils/discovery.js";

export function serializeCategory(category) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    icon: category.icon,
    parentId: category.parentId,
    placeCount: category._count?.places
  };
}

export function serializePlace(place, origin) {
  const distance =
    origin && place.lat !== null && place.lng !== null
      ? distanceKm(origin.lat, origin.lng, place.lat, place.lng)
      : null;

  return {
    id: place.id,
    name: place.name,
    slug: place.slug,
    category: place.category ? serializeCategory(place.category) : null,
    address: place.address,
    ward: place.ward,
    district: place.district,
    city: place.city,
    lat: toNumber(place.lat),
    lng: toNumber(place.lng),
    priceMin: place.priceMin,
    priceMax: place.priceMax,
    openingHours: place.openingHours,
    isOpenNow: isOpenNow(place.openingHours),
    ratingAvg: toNumber(place.ratingAvg) ?? 0,
    ratingCount: place.ratingCount,
    distanceKm: distance === null ? null : Number(distance.toFixed(2)),
    media: (place.media ?? []).map((item) => ({
      id: item.id,
      type: item.mediaType,
      url: item.mediaUrl,
      thumbnailUrl: item.thumbnailUrl,
      sortOrder: item.sortOrder
    })),
    createdAt: place.createdAt,
    updatedAt: place.updatedAt
  };
}

export function serializePost(post) {
  return {
    id: post.id,
    postType: post.postType,
    caption: post.caption,
    viewCount: post.viewCount,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    shareCount: post.shareCount,
    saveCount: post.saveCount,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: post.author
      ? {
          id: post.author.id,
          username: post.author.username,
          fullName: post.author.fullName,
          avatarUrl: post.author.avatarUrl,
          role: post.author.role
        }
      : null,
    place: post.place ? serializePlace(post.place) : null,
    media: (post.media ?? []).map((item) => ({
      id: item.id,
      type: item.mediaType,
      url: item.mediaUrl,
      thumbnailUrl: item.thumbnailUrl,
      durationSeconds: item.durationSeconds,
      sortOrder: item.sortOrder
    })),
    tags: (post.tags ?? []).map(({ tag }) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      type: tag.type,
      usageCount: tag.usageCount
    })),
    promotion: post.promotion ?? null
  };
}

export function serializeReview(review) {
  return {
    id: review.id,
    rating: review.rating,
    content: review.content,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
    user: {
      id: review.user.id,
      username: review.user.username,
      fullName: review.user.fullName,
      avatarUrl: review.user.avatarUrl
    },
    reply:
      review.reply?.status === "approved" &&
      review.reply.user?.status === "active"
      ? {
          id: review.reply.id,
          content: review.reply.content,
          createdAt: review.reply.createdAt,
          updatedAt: review.reply.updatedAt,
          user: {
            id: review.reply.user.id,
            username: review.reply.user.username,
            fullName: review.reply.user.fullName,
            avatarUrl: review.reply.user.avatarUrl,
            role: review.reply.user.role
          }
        }
      : null
  };
}

export function serializeTag(tag) {
  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    type: tag.type,
    usageCount: tag.usageCount,
    postCount: tag._count?.posts
  };
}
