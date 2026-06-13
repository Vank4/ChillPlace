import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

export function signAccessToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      role: user.role
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
      issuer: "chillplace-api",
      audience: "chillplace-web"
    }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtSecret, {
    issuer: "chillplace-api",
    audience: "chillplace-web"
  });
}
