import { AppError } from "../common/errors/AppError.js";

export function notFoundMiddleware(req, res, next) {
  next(AppError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}
