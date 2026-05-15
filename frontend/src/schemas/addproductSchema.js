import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  stock: z.coerce.number().int().nonnegative("Stock must be 0 or more"),
  image: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]).optional().default("active"),
});
