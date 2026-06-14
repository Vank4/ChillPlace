import { ok } from "../../common/utils/apiResponse.js";
import {
  getCreatorAnalytics,
  getCreatorPostAnalytics,
  getCreatorPosts,
  getCreatorStats,
  getTopCreatorPosts,
  resolveCreatorId
} from "./creator.service.js";

export async function stats(req, res) {
  const creatorId = await resolveCreatorId(
    req.user,
    req.validated.query.creator_id
  );
  return ok(res, { stats: await getCreatorStats(creatorId) });
}

export async function posts(req, res) {
  const creatorId = await resolveCreatorId(
    req.user,
    req.validated.query.creator_id
  );
  const result = await getCreatorPosts(creatorId, req.validated.query);
  return ok(res, { items: result.items }, "OK", result.pagination);
}

export async function topPosts(req, res) {
  const creatorId = await resolveCreatorId(
    req.user,
    req.validated.query.creator_id
  );
  return ok(res, {
    items: await getTopCreatorPosts(creatorId, req.validated.query)
  });
}

export async function analytics(req, res) {
  const creatorId = await resolveCreatorId(
    req.user,
    req.validated.query.creator_id
  );
  return ok(res, {
    analytics: await getCreatorAnalytics(
      creatorId,
      req.validated.query.period
    )
  });
}

export async function postAnalytics(req, res) {
  const creatorId = await resolveCreatorId(
    req.user,
    req.validated.query.creator_id
  );
  return ok(res, {
    analytics: await getCreatorPostAnalytics(
      creatorId,
      req.validated.params.id
    )
  });
}
