import { z } from "zod";

export const signupSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .max(50, "Full name too long"),
  email: z
    .email("Invalid email format"),
  password: z
    .string()
    .min(4, "Password must be at least 6 characters long")
});

export const loginSchema = z.object({
  email: z
    .email("Invalid email format"),
  password: z
    .string()
    .min(4, "Password must be at least 6 characters long")
});
