import path from "node:path";
import { unlink } from "node:fs/promises";
import {
  cloudinaryAssetFromUrl,
  deleteCloudinaryAsset
} from "../../common/utils/cloudinary.js";
import { AppError } from "../../common/errors/AppError.js";
import { createPagination } from "../../common/utils/apiResponse.js";
import { uploadConfig } from "../../middlewares/upload.middleware.js";
import {
  serializePlace,
  serializePost,
  serializeReview
} from "../discovery/discovery.serializer.js";
import {
  createBusinessMedia,
  createBusinessPromotion,
  deleteBusinessMedia,
  findBusinessById,
  findBusinessByUserId,
  findBusinessMedia,
  findBusinessPlace,
  findBusinessPromotion,
  findPublicBusinessBySlug,
  getBusinessStatsData,
  listBusinessMedia,
  listBusinessPromotions,
  listBusinessReviews,
  reorderBusinessMedia,
  softDeleteBusinessPromotion,
  updateBusinessPlace,
  updateBusinessProfile,
  updateBusinessPromotion,
  updatePlaceMenu
} from "./business.repository.js";

function privateBusiness(profile) {
  return {
    id: profile.id,
    businessName: profile.businessName,
    slug: profile.slug,
    phone: profile.phone,
    address: profile.address,
    status: profile.status,
    verifiedAt: profile.verifiedAt,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
    owner: profile.user,
    places: profile.places.map((place) => ({
      ...serializePlace(place),
      status: place.status,
      menu: place.menuJson,
      stats: {
        reviews: place._count.reviews,
        posts: place._count.posts,
        favorites: place._count.favorites
      }
    }))
  };
}

function publicBusiness(profile) {
  return {
    id: profile.id,
    businessName: profile.businessName,
    slug: profile.slug,
    phone: profile.phone,
    address: profile.address,
    verifiedAt: profile.verifiedAt,
    owner: {
      id: profile.user.id,
      username: profile.user.username,
      fullName: profile.user.fullName,
      avatarUrl: profile.user.avatarUrl,
      coverUrl: profile.user.coverUrl
    },
    places: profile.places.map((place) => ({
      ...serializePlace(place),
      menu: place.menuJson,
      stats: {
        reviews: place._count.reviews,
        posts: place._count.posts,
        favorites: place._count.favorites
      }
    }))
  };
}

function serializeMedia(item) {
  return {
    id: item.id,
    placeId: item.placeId,
    type: item.mediaType,
    url: item.mediaUrl,
    thumbnailUrl: item.thumbnailUrl,
    sortOrder: item.sortOrder,
    createdAt: item.createdAt
  };
}

function serializePromotion(item) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    discountText: item.discountText,
    conditions: item.conditions,
    validFrom: item.validFrom,
    validTo: item.validTo,
    status: item.status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    post: serializePost(item.post)
  };
}

export async function resolveBusiness(user, requestedId, { approved = false } = {}) {
  let profile;
  if (user.role === "business") {
    profile = await findBusinessByUserId(user.id);
    if (requestedId && profile?.id !== requestedId) {
      throw AppError.forbidden("Businesses can access only their own profile");
    }
  } else {
    if (!requestedId) {
      throw AppError.unprocessable("business_id is required for admin access", {
        business_id: "Provide the business profile id"
      });
    }
    profile = await findBusinessById(requestedId);
  }

  if (!profile) throw AppError.notFound("Business profile not found");
  if (approved && profile.status !== "approved") {
    throw AppError.forbidden("Business profile is not approved");
  }
  return profile;
}

async function resolvePlace(profile, placeId) {
  const place = await findBusinessPlace(profile.id, placeId);
  if (!place) throw AppError.notFound("Business place not found");
  return place;
}

export async function getBusinessMe(user, query) {
  return privateBusiness(
    await resolveBusiness(user, query.business_id)
  );
}

export async function editBusiness(user, query, input) {
  const profile = await resolveBusiness(user, query.business_id);
  return privateBusiness(await updateBusinessProfile(profile.id, input));
}

export async function getPublicBusiness(slug) {
  const profile = await findPublicBusinessBySlug(slug);
  if (!profile) throw AppError.notFound("Business not found");
  return publicBusiness(profile);
}

export async function getBusinessPlace(user, query) {
  const profile = await resolveBusiness(user, query.business_id, {
    approved: true
  });
  const place = await resolvePlace(profile, query.place_id);
  return {
    ...serializePlace(place),
    status: place.status,
    menu: place.menuJson,
    stats: {
      reviews: place._count.reviews,
      posts: place._count.posts,
      favorites: place._count.favorites
    }
  };
}

export async function editBusinessPlace(user, query, input) {
  const profile = await resolveBusiness(user, query.business_id, {
    approved: true
  });
  const place = await resolvePlace(profile, query.place_id);
  return getBusinessPlace(
    user,
    {
      business_id: profile.id,
      place_id: (await updateBusinessPlace(place.id, input)).id
    }
  );
}

export async function editBusinessMenu(user, query, input) {
  const profile = await resolveBusiness(user, query.business_id, {
    approved: true
  });
  const place = await resolvePlace(profile, query.place_id);
  return updatePlaceMenu(place.id, input);
}

