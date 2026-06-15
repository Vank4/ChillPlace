import { AppError } from "../../common/errors/AppError.js";
import { createPagination } from "../../common/utils/apiResponse.js";
import {
  countActiveAdmins,
  createCategoryWithAudit,
  findAdminCategory,
  findAdminPlace,
  findAdminReport,
  findAdminTag,
  findAdminUser,
  getAdminStatsData,
  listAdminCategories,
  listAdminPlaces,
  listAdminReports,
  listAdminTags,
  listAdminUsers,
  listAuditLogs,
  mergeTagsWithAudit,
  resolveReportWithAudit,
  updateCategoryWithAudit,
  updateContentStatusWithAudit,
  updatePlaceStatusWithAudit,
  updateTagStatusWithAudit,
  updateUserStatusWithAudit
} from "./admin.repository.js";

function groupedCounts(items, keys) {
  const result = {};
  for (const item of items) {
    let cursor = result;
    for (const key of keys.slice(0, -1)) {
      const value = item[key];
      cursor[value] ??= {};
      cursor = cursor[value];
    }
    cursor[item[keys.at(-1)]] = item._count.id;
  }
  return result;
}

export async function getAdminStats() {
  const data = await getAdminStatsData();
  return {
    users: groupedCounts(data.users, ["role", "status"]),
    places: groupedCounts(data.places, ["status"]),
    posts: groupedCounts(data.posts, ["status"]),
    comments: groupedCounts(data.comments, ["status"]),
    reports: groupedCounts(data.reports, ["status"]),
    roleRequests: groupedCounts(data.roleRequests, ["requestType", "status"]),
    tags: groupedCounts(data.tags, ["status"]),
    categories: groupedCounts(data.categories, ["status"])
  };
}

export async function getAuditLogs(query) {
  const [items, total] = await listAuditLogs(query);
  return {
    items,
    pagination: createPagination({ ...query, total })
  };
}

export async function getAdminUsers(query) {
  const [items, total] = await listAdminUsers(query);
  return {
    items,
    pagination: createPagination({ ...query, total })
  };
}

export async function changeUserStatus(admin, id, status) {
  const user = await findAdminUser(id);
  if (!user) throw AppError.notFound("User not found");
  if (
    user.role === "admin" &&
    user.status === "active" &&
    status !== "active" &&
    (await countActiveAdmins()) <= 1
  ) {
    throw AppError.conflict("The last active admin cannot be disabled");
  }
  if (user.id === admin.id && status === "deleted") {
    throw AppError.conflict("Admins cannot delete their own account");
  }
  return updateUserStatusWithAudit(admin.id, user, status);
}

export async function getAdminPlaces(query) {
  const [items, total] = await listAdminPlaces(query);
  return {
    items,
    pagination: createPagination({ ...query, total })
  };
}

export async function changePlaceStatus(adminId, id, status) {
  const place = await findAdminPlace(id);
  if (!place) throw AppError.notFound("Place not found");
  return updatePlaceStatusWithAudit(adminId, place, status);
}

export async function getAdminReports(query) {
  const [items, total] = await listAdminReports(query);
  return {
    items,
    pagination: createPagination({ ...query, total })
  };
}

export async function resolveAdminReport(adminId, id, input) {
  const report = await findAdminReport(id);
  if (!report) throw AppError.notFound("Report not found");
  if (report.status !== "pending") {
    throw AppError.conflict("Report has already been resolved");
  }
  return resolveReportWithAudit(adminId, report, {
    ...input,
    status: input.resolution === "resolved" ? "approved" : "rejected"
  });
}

export async function changeContentStatus(adminId, model, id, status) {
  const updated = await updateContentStatusWithAudit(
    adminId,
    model,
    id,
    status
  );
  if (!updated) throw AppError.notFound(`${model} not found`);
  return updated;
}

export async function getAdminTags(query) {
  const [items, total] = await listAdminTags(query);
  return {
    items,
    pagination: createPagination({ ...query, total })
  };
}

export async function changeTagStatus(adminId, id, status) {
  const tag = await findAdminTag(id);
  if (!tag) throw AppError.notFound("Tag not found");
  if (tag.status === "merged") {
    throw AppError.conflict("Merged tags cannot change status");
  }
  return updateTagStatusWithAudit(adminId, tag, status);
}

export async function mergeAdminTags(adminId, input) {
  const [source, target] = await Promise.all([
    findAdminTag(input.sourceTagId),
    findAdminTag(input.targetTagId)
  ]);
  if (!source || !target) throw AppError.notFound("Source or target tag not found");
  if (source.status === "merged" || target.status === "merged") {
    throw AppError.conflict("Merged tags cannot be merged again");
  }
  if (target.status !== "active") {
    throw AppError.conflict("Target tag must be active");
  }
  return mergeTagsWithAudit(adminId, source, target);
}

export async function getAdminCategories(query) {
  const [items, total] = await listAdminCategories(query);
  return {
    items,
    pagination: createPagination({ ...query, total })
  };
}

async function validateCategoryParent(id, parentId) {
  if (parentId === undefined || parentId === null) return;
  if (parentId === id) {
    throw AppError.unprocessable("Category cannot be its own parent", {
      parentId: "Choose a different parent"
    });
  }
  const parent = await findAdminCategory(parentId);
  if (!parent || parent.status === "deleted") {
    throw AppError.unprocessable("Parent category is invalid", {
      parentId: "Parent category does not exist"
    });
  }
}

export async function addAdminCategory(adminId, input) {
  await validateCategoryParent(null, input.parentId);
  return createCategoryWithAudit(adminId, input);
}

export async function editAdminCategory(adminId, id, input) {
  const category = await findAdminCategory(id);
  if (!category) throw AppError.notFound("Category not found");
  await validateCategoryParent(id, input.parentId);
  return updateCategoryWithAudit(adminId, category, input);
}
