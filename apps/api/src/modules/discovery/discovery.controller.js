import { ok } from "../../common/utils/apiResponse.js";
import {
  getRecommendations,
  unifiedSearch
} from "./discovery.service.js";

export async function search(req, res) {
  return ok(res, await unifiedSearch(req.validated.query));
}

export async function recommendations(req, res) {
  return ok(res, {
    recommendations: await getRecommendations(
      req.validated.query,
      req.user?.id
    )
  });
}
