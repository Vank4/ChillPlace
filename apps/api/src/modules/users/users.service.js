import { AppError } from "../../common/errors/AppError.js";
import { createPagination } from "../../common/utils/apiResponse.js";
import {
  findFollow,
  findPublicProfile,
  findUserById,
  findUserByUsername,
  listPublicPostsByUser,
  toggleFollow,
  updateUser
} from "./user.repository.js";
import {
  serializePublicUser,
  serializeUser
} from "./user.serializer.js";

export async function getCurrentUser(userId) {
  const user = await findUserById(userId);
  if (!user) throw AppError.notFound("User not found");
  return serializeUser(user);
}

export async function updateCurrentUser(userId, input) {
  if (input.username) {
    const existing = await findUserByUsername(input.username);
    if (existing && existing.id !== userId) {
      throw AppError.conflict("Username is already in use", {
        username: "Username is already in use"
      });
    }
  }

  const user = await updateUser(userId, input);
  return serializeUser(user);
}

export async function getPublicUserProfile(username, viewerId) {
  const user = await findPublicProfile(username);
  if (!user) throw AppError.notFound("Public profile not found");

  const following =
    viewerId && viewerId !== user.id
      ? await findFollow(viewerId, user.id)
      : null;

  return serializePublicUser(user, {
    isFollowing: Boolean(following)
  });
}

export async function getPublicUserPosts(userId, query) {
  const user = await findUserById(userId);
  if (!user || user.status !== "active") {
    throw AppError.notFound("Public profile not found");
  }

  const [items, total] = await listPublicPostsByUser(userId, query);
  return {
    data: items,
    pagination: createPagination({ ...query, total })
  };
}

export async function toggleUserFollow(followerId, followingUserId) {
  if (followerId === followingUserId) {
    throw AppError.badRequest("You cannot follow yourself");
  }

  const target = await findUserById(followingUserId);
  if (!target || target.status !== "active") {
    throw AppError.notFound("User not found");
  }

  return toggleFollow(followerId, followingUserId);
}
