import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import {
  idParamSchema,
  nearbyQuerySchema,
  paginationSchema,
  placeListQuerySchema,
  slugParamSchema
} from "../discovery/discovery.validation.js";
import {
  nearby,
  placeDetail,
  places,
  promotions,
  relatedPosts,
  reviews
} from "./places.controller.js";

export const placesRouter = Router();

placesRouter.get(
  "/nearby",
  validateRequest({ query: nearbyQuerySchema }),
  asyncHandler(nearby)
);
placesRouter.get(
  "/",
  validateRequest({ query: placeListQuerySchema }),
  asyncHandler(places)
);
placesRouter.get(
  "/:id/reviews",
  validateRequest({ params: idParamSchema, query: paginationSchema }),
  asyncHandler(reviews)
);
placesRouter.get(
  "/:id/promotions",
  validateRequest({ params: idParamSchema, query: paginationSchema }),
  asyncHandler(promotions)
);
placesRouter.get(
  "/:id/related-posts",
  validateRequest({ params: idParamSchema, query: paginationSchema }),
  asyncHandler(relatedPosts)
);
placesRouter.get(
  "/:slug",
  validateRequest({ params: slugParamSchema }),
  asyncHandler(placeDetail)
);