export async function getBusinessMedia(user, query) {
  const profile = await resolveBusiness(user, query.business_id, {
    approved: true
  });
  const place = await resolvePlace(profile, query.place_id);
  return {
    placeId: place.id,
    items: (await listBusinessMedia(place.id)).map(serializeMedia)
  };
}

export async function addBusinessMedia(user, query, body, files = []) {
  const profile = await resolveBusiness(user, query.business_id, {
    approved: true
  });
  const place = await resolvePlace(profile, query.place_id);
  const uploaded = files.map((file, index) => ({
    mediaType: file.mimetype.startsWith("video/") ? "video" : "image",
    mediaUrl: file.remoteUrl ?? `/uploads/${path.basename(file.filename)}`,
    thumbnailUrl: null,
    sortOrder: body.sortOrder + index
  }));
  if (body.mediaUrl) {
    uploaded.push({
      mediaType: body.mediaType ?? "image",
      mediaUrl: body.mediaUrl,
      thumbnailUrl: body.thumbnailUrl ?? null,
      sortOrder: body.sortOrder
    });
  }
  if (uploaded.length === 0) {
    throw AppError.unprocessable("At least one media file or mediaUrl is required");
  }

  return (await createBusinessMedia(place.id, uploaded)).map(serializeMedia);
}

export async function reorderMedia(user, query, input) {
  const profile = await resolveBusiness(user, query.business_id, {
    approved: true
  });
  const place = await resolvePlace(profile, query.place_id);
  const items = await reorderBusinessMedia(place.id, input.items);
  if (!items) {
    throw AppError.unprocessable("One or more media items do not belong to this place");
  }
  return items.map(serializeMedia);
}

export async function removeBusinessMedia(user, query, mediaId) {
  const profile = await resolveBusiness(user, query.business_id, {
    approved: true
  });
  const place = await resolvePlace(profile, query.place_id);
  const media = await findBusinessMedia(place.id, mediaId);
  if (!media) throw AppError.notFound("Business media not found");
  await deleteBusinessMedia(media.id);
  if (media.mediaUrl.startsWith("/uploads/")) {
    const filename = path.basename(media.mediaUrl);
    await unlink(path.join(uploadConfig.root, filename)).catch(() => undefined);
  } else {
    const asset = cloudinaryAssetFromUrl(media.mediaUrl);
    if (asset) {
      await deleteCloudinaryAsset(asset.publicId, asset.resourceType).catch(
        () => undefined
      );
    }
  }
}

export async function getBusinessStats(user, query) {
  const profile = await resolveBusiness(user, query.business_id, {
    approved: true
  });
  const data = await getBusinessStatsData(profile.id);
  const promotionCounts = Object.fromEntries(
    data.promotions.map((item) => [item.status, item._count.id])
  );
  const sums = data.posts._sum;
  return {
    places: data.places._count.id,
    reviews: data.reviews._count.id,
    ratingAvg: Number(data.reviews._avg.rating ?? 0),
    favorites: data.favorites,
    posts: data.posts._count.id,
    promotions: {
      active: promotionCounts.active ?? 0,
      inactive: promotionCounts.inactive ?? 0
    },
    reach: {
      views: Number(sums.viewCount ?? 0),
      likes: Number(sums.likeCount ?? 0),
      comments: Number(sums.commentCount ?? 0),
      shares: Number(sums.shareCount ?? 0),
      saves: Number(sums.saveCount ?? 0)
    }
  };
}

export async function getBusinessReviews(user, query) {
  const profile = await resolveBusiness(user, query.business_id, {
    approved: true
  });
  const [reviews, total] = await listBusinessReviews(profile.id, query);
  return {
    items: reviews.map((review) => ({
      ...serializeReview(review),
      place: review.place
    })),
    pagination: createPagination({ ...query, total })
  };
}

export async function getBusinessPromotions(user, query) {
  const profile = await resolveBusiness(user, query.business_id, {
    approved: true
  });
  const [items, total] = await listBusinessPromotions(profile.id, query);
  return {
    items: items.map(serializePromotion),
    pagination: createPagination({ ...query, total })
  };
}

export async function addBusinessPromotion(user, query, input) {
  const profile = await resolveBusiness(user, query.business_id, {
    approved: true
  });
  const place = await resolvePlace(profile, input.placeId ?? query.place_id);
  return serializePromotion(
    await createBusinessPromotion({
      ...input,
      authorId: profile.userId,
      businessProfileId: profile.id,
      placeId: place.id
    })
  );
}

export async function editBusinessPromotion(user, query, id, input) {
  const profile = await resolveBusiness(user, query.business_id, {
    approved: true
  });
  if (!(await findBusinessPromotion(profile.id, id))) {
    throw AppError.notFound("Promotion not found");
  }
  const { caption, ...data } = input;
  return serializePromotion(
    await updateBusinessPromotion(id, data, caption)
  );
}

export async function removeBusinessPromotion(user, query, id) {
  const profile = await resolveBusiness(user, query.business_id, {
    approved: true
  });
  if (!(await findBusinessPromotion(profile.id, id))) {
    throw AppError.notFound("Promotion not found");
  }
  await softDeleteBusinessPromotion(id);
}
