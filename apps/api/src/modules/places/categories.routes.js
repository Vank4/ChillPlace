import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { categories } from "./places.controller.js";

export const categoriesRouter = Router();
categoriesRouter.get("/", asyncHandler(categories));
