import { z } from "zod";

export const interactionIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const interactionPaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20)
});

export const createCommentSchema = z
  .object({
    content: z.string().trim().min(1).max(1000),
    parentId: z.coerce.number().int().positive().nullable().optional()
  })
  .strict();

export const createReviewSchema = z
  .object({
    rating: z.coerce.number().int().min(1).max(5),
    content: z.string().trim().max(2000).nullable().optional()
  })
  .strict();

export const updateReviewSchema = z
  .object({
    rating: z.coerce.number().int().min(1).max(5).optional(),
    content: z.string().trim().max(2000).nullable().optional()
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one review field is required"
  });

export const reviewReplySchema = z
  .object({
    content: z.string().trim().min(1).max(2000)
  })
  .strict();

export const reportSchema = z
  .object({
    targetType: z.enum([
      "post",
      "comment",
      "review",
      "place",
      "user",
      "tag"
    ]),
    targetId: z.coerce.number().int().positive(),
    reason: z.string().trim().min(10).max(1000)
  })
  .strict();
