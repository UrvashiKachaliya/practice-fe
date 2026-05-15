import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { getAllProducts } from "../helpers/apiRequest";
import { FiArrowLeft } from "react-icons/fi";

function AllProducts() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["all-products"],
    queryFn: getAllProducts,
    select: (res) => res.data.products,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-orange-500">
              Discover New Flavors
            </h1>

            <p className="text-xs md:text-sm text-gray-400 mt-1">
              Freshly handcrafted khakhras
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-orange-100 shadow-sm hover:bg-orange-50 transition shrink-0"
          >
            <FiArrowLeft className="text-orange-500 text-lg" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data?.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-orange-100 hover:border-orange-300 transition overflow-hidden group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image || "https://placehold.co/300x200?text=🌾"}
                  alt={product.title}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-3">
                <span className="text-xs bg-orange-100 text-orange-500 px-2 py-0.5 rounded-full font-medium">
                  {product.category}
                </span>

                <p className="font-bold text-gray-800 text-sm mt-1.5 truncate">
                  {product.title}
                </p>

                <p className="text-xs text-gray-400 mb-2">
                  by {product.seller_name}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-orange-500 font-extrabold">
                    ₹{product.price}
                  </span>

                  <span className="text-xs text-gray-400">from 500g</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllProducts;
