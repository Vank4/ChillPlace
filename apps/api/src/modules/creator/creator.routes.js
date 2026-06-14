import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import {
  analytics,
  postAnalytics,
  posts,
  stats,
  topPosts
} from "./creator.controller.js";
import {
  creatorAnalyticsQuerySchema,
  creatorPostIdParamSchema,
  creatorPostsQuerySchema,
  creatorScopeQuerySchema,
  postAnalyticsQuerySchema,
  topPostsQuerySchema
} from "./creator.validation.js";

export const creatorRouter = Router();
creatorRouter.use(requireAuth, requireRole("creator", "admin"));

creatorRouter.get(
  "/stats",
  validateRequest({ query: creatorScopeQuerySchema }),
  asyncHandler(stats)
);
creatorRouter.get(
  "/posts",
  validateRequest({ query: creatorPostsQuerySchema }),
  asyncHandler(posts)
);
creatorRouter.get(
  "/top-posts",
  validateRequest({ query: topPostsQuerySchema }),
  asyncHandler(topPosts)
);
creatorRouter.get(
  "/analytics",
  validateRequest({ query: creatorAnalyticsQuerySchema }),
  asyncHandler(analytics)
);

export const analyticsRouter = Router();
analyticsRouter.get(
  "/posts/:id",
  requireAuth,
  requireRole("creator", "admin"),
  validateRequest({
    params: creatorPostIdParamSchema,
    query: postAnalyticsQuerySchema
  }),
  asyncHandler(postAnalytics)
);
