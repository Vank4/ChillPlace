import { ok } from "../../common/utils/apiResponse.js";
import {
  findTags,
  getRelatedTags,
  getTagDetail,
  getTrendingTags
} from "./tags.service.js";

export async function trending(req, res) {
  return ok(res, {
    items: await getTrendingTags(req.validated.query.limit)
  });
}

export async function search(req, res) {
  return ok(res, {
    items: await findTags(
      req.validated.query.q,
      req.validated.query.limit
    )
  });
}

export async function detail(req, res) {
  return ok(res, await getTagDetail(req.validated.params.slug));
}

export async function related(req, res) {
  return ok(res, {
    items: await getRelatedTags(
      req.validated.params.slug,
      req.validated.query.limit
    )
  });
}
