import { success, ok } from "../../common/utils/apiResponse.js";
import { getFeed, getPostDetail } from "./posts.service.js";

export async function feed(req, res) {
  const result = await getFeed(req.validated.query);
  return success(res, {
    data: { items: result.items },
    cursor: result.cursor
  });
}

export async function postDetail(req, res) {
  return ok(res, {
    post: await getPostDetail(req.validated.params.id)
  });
}
