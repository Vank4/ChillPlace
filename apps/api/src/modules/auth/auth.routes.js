import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { authRateLimiter } from "../../middlewares/security.middleware.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import { login, me, register } from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  authRateLimiter,
  validateRequest({ body: registerSchema }),
  asyncHandler(register)
);
authRouter.post(
  "/login",
  authRateLimiter,
  validateRequest({ body: loginSchema }),
  asyncHandler(login)
);
authRouter.get("/me", requireAuth, asyncHandler(me));
