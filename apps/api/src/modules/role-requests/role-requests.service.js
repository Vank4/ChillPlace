import { AppError } from "../../common/errors/AppError.js";
import { createPagination } from "../../common/utils/apiResponse.js";
import {
  createRoleRequest,
  decideRoleRequest,
  findPendingRoleRequest,
  findRoleRequest,
  listAdminRoleRequests,
  listUserRoleRequests
} from "./role-requests.repository.js";

function serializeRequest(request) {
  return {
    id: request.id,
    requestType: request.requestType,
    status: request.status,
    reason: request.reason,
    evidenceUrl: request.evidenceUrl,
    applicationData: request.applicationData,
    adminNote: request.adminNote,
    reviewedBy: request.reviewedBy,
    reviewedAt: request.reviewedAt,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    user: request.user
  };
}

async function submit(user, requestType, input) {
  if (user.role !== "user") {
    throw AppError.conflict("Only standard users can request a role upgrade");
  }
  if (await findPendingRoleRequest(user.id, requestType)) {
    throw AppError.conflict("A pending request of this type already exists");
  }
  const { reason, evidenceUrl, ...applicationData } = input;
  return serializeRequest(
    await createRoleRequest({
      userId: user.id,
      requestType,
      reason,
      evidenceUrl,
      applicationData,
      status: "pending"
    })
  );
}

export function submitCreatorRequest(user, input) {
  return submit(user, "creator", input);
}

export function submitBusinessRequest(user, input) {
  return submit(user, "business", input);
}

export async function getMyRoleRequests(userId) {
  return (await listUserRoleRequests(userId)).map(serializeRequest);
}

export async function getAdminRoleRequests(query) {
  const [requests, total] = await listAdminRoleRequests(query);
  return {
    items: requests.map(serializeRequest),
    pagination: createPagination({ ...query, total })
  };
}

export async function reviewRoleRequest(id, adminId, approved, input) {
  const request = await findRoleRequest(id);
  if (!request) throw AppError.notFound("Role request not found");
  if (request.status !== "pending") {
    throw AppError.conflict("Role request has already been reviewed");
  }
  const updated = await decideRoleRequest({
    request,
    adminId,
    approved,
    adminNote: input.adminNote
  });
  if (!updated) throw AppError.conflict("Role request has already been reviewed");
  return serializeRequest({ ...request, ...updated });
}
