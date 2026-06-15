import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { mutationRateLimiter } from "../../middlewares/security.middleware.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import {
  approve,
  adminRequests,
  reject
} from "../role-requests/role-requests.controller.js";
import {
  roleRequestDecisionSchema,
  roleRequestIdParamSchema,
  roleRequestListQuerySchema
} from "../role-requests/role-requests.validation.js";
import {
  auditLogs,
  categories,
  commentStatus,
  createCategory,
  mergeTags,
  placeStatus,
  places,
  postStatus,
  reports,
  resolveReport,
  stats,
  tags,
  tagStatus,
  updateCategory,
  users,
  userStatus
} from "./admin.controller.js";
import {
  adminIdParamSchema,
  adminListQuerySchema,
  auditLogQuerySchema,
  categoryListQuerySchema,
  contentStatusSchema,
  createCategorySchema,
  mergeTagsSchema,
  placeStatusSchema,
  reportListQuerySchema,
  resolveReportSchema,
  tagListQuerySchema,
  tagStatusSchema,
  updateCategorySchema,
  userStatusSchema
} from "./admin.validation.js";

export const adminRouter = Router();
adminRouter.use(requireAuth, requireRole("admin"));

adminRouter.get("/stats", asyncHandler(stats));
adminRouter.get(
  "/audit-logs",
  validateRequest({ query: auditLogQuerySchema }),
  asyncHandler(auditLogs)
);
adminRouter.get(
  "/role-requests",
  validateRequest({ query: roleRequestListQuerySchema }),
  asyncHandler(adminRequests)
);
adminRouter.patch(
  "/role-requests/:id/approve",
  mutationRateLimiter,
  validateRequest({
    params: roleRequestIdParamSchema,
    body: roleRequestDecisionSchema
  }),
  asyncHandler(approve)
);
adminRouter.patch(
  "/role-requests/:id/reject",
  mutationRateLimiter,
  validateRequest({
    params: roleRequestIdParamSchema,
    body: roleRequestDecisionSchema
  }),
  asyncHandler(reject)
);
adminRouter.get(
  "/users",
  validateRequest({ query: adminListQuerySchema }),
  asyncHandler(users)
);
adminRouter.patch(
  "/users/:id/status",
  mutationRateLimiter,
  validateRequest({
    params: adminIdParamSchema,
    body: userStatusSchema
  }),
  asyncHandler(userStatus)
);
adminRouter.get(
  "/places",
  validateRequest({ query: adminListQuerySchema }),
  asyncHandler(places)
);
adminRouter.patch(
  "/places/:id/status",
  mutationRateLimiter,
  validateRequest({
    params: adminIdParamSchema,
    body: placeStatusSchema
  }),
  asyncHandler(placeStatus)
);
adminRouter.get(
  "/reports",
  validateRequest({ query: reportListQuerySchema }),
  asyncHandler(reports)
);
adminRouter.patch(
  "/reports/:id/resolve",
  mutationRateLimiter,
  validateRequest({
    params: adminIdParamSchema,
    body: resolveReportSchema
  }),
  asyncHandler(resolveReport)
);
adminRouter.patch(
  "/posts/:id/status",
  mutationRateLimiter,
  validateRequest({
    params: adminIdParamSchema,
    body: contentStatusSchema
  }),
  asyncHandler(postStatus)
);
adminRouter.patch(
  "/comments/:id/status",
  mutationRateLimiter,
  validateRequest({
    params: adminIdParamSchema,
    body: contentStatusSchema
  }),
  asyncHandler(commentStatus)
);
adminRouter.get(
  "/tags",
  validateRequest({ query: tagListQuerySchema }),
  asyncHandler(tags)
);
adminRouter.patch(
  "/tags/:id/status",
  mutationRateLimiter,
  validateRequest({
    params: adminIdParamSchema,
    body: tagStatusSchema
  }),
  asyncHandler(tagStatus)
);
adminRouter.post(
  "/tags/merge",
  mutationRateLimiter,
  validateRequest({ body: mergeTagsSchema }),
  asyncHandler(mergeTags)
);
adminRouter.get(
  "/categories",
  validateRequest({ query: categoryListQuerySchema }),
  asyncHandler(categories)
);
adminRouter.post(
  "/categories",
  mutationRateLimiter,
  validateRequest({ body: createCategorySchema }),
  asyncHandler(createCategory)
);
adminRouter.patch(
  "/categories/:id",
  mutationRateLimiter,
  validateRequest({
    params: adminIdParamSchema,
    body: updateCategorySchema
  }),
  asyncHandler(updateCategory)
);
