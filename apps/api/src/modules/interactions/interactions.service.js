import { AppError } from "../../common/errors/AppError.js";
import { createPagination } from "../../common/utils/apiResponse.js";
import {
  serializePlace,
  serializePost,
  serializeReview
} from "../discovery/discovery.serializer.js";
import {
  createComment,
  createPlaceReview,
  createReport,
  createReviewReply,
  findApprovedComment,
  findPublicPlace,
  findPublicPost,
  findRecentReport,
  findReviewByUserAndPlace,
  findReviewForUpdate,
  listComments,
  listFavorites,
  listSavedPosts,
  reportTargetExists,
  togglePlaceFavorite,
  togglePostLike,
  togglePostSave,
  updatePlaceReview
} from "./interactions.repository.js";

function serializeComment(comment) {
  return {
    id: comment.id,
    postId: comment.postId,
    parentId: comment.parentId,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    user: comment.user,
    replies: (comment.replies ?? []).map(serializeComment)
  };
}

function serializeReply(reply) {
  return {
    id: reply.id,
    reviewId: reply.reviewId,
    content: reply.content,
    createdAt: reply.createdAt,
    updatedAt: reply.updatedAt,
    user: reply.user
  };
}

export async function likePost(userId, postId) {
  const post = await findPublicPost(postId);
  if (!post) throw AppError.notFound("Post not found");
  return togglePostLike(userId, postId, post.authorId);
}

export async function savePost(userId, postId) {
  if (!(await findPublicPost(postId))) {
    throw AppError.notFound("Post not found");
  }
  return togglePostSave(userId, postId);
}

export async function favoritePlace(userId, placeId) {
  if (!(await findPublicPlace(placeId))) {
    throw AppError.notFound("Place not found");
  }
  return togglePlaceFavorite(userId, placeId);
}

export async function getFavorites(userId, query) {
  const [favorites, total] = await listFavorites(userId, query);
  return {
    items: favorites.map((item) => ({
      favoritedAt: item.createdAt,
      place: serializePlace(item.place)
    })),
    pagination: createPagination({ ...query, total })
  };
}

export async function getSavedPosts(userId, query) {
  const [savedPosts, total] = await listSavedPosts(userId, query);
  return {
    items: savedPosts.map((item) => ({
      savedAt: item.createdAt,
      post: serializePost(item.post)
    })),
    pagination: createPagination({ ...query, total })
  };
}

export async function getComments(postId, query) {
  if (!(await findPublicPost(postId))) {
    throw AppError.notFound("Post not found");
  }
  const [comments, total] = await listComments(postId, query);
  return {
    items: comments.map(serializeComment),
    pagination: createPagination({ ...query, total })
  };
}

export async function addComment(userId, postId, input) {
  const post = await findPublicPost(postId);
  if (!post) throw AppError.notFound("Post not found");

  let parent = null;
  if (input.parentId) {
    parent = await findApprovedComment(input.parentId);
    if (!parent || parent.postId !== postId) {
      throw AppError.unprocessable("Parent comment is invalid", {
        parentId: "Parent comment must belong to the same post"
      });
    }
    if (parent.parentId) {
      throw AppError.unprocessable("Nested replies are limited to one level", {
        parentId: "Reply to the top-level comment instead"
      });
    }
  }

  const result = await createComment({
    postId,
    userId,
    parentId: input.parentId,
    content: input.content,
    notifyUserId: parent?.userId ?? post.authorId
  });
  return {
    comment: serializeComment(result.comment),
    commentCount: result.commentCount
  };
}

export async function addReview(userId, placeId, input) {
  const place = await findPublicPlace(placeId);
  if (!place) throw AppError.notFound("Place not found");
  if (await findReviewByUserAndPlace(userId, placeId)) {
    throw AppError.conflict("You have already reviewed this place");
  }

  const result = await createPlaceReview({
    userId,
    placeId,
    rating: input.rating,
    content: input.content,
    notifyUserId:
      place.business?.status === "approved" ? place.business.userId : null
  });
  return {
    review: serializeReview(result.review),
    ratingAvg: result.ratingAvg,
    ratingCount: result.ratingCount
  };
}

export async function editReview(user, reviewId, input) {
  const review = await findReviewForUpdate(reviewId);
  if (!review || review.status === "deleted") {
    throw AppError.notFound("Review not found");
  }
  if (review.userId !== user.id) {
    throw AppError.forbidden("You can update only your own review");
  }
  const result = await updatePlaceReview(reviewId, input);
  return {
    review: serializeReview(result.review),
    ratingAvg: result.ratingAvg,
    ratingCount: result.ratingCount
  };
}

export async function replyToReview(user, reviewId, input) {
  const review = await findReviewForUpdate(reviewId);
  if (!review || review.status !== "approved") {
    throw AppError.notFound("Review not found");
  }
  if (review.reply) {
    throw AppError.conflict("Review already has a reply");
  }

  const businessOwnerId =
    review.place.business?.status === "approved"
      ? review.place.business.userId
      : null;
  if (user.role !== "admin" && businessOwnerId !== user.id) {
    throw AppError.forbidden(
      "Only the place business owner or an admin can reply"
    );
  }

  return serializeReply(
    await createReviewReply({
      reviewId,
      userId: user.id,
      content: input.content,
      notifyUserId: review.userId
    })
  );
}

export async function submitReport(userId, input) {
  if (!(await reportTargetExists(input.targetType, input.targetId))) {
    throw AppError.notFound("Report target not found");
  }

  const since = new Date(Date.now() - 10 * 60 * 1000);
  if (
    await findRecentReport(
      userId,
      input.targetType,
      input.targetId,
      since
    )
  ) {
    throw AppError.conflict(
      "A recent pending report already exists for this target"
    );
  }

  const report = await createReport({
    reporterId: userId,
    targetType: input.targetType,
    targetId: input.targetId,
    reason: input.reason,
    status: "pending"
  });
  return {
    id: report.id,
    targetType: report.targetType,
    targetId: report.targetId,
    reason: report.reason,
    status: report.status,
    createdAt: report.createdAt
  };
}
