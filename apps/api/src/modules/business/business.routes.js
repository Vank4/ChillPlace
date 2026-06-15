import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { mutationRateLimiter } from "../../middlewares/security.middleware.js";
import { uploadMedia } from "../../middlewares/upload.middleware.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import {
  addMedia,
  createPromotion,
  deletePromotion,
  media,
  me,
  place,
  promotions,
  publicProfile,
  removeMedia,
  reorder,
  reviews,
  stats,
  updateMe,
  updateMenu,
  updatePlace,
  updatePromotion
} from "./business.controller.js";
import {
  businessIdParamSchema,
  businessScopeQuerySchema,
  businessSlugParamSchema,
  createPromotionSchema,
  mediaBodySchema,
  paginationBusinessQuerySchema,
  reorderMediaSchema,
  updateBusinessPlaceSchema,
  updateBusinessSchema,
  updateMenuSchema,
  updatePromotionSchema
} from "./business.validation.js";

export const businessRouter = Router();

businessRouter.get(
  "/:slug/public",
  validateRequest({ params: businessSlugParamSchema }),
  asyncHandler(publicProfile)
);

businessRouter.use(requireAuth, requireRole("business", "admin"));

businessRouter.get(
  "/me",
  validateRequest({ query: businessScopeQuerySchema }),
  asyncHandler(me)
);
businessRouter.patch(
  "/me",
  mutationRateLimiter,
  validateRequest({
    query: businessScopeQuerySchema,
    body: updateBusinessSchema
  }),
  asyncHandler(updateMe)
);
businessRouter.get(
  "/place",
  validateRequest({ query: businessScopeQuerySchema }),
  asyncHandler(place)
);
businessRouter.patch(
  "/place",
  mutationRateLimiter,
  validateRequest({
    query: businessScopeQuerySchema,
    body: updateBusinessPlaceSchema
  }),
  asyncHandler(updatePlace)
);
businessRouter.patch(
  "/menu",
  mutationRateLimiter,
  validateRequest({
    query: businessScopeQuerySchema,
    body: updateMenuSchema
  }),
  asyncHandler(updateMenu)
);
businessRouter.get(
  "/media",
  validateRequest({ query: businessScopeQuerySchema }),
  asyncHandler(media)
);
businessRouter.post(
  "/media",
  mutationRateLimiter,
  uploadMedia,
  validateRequest({
    query: businessScopeQuerySchema,
    body: mediaBodySchema
  }),
  asyncHandler(addMedia)
);
businessRouter.patch(
  "/media/order",
  mutationRateLimiter,
  validateRequest({
    query: businessScopeQuerySchema,
    body: reorderMediaSchema
  }),
  asyncHandler(reorder)
);
businessRouter.delete(
  "/media/:id",
  mutationRateLimiter,
  validateRequest({
    query: businessScopeQuerySchema,
    params: businessIdParamSchema
  }),
  asyncHandler(removeMedia)
);
businessRouter.get(
  "/stats",
  validateRequest({ query: businessScopeQuerySchema }),
  asyncHandler(stats)
);
businessRouter.get(
  "/reviews",
  validateRequest({ query: paginationBusinessQuerySchema }),
  asyncHandler(reviews)
);
businessRouter.get(
  "/promotions",
  validateRequest({ query: paginationBusinessQuerySchema }),
  asyncHandler(promotions)
);
businessRouter.post(
  "/promotions",
  mutationRateLimiter,
  validateRequest({
    query: businessScopeQuerySchema,
    body: createPromotionSchema
  }),
  asyncHandler(createPromotion)
);
businessRouter.patch(
  "/promotions/:id",
  mutationRateLimiter,
  validateRequest({
    query: businessScopeQuerySchema,
    params: businessIdParamSchema,
    body: updatePromotionSchema
  }),
  asyncHandler(updatePromotion)
);
businessRouter.delete(
  "/promotions/:id",
  mutationRateLimiter,
  validateRequest({
    query: businessScopeQuerySchema,
    params: businessIdParamSchema
  }),
  asyncHandler(deletePromotion)
);
