import { z } from "zod";

const creatorId = z.coerce.number().int().positive().optional();

export const creatorScopeQuerySchema = z.object({
  creator_id: creatorId
});

export const creatorPostsQuerySchema = z.object({
  creator_id: creatorId,
  q: z.string().trim().min(1).max(120).optional(),
  status: z
    .enum(["pending", "approved", "rejected", "hidden", "deleted"])
    .optional(),
  type: z.enum(["review", "promotion", "event", "album"]).optional(),
  sort: z
    .enum(["newest", "oldest", "views", "likes", "comments", "saves"])
    .default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20)
});

export const topPostsQuerySchema = z.object({
  creator_id: creatorId,
  metric: z
    .enum(["engagement", "views", "likes", "comments", "saves", "shares"])
    .default("engagement"),
  limit: z.coerce.number().int().min(1).max(50).default(10)
});

export const creatorAnalyticsQuerySchema = z.object({
  creator_id: creatorId,
  period: z.enum(["7d", "30d", "90d", "all"]).default("30d")
});

export const creatorPostIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const postAnalyticsQuerySchema = z.object({
  creator_id: creatorId
});
