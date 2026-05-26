import { AppError } from "../common/errors/AppError.js";
import { fail } from "../common/utils/apiResponse.js";

export function errorMiddleware(err, req, res, next) {
  const appError =
    err instanceof AppError
      ? err
      : new AppError(500, err?.message || "Internal server error");

  if (process.env.NODE_ENV !== "production" && err?.stack) {
    console.error(err.stack);
  }

  return fail(res, appError.statusCode, appError.message, appError.errors);
}

