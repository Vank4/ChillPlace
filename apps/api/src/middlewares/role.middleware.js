import { AppError } from "../common/errors/AppError.js";

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized("Authentication is required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(AppError.forbidden("You do not have permission"));
    }

    next();
  };
}
