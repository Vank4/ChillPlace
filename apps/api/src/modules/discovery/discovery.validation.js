import { z } from "zod";

const page = z.coerce.number().int().min(1).default(1);
const limit = z.coerce.number().int().min(1).max(50).default(20);
const latitude = z.coerce.number().min(-90).max(90);
const longitude = z.coerce.number().min(-180).max(180);
const booleanQuery = z
  .enum(["true", "false", "1", "0"])
  .transform((value) => value === "true" || value === "1");

export const paginationSchema = z.object({ page, limit });

export const placeListQuerySchema = z
  .object({
    q: z.string().trim().min(1).max(120).optional(),
    category: z.string().trim().min(1).max(150).optional(),
    city: z.string().trim().min(1).max(120).optional(),
    district: z.string().trim().min(1).max(120).optional(),
    rating_min: z.coerce.number().min(0).max(5).optional(),
    open_now: booleanQuery.optional(),
    lat: latitude.optional(),
    lng: longitude.optional(),
    radius: z.coerce.number().positive().max(100).default(10),
    sort: z
      .enum(["newest", "rating", "popular", "distance"])
      .default("popular"),
    page,
    limit
  })
  .superRefine((value, context) => {
    if ((value.lat === undefined) !== (value.lng === undefined)) {
      context.addIssue({
        code: "custom",
        path: ["lat"],
        message: "lat and lng must be provided together"
      });
    }
    if (value.sort === "distance" && value.lat === undefined) {
      context.addIssue({
        code: "custom",
        path: ["lat"],
        message: "lat and lng are required for distance sorting"
      });
    }
  });

export const nearbyQuerySchema = placeListQuerySchema.safeExtend({
  lat: latitude,
  lng: longitude,
  radius: z.coerce.number().positive().max(100).default(5),
  sort: z.enum(["distance", "rating", "popular"]).default("distance")
});

export const mapQuerySchema = z
  .object({
    north: latitude.optional(),
    south: latitude.optional(),
    east: longitude.optional(),
    west: longitude.optional(),
    category: z.string().trim().min(1).max(150).optional(),
    q: z.string().trim().min(1).max(120).optional(),
    rating_min: z.coerce.number().min(0).max(5).optional(),
    open_now: booleanQuery.optional(),
    limit: z.coerce.number().int().min(1).max(200).default(100)
  })
  .superRefine((value, context) => {
    const bounds = [value.north, value.south, value.east, value.west];
    if (bounds.some((item) => item !== undefined) && bounds.some((item) => item === undefined)) {
      context.addIssue({
        code: "custom",
        path: ["north"],
        message: "north, south, east and west must be provided together"
      });
    }
    if (value.north !== undefined && value.north <= value.south) {
      context.addIssue({
        code: "custom",
        path: ["north"],
        message: "north must be greater than south"
      });
    }
  });

export const slugParamSchema = z.object({
  slug: z.string().trim().min(1).max(191)
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const feedQuerySchema = z.object({
  cursor: z.string().trim().min(1).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  type: z.enum(["review", "promotion", "event", "album"]).optional(),
  tag: z.string().trim().min(1).max(150).optional()
});

export const searchQuerySchema = z.object({
  q: z.string().trim().min(1).max(120),
  page,
  limit: z.coerce.number().int().min(1).max(20).default(10)
});

export const tagSearchQuerySchema = z.object({
  q: z.string().trim().min(1).max(120),
  limit: z.coerce.number().int().min(1).max(50).default(20)
});

export const trendingTagsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20)
});

export const recommendationsQuerySchema = z
  .object({
    lat: latitude.optional(),
    lng: longitude.optional(),
    limit: z.coerce.number().int().min(1).max(50).default(20)
  })
  .superRefine((value, context) => {
    if ((value.lat === undefined) !== (value.lng === undefined)) {
      context.addIssue({
        code: "custom",
        path: ["lat"],
        message: "lat and lng must be provided together"
      });
    }
  });
