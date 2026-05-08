import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getAllProducts } from "../helpers/apiRequest";
import { useAuth } from "../context/AuthContext";

function Products() {
  const { user } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    select: (res) => res.data.products,
  });

  console.log("user role:", user?.role);
  console.log("products data:", data);
  console.log("error:", error);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load products: {error?.message}
      </div>
    );

  const canAddProduct = user?.role === "seller" || user?.role === "admin";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">All Products</h2>
          {canAddProduct && (
            <Link
              to="/products/add"
              className="bg-orange-500 text-white px-5 py-2 rounded-full text-sm hover:bg-orange-600"
            >
              + Add Product
            </Link>
          )}
        </div>

        {!data || data.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {data.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border"
              >
                <img
                  src={product.image || "https://placehold.co/300x200?text=No+Image"}
                  alt={product.title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-3">
                  <p className="font-semibold text-sm truncate">{product.title}</p>
                  <p className="text-xs text-gray-400 mb-1">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-500 font-bold text-sm">₹{product.price}</span>
                    {/* <span className="text-xs text-gray-400">Stock: {product.stock}</span> */}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
