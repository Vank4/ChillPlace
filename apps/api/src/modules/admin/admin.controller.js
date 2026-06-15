import { created, ok } from "../../common/utils/apiResponse.js";
import {
  addAdminCategory,
  changeContentStatus,
  changePlaceStatus,
  changeTagStatus,
  changeUserStatus,
  editAdminCategory,
  getAdminCategories,
  getAdminPlaces,
  getAdminReports,
  getAdminStats,
  getAdminTags,
  getAdminUsers,
  getAuditLogs,
  mergeAdminTags,
  resolveAdminReport
} from "./admin.service.js";

function paginated(res, result) {
  return ok(res, { items: result.items }, "OK", result.pagination);
}

export async function stats(req, res) {
  return ok(res, { stats: await getAdminStats() });
}

export async function auditLogs(req, res) {
  return paginated(res, await getAuditLogs(req.validated.query));
}

export async function users(req, res) {
  return paginated(res, await getAdminUsers(req.validated.query));
}

export async function userStatus(req, res) {
  return ok(
    res,
    {
      user: await changeUserStatus(
        req.user,
        req.validated.params.id,
        req.validated.body.status
      )
    },
    "User status updated"
  );
}

export async function places(req, res) {
  return paginated(res, await getAdminPlaces(req.validated.query));
}

export async function placeStatus(req, res) {
  return ok(
    res,
    {
      place: await changePlaceStatus(
        req.user.id,
        req.validated.params.id,
        req.validated.body.status
      )
    },
    "Place status updated"
  );
}

export async function reports(req, res) {
  return paginated(res, await getAdminReports(req.validated.query));
}

export async function resolveReport(req, res) {
  return ok(
    res,
    {
      report: await resolveAdminReport(
        req.user.id,
        req.validated.params.id,
        req.validated.body
      )
    },
    "Report resolved"
  );
}

export async function postStatus(req, res) {
  return ok(
    res,
    {
      post: await changeContentStatus(
        req.user.id,
        "post",
        req.validated.params.id,
        req.validated.body.status
      )
    },
    "Post status updated"
  );
}

export async function commentStatus(req, res) {
  return ok(
    res,
    {
      comment: await changeContentStatus(
        req.user.id,
        "comment",
        req.validated.params.id,
        req.validated.body.status
      )
    },
    "Comment status updated"
  );
}

export async function tags(req, res) {
  return paginated(res, await getAdminTags(req.validated.query));
}

export async function tagStatus(req, res) {
  return ok(
    res,
    {
      tag: await changeTagStatus(
        req.user.id,
        req.validated.params.id,
        req.validated.body.status
      )
    },
    "Tag status updated"
  );
}

export async function mergeTags(req, res) {
  return ok(
    res,
    { merge: await mergeAdminTags(req.user.id, req.validated.body) },
    "Tags merged"
  );
}

export async function categories(req, res) {
  return paginated(res, await getAdminCategories(req.validated.query));
}

export async function createCategory(req, res) {
  return created(
    res,
    {
      category: await addAdminCategory(req.user.id, req.validated.body)
    },
    "Category created"
  );
}

export async function updateCategory(req, res) {
  return ok(
    res,
    {
      category: await editAdminCategory(
        req.user.id,
        req.validated.params.id,
        req.validated.body
      )
    },
    "Category updated"
  );
}
