import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name must be a string",
      message: "Name is required",
    })
    .min(2, { message: "Name must be at least 2 characters long" }),
  email: z
    .string({
      invalid_type_error: "Email must be a string",
      message: "Email is required",
    })
    .email({ message: "Invalid email address" }),
  password: z
    .string({
      invalid_type_error: "Password must be a string",
      message: "Password is required",
    })
    .min(6, { message: "Password must be at least 6 characters long" }),
});
