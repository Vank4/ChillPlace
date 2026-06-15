import { created, ok } from "../../common/utils/apiResponse.js";
import {
  getAdminRoleRequests,
  getMyRoleRequests,
  reviewRoleRequest,
  submitBusinessRequest,
  submitCreatorRequest
} from "./role-requests.service.js";

export async function creatorRequest(req, res) {
  return created(
    res,
    { request: await submitCreatorRequest(req.user, req.validated.body) },
    "Creator request submitted"
  );
}

export async function businessRequest(req, res) {
  return created(
    res,
    { request: await submitBusinessRequest(req.user, req.validated.body) },
    "Business request submitted"
  );
}

export async function myRequests(req, res) {
  return ok(res, { items: await getMyRoleRequests(req.user.id) });
}

export async function adminRequests(req, res) {
  const result = await getAdminRoleRequests(req.validated.query);
  return ok(res, { items: result.items }, "OK", result.pagination);
}

export async function approve(req, res) {
  return ok(
    res,
    {
      request: await reviewRoleRequest(
        req.validated.params.id,
        req.user.id,
        true,
        req.validated.body
      )
    },
    "Role request approved"
  );
}

export async function reject(req, res) {
  return ok(
    res,
    {
      request: await reviewRoleRequest(
        req.validated.params.id,
        req.user.id,
        false,
        req.validated.body
      )
    },
    "Role request rejected"
  );
}
