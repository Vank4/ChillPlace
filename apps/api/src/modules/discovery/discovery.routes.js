import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { optionalAuth } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import {
  recommendationsQuerySchema,
  searchQuerySchema
} from "./discovery.validation.js";
import {
  recommendations,
  search
} from "./discovery.controller.js";

export const searchRouter = Router();
searchRouter.get(
  "/",
  validateRequest({ query: searchQuerySchema }),
  asyncHandler(search)
);

export const recommendationsRouter = Router();
recommendationsRouter.get(
  "/",
  optionalAuth,
  validateRequest({ query: recommendationsQuerySchema }),
  asyncHandler(recommendations)
);
