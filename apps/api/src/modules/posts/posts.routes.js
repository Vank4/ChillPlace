import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import {
  feedQuerySchema,
  idParamSchema
} from "../discovery/discovery.validation.js";
import { feed, postDetail } from "./posts.controller.js";

export const feedRouter = Router();
feedRouter.get(
  "/",
  validateRequest({ query: feedQuerySchema }),
  asyncHandler(feed)
);

export const postsRouter = Router();
postsRouter.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  asyncHandler(postDetail)
);
