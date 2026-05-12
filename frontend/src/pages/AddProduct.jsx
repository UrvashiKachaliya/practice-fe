import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { addProduct, updateProduct } from "../helpers/apiRequest";
import { productSchema } from "../schemas/addproductSchema";

const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1";
const errorClass = "text-red-500 text-xs mt-1";

// ── Shared form UI ────────────────────────────────────────────
export function ProductForm({ defaultValues = {}, onSubmit, isPending, isEdit = false, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { status: "active", ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

      <div>
        <label className={labelClass}>Image URL</label>
        <input {...register("image")} placeholder="https://example.com/image.jpg" className={inputClass} />
        {errors.image && <p className={errorClass}>{errors.image.message}</p>}
      </div>

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

      <div className={onCancel ? "flex gap-3" : ""}>
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
        )}
        <button type="submit" disabled={isPending}
          className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold text-sm hover:from-orange-600 hover:to-amber-600 disabled:opacity-60 transition shadow-md shadow-orange-200">
          {isPending ? (isEdit ? "Saving..." : "Adding...") : (isEdit ? "Update Product" : "Add Product")}
        </button>
      </div>
    </form>
  );
}

// ── Add Product Page ──────────────────────────────────────────
export default function AddProduct() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: addProduct,
    onSuccess: () => { toast.success("Product added!"); navigate("/products"); },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to add product"),
  });

  return (
    <div className="min-h-screen bg-amber-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-orange-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-400 to-amber-500 px-8 py-6">
            <h2 className="text-xl font-extrabold text-white">Add Product</h2>
            <p className="text-orange-100 text-sm mt-0.5">Fill in the details to list a new product</p>
          </div>
          <div className="p-8">
            <ProductForm onSubmit={(data) => mutate(data)} isPending={isPending} onCancel={() => navigate(-1)} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Edit Product Modal ────────────────────────────────────────
export function EditProductModal({ product, onClose }) {
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => updateProduct(product.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product updated!");
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update product"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-orange-400 to-amber-500 px-8 py-6">
          <h2 className="text-xl font-extrabold text-white">Edit Product</h2>
          <p className="text-orange-100 text-sm mt-0.5">Update the product details</p>
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          <ProductForm
            isEdit
            defaultValues={{
              title: product.title,
              description: product.description || "",
              category: product.category,
              price: product.price,
              stock: product.stock,
              image: product.image || "",
              status: product.status || "active",
            }}
            onSubmit={(data) => mutate(data)}
            isPending={isPending}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
