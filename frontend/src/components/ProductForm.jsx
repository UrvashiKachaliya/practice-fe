import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../schemas/addproductSchema";

const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1";
const errorClass = "text-red-500 text-xs mt-1";

export default function ProductForm({ defaultValues = {}, onSubmit, isPending, isEdit = false }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

      {/* Row 1: Title + Category */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Title</label>
          <input {...register("title")} placeholder="Masala Khakhra" className={inputClass} />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <input {...register("category")} placeholder="Snacks" className={inputClass} />
          {errors.category && <p className={errorClass}>{errors.category.message}</p>}
        </div>
      </div>

      {/* Row 2: Price + Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Price (₹)</label>
          <input type="number" {...register("price")} placeholder="99" className={inputClass} />
          {errors.price && <p className={errorClass}>{errors.price.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Stock</label>
          <input type="number" {...register("stock")} placeholder="100" className={inputClass} />
          {errors.stock && <p className={errorClass}>{errors.stock.message}</p>}
        </div>
      </div>

      {/* Image URL */}
      <div>
        <label className={labelClass}>Image URL</label>
        <input {...register("image")} placeholder="https://example.com/image.jpg" className={inputClass} />
        {errors.image && <p className={errorClass}>{errors.image.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea {...register("description")} rows={3} placeholder="Describe your product..."
          className={`${inputClass} resize-none`} />
        {errors.description && <p className={errorClass}>{errors.description.message}</p>}
      </div>


        <div>
          <label className={labelClass}>Status</label>
          <select {...register("status")} className={inputClass}>
            <option value="active">Active — visible to customers</option>
            <option value="inactive">Inactive — hidden from customers</option>
          </select>
        </div>
  

      <button type="submit" disabled={isPending}
        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold text-sm hover:from-orange-600 hover:to-amber-600 disabled:opacity-60 transition shadow-md shadow-orange-200">
        {isPending ? (isEdit ? "Saving..." : "Adding...") : (isEdit ? "Update Product" : "Add Product")}
      </button>
    </form>
  );
}
