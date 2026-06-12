import { rateLimit } from "express-rate-limit";
import { fail } from "../common/utils/apiResponse.js";

function handler(req, res) {
  return fail(res, 429, "Too many requests. Please try again later.");
}

export function createRateLimiter(options = {}) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler,
    ...options
  });
}

export const apiRateLimiter = createRateLimiter();

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 20
});

export const mutationRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  limit: 60
});

export const uploadRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 30
});
