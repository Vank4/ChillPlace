import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import {
  slugParamSchema,
  tagSearchQuerySchema,
  trendingTagsQuerySchema
} from "../discovery/discovery.validation.js";
import { detail, related, search, trending } from "./tags.controller.js";

export const tagsRouter = Router();

tagsRouter.get(
  "/trending",
  validateRequest({ query: trendingTagsQuerySchema }),
  asyncHandler(trending)
);
tagsRouter.get(
  "/search",
  validateRequest({ query: tagSearchQuerySchema }),
  asyncHandler(search)
);
tagsRouter.get(
  "/:slug/related",
  validateRequest({
    params: slugParamSchema,
    query: trendingTagsQuerySchema
  }),
  asyncHandler(related)
);
tagsRouter.get(
  "/:slug",
  validateRequest({ params: slugParamSchema }),
  asyncHandler(detail)
);
