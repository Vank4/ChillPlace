import { z } from "zod";

const baseRequest = {
  reason: z.string().trim().min(20).max(3000),
  evidenceUrl: z.string().trim().url().max(2048).nullable().optional()
};

export const creatorRequestSchema = z
  .object({
    ...baseRequest,
    displayName: z.string().trim().min(2).max(120),
    bio: z.string().trim().max(2000).nullable().optional(),
    socialLinks: z.record(z.string(), z.string().url()).nullable().optional()
  })
  .strict();

export const businessRequestSchema = z
  .object({
    ...baseRequest,
    businessName: z.string().trim().min(2).max(191),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(3)
      .max(191)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    phone: z.string().trim().max(30).nullable().optional(),
    address: z.string().trim().max(1000).nullable().optional()
  })
  .strict();

export const roleRequestListQuerySchema = z.object({
  request_type: z.enum(["creator", "business"]).optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20)
});

export const roleRequestIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const roleRequestDecisionSchema = z
  .object({
    adminNote: z.string().trim().max(2000).nullable().optional()
  })
  .strict();
