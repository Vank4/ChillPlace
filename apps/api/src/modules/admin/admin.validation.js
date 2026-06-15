import { z } from "zod";

const page = z.coerce.number().int().min(1).default(1);
const limit = z.coerce.number().int().min(1).max(100).default(20);

export const adminIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const adminListQuerySchema = z.object({
  q: z.string().trim().min(1).max(191).optional(),
  status: z
    .enum([
      "active",
      "inactive",
      "blocked",
      "pending",
      "approved",
      "rejected",
      "hidden",
      "deleted"
    ])
    .optional(),
  role: z.enum(["user", "creator", "business", "admin"]).optional(),
  page,
  limit
});

export const auditLogQuerySchema = z.object({
  action: z.string().trim().max(120).optional(),
  target_type: z.string().trim().max(60).optional(),
  admin_id: z.coerce.number().int().positive().optional(),
  page,
  limit
});

export const userStatusSchema = z
  .object({
    status: z.enum(["active", "inactive", "blocked", "deleted"])
  })
  .strict();

export const placeStatusSchema = z
  .object({
    status: z.enum([
      "pending",
      "approved",
      "rejected",
      "hidden",
      "deleted"
    ])
  })
  .strict();

export const reportListQuerySchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  target_type: z
    .enum(["post", "comment", "review", "place", "user", "tag"])
    .optional(),
  page,
  limit
});

export const resolveReportSchema = z
  .object({
    resolution: z.enum(["resolved", "dismissed"]),
    adminNote: z.string().trim().min(3).max(2000)
  })
  .strict();

export const contentStatusSchema = z
  .object({
    status: z.enum(["approved", "rejected", "hidden", "deleted"])
  })
  .strict();

export const tagListQuerySchema = z.object({
  q: z.string().trim().min(1).max(150).optional(),
  status: z
    .enum(["active", "inactive", "hidden", "merged", "deleted"])
    .optional(),
  type: z.enum(["hashtag", "system", "category"]).optional(),
  page,
  limit
});

export const tagStatusSchema = z
  .object({
    status: z.enum(["active", "inactive", "hidden", "deleted"])
  })
  .strict();

export const mergeTagsSchema = z
  .object({
    sourceTagId: z.coerce.number().int().positive(),
    targetTagId: z.coerce.number().int().positive()
  })
  .strict()
  .refine((value) => value.sourceTagId !== value.targetTagId, {
    message: "Source and target tags must be different",
    path: ["targetTagId"]
  });

export const categoryListQuerySchema = z.object({
  q: z.string().trim().min(1).max(150).optional(),
  status: z.enum(["active", "inactive", "hidden", "deleted"]).optional(),
  page,
  limit
});

const categoryFields = {
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2)
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  icon: z.string().trim().max(255).nullable().optional(),
  parentId: z.coerce.number().int().positive().nullable().optional(),
  status: z.enum(["active", "inactive", "hidden"]).default("active")
};

export const createCategorySchema = z.object(categoryFields).strict();

export const updateCategorySchema = z
  .object({
    name: categoryFields.name.optional(),
    slug: categoryFields.slug.optional(),
    icon: categoryFields.icon,
    parentId: categoryFields.parentId,
    status: z.enum(["active", "inactive", "hidden", "deleted"]).optional()
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one category field is required"
  });
