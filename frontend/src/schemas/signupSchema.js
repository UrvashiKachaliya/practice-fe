import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    contact: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit number"),
    address: z.string().min(1, "Address is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });
