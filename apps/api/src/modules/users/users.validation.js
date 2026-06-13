import { z } from "zod";

const username = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(50)
  .regex(
    /^[a-z0-9_]+$/,
    "Username may contain only lowercase letters, numbers, and underscores"
  );

export const updateMeSchema = z
  .object({
    fullName: z.string().trim().min(2).max(120).optional(),
    username: username.optional(),
    phone: z
      .string()
      .trim()
      .regex(/^(0|\+84)\d{9}$/, "Vietnamese phone number is invalid")
      .nullable()
      .optional(),
    avatarUrl: z.string().trim().url().max(2048).nullable().optional(),
    coverUrl: z.string().trim().url().max(2048).nullable().optional(),
    bio: z.string().trim().max(500).nullable().optional(),
    location: z.string().trim().max(120).nullable().optional()
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one profile field is required"
  });

export const usernameParamSchema = z.object({
  username
});

export const userIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const publicPostsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20)
});
