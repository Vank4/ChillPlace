import { created, ok } from "../../common/utils/apiResponse.js";
import {
  addComment,
  addReview,
  editReview,
  favoritePlace,
  getComments,
  getFavorites,
  getSavedPosts,
  likePost,
  replyToReview,
  savePost,
  submitReport
} from "./interactions.service.js";

export async function like(req, res) {
  const state = await likePost(req.user.id, req.validated.params.id);
  return ok(res, state, state.liked ? "Post liked" : "Post unliked");
}

export async function save(req, res) {
  const state = await savePost(req.user.id, req.validated.params.id);
  return ok(res, state, state.saved ? "Post saved" : "Post unsaved");
}

export async function favorite(req, res) {
  const state = await favoritePlace(req.user.id, req.validated.params.id);
  return ok(
    res,
    state,
    state.favorited ? "Place favorited" : "Place unfavorited"
  );
}

export async function favorites(req, res) {
  const result = await getFavorites(req.user.id, req.validated.query);
  return ok(res, { items: result.items }, "OK", result.pagination);
}

export async function saved(req, res) {
  const result = await getSavedPosts(req.user.id, req.validated.query);
  return ok(res, { items: result.items }, "OK", result.pagination);
}

export async function comments(req, res) {
  const result = await getComments(
    req.validated.params.id,
    req.validated.query
  );
  return ok(res, { items: result.items }, "OK", result.pagination);
}

export async function comment(req, res) {
  return created(
    res,
    await addComment(
      req.user.id,
      req.validated.params.id,
      req.validated.body
    ),
    "Comment created"
  );
}

export async function review(req, res) {
  return created(
    res,
    await addReview(
      req.user.id,
      req.validated.params.id,
      req.validated.body
    ),
    "Review created"
  );
}

export async function updateReview(req, res) {
  return ok(
    res,
    await editReview(
      req.user,
      req.validated.params.id,
      req.validated.body
    ),
    "Review updated"
  );
}

export async function reviewReply(req, res) {
  return created(
    res,
    {
      reply: await replyToReview(
        req.user,
        req.validated.params.id,
        req.validated.body
      )
    },
    "Review reply created"
  );
}

export async function report(req, res) {
  return created(
    res,
    { report: await submitReport(req.user.id, req.validated.body) },
    "Report submitted"
  );
}
