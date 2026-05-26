import { fail } from "../common/utils/apiResponse.js";

export function notFoundMiddleware(req, res) {
  return fail(res, 404, "Not found");
}

