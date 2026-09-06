import { z } from "zod";

export const emailSchema = z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email");

export const passwordSchema = z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters");
