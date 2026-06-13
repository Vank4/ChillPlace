import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import { mapQuerySchema } from "../discovery/discovery.validation.js";
import { mapPlaces } from "./places.controller.js";

export const mapRouter = Router();
mapRouter.get(
  "/places",
  validateRequest({ query: mapQuerySchema }),
  asyncHandler(mapPlaces)
);
