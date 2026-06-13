import { ok } from "../../common/utils/apiResponse.js";
import {
  getPublicUserPosts,
  getPublicUserProfile,
  toggleUserFollow,
  updateCurrentUser
} from "./users.service.js";

export async function updateMe(req, res) {
  const user = await updateCurrentUser(req.user.id, req.validated.body);
  return ok(res, { user }, "Profile updated");
}

export async function publicProfile(req, res) {
  const profile = await getPublicUserProfile(
    req.validated.params.username,
    req.user?.id
  );
  return ok(res, { profile });
}

export async function publicPosts(req, res) {
  const result = await getPublicUserPosts(
    req.validated.params.id,
    req.validated.query
  );
  return ok(res, { items: result.data }, "OK", result.pagination);
}

export async function follow(req, res) {
  const state = await toggleUserFollow(
    req.user.id,
    req.validated.params.id
  );
  return ok(res, state, state.following ? "User followed" : "User unfollowed");
}
