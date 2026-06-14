import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { mutationRateLimiter } from "../../middlewares/security.middleware.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import {
  comment,
  comments,
  favorite,
  favorites,
  like,
  report,
  review,
  reviewReply,
  save,
  saved,
  updateReview
} from "./interactions.controller.js";
import {
  createCommentSchema,
  createReviewSchema,
  interactionIdParamSchema,
  interactionPaginationSchema,
  reportSchema,
  reviewReplySchema,
  updateReviewSchema
} from "./interactions.validation.js";

export const postInteractionsRouter = Router();
postInteractionsRouter.post(
  "/:id/like",
  requireAuth,
  mutationRateLimiter,
  validateRequest({ params: interactionIdParamSchema }),
  asyncHandler(like)
);
postInteractionsRouter.post(
  "/:id/save",
  requireAuth,
  mutationRateLimiter,
  validateRequest({ params: interactionIdParamSchema }),
  asyncHandler(save)
);
postInteractionsRouter.get(
  "/:id/comments",
  validateRequest({
    params: interactionIdParamSchema,
    query: interactionPaginationSchema
  }),
  asyncHandler(comments)
);
postInteractionsRouter.post(
  "/:id/comments",
  requireAuth,
  mutationRateLimiter,
  validateRequest({
    params: interactionIdParamSchema,
    body: createCommentSchema
  }),
  asyncHandler(comment)
);

export const placeInteractionsRouter = Router();
placeInteractionsRouter.post(
  "/:id/favorite",
  requireAuth,
  mutationRateLimiter,
  validateRequest({ params: interactionIdParamSchema }),
  asyncHandler(favorite)
);
placeInteractionsRouter.post(
  "/:id/reviews",
  requireAuth,
  mutationRateLimiter,
  validateRequest({
    params: interactionIdParamSchema,
    body: createReviewSchema
  }),
  asyncHandler(review)
);

export const favoritesRouter = Router();
favoritesRouter.get(
  "/",
  requireAuth,
  validateRequest({ query: interactionPaginationSchema }),
  asyncHandler(favorites)
);

export const savedRouter = Router();
savedRouter.get(
  "/me/saved",
  requireAuth,
  validateRequest({ query: interactionPaginationSchema }),
  asyncHandler(saved)
);

export const reviewsRouter = Router();
reviewsRouter.patch(
  "/:id",
  requireAuth,
  mutationRateLimiter,
  validateRequest({
    params: interactionIdParamSchema,
    body: updateReviewSchema
  }),
  asyncHandler(updateReview)
);
reviewsRouter.post(
  "/:id/reply",
  requireAuth,
  mutationRateLimiter,
  validateRequest({
    params: interactionIdParamSchema,
    body: reviewReplySchema
  }),
  asyncHandler(reviewReply)
);

export const reportsRouter = Router();
reportsRouter.post(
  "/",
  requireAuth,
  mutationRateLimiter,
  validateRequest({ body: reportSchema }),
  asyncHandler(report)
);
