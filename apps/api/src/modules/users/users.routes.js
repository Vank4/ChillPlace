import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import {
  optionalAuth,
  requireAuth
} from "../../middlewares/auth.middleware.js";
import { mutationRateLimiter } from "../../middlewares/security.middleware.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import {
  follow,
  publicPosts,
  publicProfile,
  updateMe
} from "./users.controller.js";
import {
  publicPostsQuerySchema,
  updateMeSchema,
  userIdParamSchema,
  usernameParamSchema
} from "./users.validation.js";

export const usersRouter = Router();

usersRouter.patch(
  "/me",
  requireAuth,
  mutationRateLimiter,
  validateRequest({ body: updateMeSchema }),
  asyncHandler(updateMe)
);
usersRouter.get(
  "/:username/public",
  optionalAuth,
  validateRequest({ params: usernameParamSchema }),
  asyncHandler(publicProfile)
);
usersRouter.get(
  "/:id/posts",
  validateRequest({
    params: userIdParamSchema,
    query: publicPostsQuerySchema
  }),
  asyncHandler(publicPosts)
);
usersRouter.post(
  "/:id/follow",
  requireAuth,
  mutationRateLimiter,
  validateRequest({ params: userIdParamSchema }),
  asyncHandler(follow)
);
