import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { mutationRateLimiter } from "../../middlewares/security.middleware.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import {
  businessRequest,
  creatorRequest,
  myRequests
} from "./role-requests.controller.js";
import {
  businessRequestSchema,
  creatorRequestSchema
} from "./role-requests.validation.js";

export const roleRequestsRouter = Router();
roleRequestsRouter.use(requireAuth);
roleRequestsRouter.post(
  "/creator",
  mutationRateLimiter,
  validateRequest({ body: creatorRequestSchema }),
  asyncHandler(creatorRequest)
);
roleRequestsRouter.post(
  "/business",
  mutationRateLimiter,
  validateRequest({ body: businessRequestSchema }),
  asyncHandler(businessRequest)
);
roleRequestsRouter.get("/me", asyncHandler(myRequests));
