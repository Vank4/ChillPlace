import { AppError } from "../common/errors/AppError.js";
import { verifyAccessToken } from "../common/utils/jwt.js";
import { findUserById } from "../modules/users/user.repository.js";

function bearerToken(req) {
  const authorization = req.get("authorization");
  if (!authorization) return null;

  const [scheme, token] = authorization.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    throw AppError.unauthorized("Authorization header must use Bearer token");
  }

  return token;
}

async function authenticatedUser(token) {
  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw AppError.unauthorized("Access token is invalid or expired");
  }

  const userId = Number(payload.sub);
  if (!Number.isInteger(userId) || userId <= 0) {
    throw AppError.unauthorized("Access token is invalid");
  }

  const user = await findUserById(userId);
  if (!user) throw AppError.unauthorized("User no longer exists");
  if (user.status !== "active") {
    throw AppError.forbidden("Account is not active");
  }

  return user;
}

export async function requireAuth(req, res, next) {
  try {
    const token = bearerToken(req);
    if (!token) throw AppError.unauthorized("Authentication is required");

    req.user = await authenticatedUser(token);
    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const token = bearerToken(req);
    if (token) req.user = await authenticatedUser(token);
    next();
  } catch (error) {
    next(error);
  }
}
