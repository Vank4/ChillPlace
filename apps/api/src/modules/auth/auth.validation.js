import { z } from "zod";

const email = z.string().trim().toLowerCase().email().max(191);
const password = z.string().min(8).max(72);
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
const phone = z
  .string()
  .trim()
  .regex(/^(0|\+84)\d{9}$/, "Vietnamese phone number is invalid");

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2).max(120).optional(),
    firstName: z.string().trim().min(1).max(60).optional(),
    lastName: z.string().trim().min(1).max(60).optional(),
    username: username.optional(),
    email,
    phone,
    password,
    acceptedTerms: z.literal(true)
  })
  .strict()
  .superRefine((value, context) => {
    if (!value.fullName && !(value.firstName && value.lastName)) {
      context.addIssue({
        code: "custom",
        path: ["fullName"],
        message: "Provide fullName or both firstName and lastName"
      });
    }
  });

export const loginSchema = z
  .object({
    email,
    password: z.string().min(1).max(72)
  })
  .strict();
