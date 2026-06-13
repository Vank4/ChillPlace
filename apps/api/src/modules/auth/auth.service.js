import { AppError } from "../../common/errors/AppError.js";
import { signAccessToken } from "../../common/utils/jwt.js";
import {
  hashPassword,
  verifyPassword
} from "../../common/utils/password.js";
import {
  createUser,
  findUserByEmail,
  findUserByUsername
} from "../users/user.repository.js";
import { serializeUser } from "../users/user.serializer.js";

function normalizeUsername(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 42);
}

async function createAvailableUsername(preferred, email) {
  const base =
    normalizeUsername(preferred) ||
    normalizeUsername(email.split("@")[0]) ||
    "chillplace_user";

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const suffix = attempt === 0 ? "" : `_${attempt + 1}`;
    const candidate = `${base.slice(0, 50 - suffix.length)}${suffix}`;
    if (!(await findUserByUsername(candidate))) return candidate;
  }

  throw AppError.conflict("Unable to generate an available username");
}

function assertLoginAllowed(user) {
  if (!user) {
    throw AppError.unauthorized("Email or password is incorrect");
  }

  if (user.status !== "active") {
    throw AppError.forbidden("Account is not active");
  }
}

export async function registerUser(input) {
  const emailExists = await findUserByEmail(input.email);
  if (emailExists) {
    throw AppError.conflict("Email is already in use", {
      email: "Email is already in use"
    });
  }

  const fullName =
    input.fullName || `${input.lastName} ${input.firstName}`.trim();
  const requestedUsername = input.username
    ? normalizeUsername(input.username)
    : normalizeUsername(fullName);

  if (input.username && (await findUserByUsername(requestedUsername))) {
    throw AppError.conflict("Username is already in use", {
      username: "Username is already in use"
    });
  }

  const generatedUsername = input.username
    ? requestedUsername
    : await createAvailableUsername(requestedUsername, input.email);

  const user = await createUser({
    fullName,
    username: generatedUsername,
    email: input.email,
    phone: input.phone,
    passwordHash: await hashPassword(input.password),
    role: "user",
    status: "active"
  });

  return {
    accessToken: signAccessToken(user),
    tokenType: "Bearer",
    user: serializeUser(user)
  };
}

export async function loginUser(input) {
  const user = await findUserByEmail(input.email);
  assertLoginAllowed(user);

  const validPassword = await verifyPassword(input.password, user.passwordHash);
  if (!validPassword) {
    throw AppError.unauthorized("Email or password is incorrect");
  }

  return {
    accessToken: signAccessToken(user),
    tokenType: "Bearer",
    user: serializeUser(user)
  };
}
