import { Router } from "express";
import { getHealth } from "./health.controller.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";

export const healthRouter = Router();

healthRouter.get("/health", asyncHandler(getHealth));

