import { created, ok } from "../../common/utils/apiResponse.js";
import { loginUser, registerUser } from "./auth.service.js";
import { getCurrentUser } from "../users/users.service.js";

export async function register(req, res) {
  const result = await registerUser(req.validated.body);
  return created(res, result, "Account created");
}

export async function login(req, res) {
  const result = await loginUser(req.validated.body);
  return ok(res, result, "Login successful");
}

export async function me(req, res) {
  const user = await getCurrentUser(req.user.id);
  return ok(res, { user });
}
