import { z } from "zod";

export const editProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contact: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit number"),
  address: z.string().min(1, "Address is required"),
});