import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSingleProduct } from "../helpers/apiRequest";
import { FaArrowLeft, FaShoppingCart, FaHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useAuthPrompt } from "../context/AuthPromptContext";

function SingleProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openAuthPrompt } = useAuthPrompt();

  const guard = (action) => user ? action() : openAuthPrompt(`/products/${id}`);
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getSingleProduct(id).then((res) => res.data.product),
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Product not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 mb-6"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden grid md:grid-cols-2 gap-0">
          {/* Image */}
          <img
            src={product.image || "https://placehold.co/500x400?text=No+Image"}
            alt={product.title}
            className="w-full h-72 md:h-full object-cover"
          />

          {/* Details */}
          <div className="p-8 flex flex-col gap-4">
            <div>
              <span className="text-xs bg-orange-100 text-orange-500 px-2 py-0.5 rounded-full">
                {product.category}
              </span>
              <h2 className="text-2xl font-bold mt-2">{product.title}</h2>
              <p className="text-gray-500 text-sm mt-1">by {product.seller_name}</p>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-orange-500">₹{product.price}</span>
              <span className={`text-sm font-medium ${product.stock > 0 ? "text-green-500" : "text-red-500"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => guard(() => {})}
                className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-2.5 rounded-lg hover:bg-orange-600 font-medium"
              >
                <FaShoppingCart /> Add to Cart
              </button>
              <button
                onClick={() => guard(() => {})}
                className="px-4 py-2.5 border rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-500"
              >
                <FaHeart />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
