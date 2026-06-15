import { z } from "zod";

const nullableUrl = z.string().trim().url().max(2048).nullable().optional();

export const businessScopeQuerySchema = z.object({
  business_id: z.coerce.number().int().positive().optional(),
  place_id: z.coerce.number().int().positive().optional()
});

export const businessSlugParamSchema = z.object({
  slug: z.string().trim().min(3).max(191)
});

export const businessIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const updateBusinessSchema = z
  .object({
    businessName: z.string().trim().min(2).max(191).optional(),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(3)
      .max(191)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),
    phone: z.string().trim().max(30).nullable().optional(),
    address: z.string().trim().max(1000).nullable().optional()
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one business field is required"
  });

export const updateBusinessPlaceSchema = z
  .object({
    name: z.string().trim().min(2).max(191).optional(),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(3)
      .max(191)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),
    categoryId: z.coerce.number().int().positive().nullable().optional(),
    address: z.string().trim().max(1000).nullable().optional(),
    ward: z.string().trim().max(120).nullable().optional(),
    district: z.string().trim().max(120).nullable().optional(),
    city: z.string().trim().max(120).nullable().optional(),
    lat: z.coerce.number().min(-90).max(90).nullable().optional(),
    lng: z.coerce.number().min(-180).max(180).nullable().optional(),
    priceMin: z.coerce.number().int().min(0).nullable().optional(),
    priceMax: z.coerce.number().int().min(0).nullable().optional(),
    openingHours: z.record(z.string(), z.unknown()).nullable().optional()
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one place field is required"
  })
  .superRefine((value, context) => {
    if (
      value.priceMin !== undefined &&
      value.priceMax !== undefined &&
      value.priceMin !== null &&
      value.priceMax !== null &&
      value.priceMin > value.priceMax
    ) {
      context.addIssue({
        code: "custom",
        path: ["priceMax"],
        message: "priceMax must be greater than or equal to priceMin"
      });
    }
  });

const menuItemSchema = z
  .object({
    id: z.string().trim().max(80).optional(),
    name: z.string().trim().min(1).max(191),
    description: z.string().trim().max(1000).nullable().optional(),
    price: z.coerce.number().min(0),
    imageUrl: nullableUrl,
    available: z.boolean().default(true)
  })
  .strict();

export const updateMenuSchema = z
  .object({
    categories: z
      .array(
        z
          .object({
            name: z.string().trim().min(1).max(120),
            items: z.array(menuItemSchema).max(100)
          })
          .strict()
      )
      .max(30)
  })
  .strict();

export const mediaBodySchema = z
  .object({
    mediaUrl: z.string().trim().url().max(2048).optional(),
    thumbnailUrl: nullableUrl,
    mediaType: z.enum(["image", "video"]).optional(),
    sortOrder: z.coerce.number().int().min(0).default(0)
  })
  .strict();

export const reorderMediaSchema = z
  .object({
    items: z
      .array(
        z
          .object({
            id: z.coerce.number().int().positive(),
            sortOrder: z.coerce.number().int().min(0)
          })
          .strict()
      )
      .min(1)
      .max(100)
  })
  .strict();

export const paginationBusinessQuerySchema = businessScopeQuerySchema.extend({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20)
});

const optionalDate = z.coerce.date().nullable().optional();

const promotionFields = {
  title: z.string().trim().min(2).max(191),
  description: z.string().trim().max(3000).nullable().optional(),
  discountText: z.string().trim().max(191).nullable().optional(),
  conditions: z.string().trim().max(3000).nullable().optional(),
  validFrom: optionalDate,
  validTo: optionalDate,
  caption: z.string().trim().max(3000).nullable().optional()
};

function validDateRange(schema) {
  return schema
  .strict()
  .superRefine((value, context) => {
    if (
      value.validFrom &&
      value.validTo &&
      value.validTo <= value.validFrom
    ) {
      context.addIssue({
        code: "custom",
        path: ["validTo"],
        message: "validTo must be later than validFrom"
      });
    }
  });
}

export const createPromotionSchema = validDateRange(
  z.object({
    placeId: z.coerce.number().int().positive().optional(),
    ...promotionFields
  })
);

export const updatePromotionSchema = validDateRange(
  z
    .object({
      ...Object.fromEntries(
        Object.entries(promotionFields).map(([key, schema]) => [
          key,
          schema.optional()
        ])
      ),
      status: z.enum(["active", "inactive"]).optional()
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one promotion field is required"
    })
);
