import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSingleProduct, addToCart, toggleWishlist, checkWishlist } from "../helpers/apiRequest";
import { toast } from "sonner";
import { FaArrowLeft, FaShoppingCart, FaHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useAuthPrompt } from "../context/AuthPromptContext";
import { totalWeight } from "../utils/weightUtils";
import NotFound from "./NotFound";

const WEIGHTS = ["500g", "1kg", "2kg", "5kg"];

function SingleProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openAuthPrompt } = useAuthPrompt();
  const [selectedWeight, setSelectedWeight] = useState("500g");
  const [packs, setPacks] = useState(1);

  const isValidId = /^\d+$/.test(id);
  const guard = (action) => user ? action() : openAuthPrompt(`/products/${id}`);
  const qc = useQueryClient();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getSingleProduct(id).then((res) => res.data.product),
    enabled: isValidId,
    retry: false,
  });

  const { data: wishlistStatus } = useQuery({
    queryKey: ["wishlist-check", id],
    queryFn: () => checkWishlist(id).then((r) => r.data),
    enabled: !!user && isValidId,
  });

  const { mutate: addToCartMutate, isPending: isAdding } = useMutation({
    mutationFn: () => addToCart({ productId: Number(id), quantity: packs, weight: selectedWeight }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cart"] }); toast.success("Added to cart! 🛒"); },
    onError: () => toast.error("Failed to add to cart"),
  });

  const { mutate: wishlistMutate, isPending: isWishlisting } = useMutation({
    mutationFn: () => toggleWishlist(Number(id)),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["wishlist-check", id] });
      qc.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success(res.data.wishlisted ? "Added to wishlist ❤️" : "Removed from wishlist");
    },
    onError: () => toast.error("Failed to update wishlist"),
  });

  if (!isValidId) return <NotFound />;

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

  const isWishlisted = wishlistStatus?.wishlisted;

  return (
    <div className="min-h-screen bg-amber-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 mb-5 transition">
          <FaArrowLeft size={13} /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden flex flex-col md:flex-row">
          {/* Image — full width on mobile, half on desktop */}
          <div className="w-full md:w-1/2">
            <img
              src={product.image || "https://placehold.co/500x400?text=🌾"}
              alt={product.title}
              className="w-full h-56 sm:h-64 md:h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2 p-4 sm:p-6 flex flex-col gap-4">
            <div>
              <span className="text-xs bg-orange-100 text-orange-500 px-2.5 py-1 rounded-full font-medium">{product.category}</span>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-800 mt-2">{product.title}</h2>
              <p className="text-gray-400 text-sm mt-1">by {product.seller_name}</p>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-orange-500">₹{product.price}</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.stock > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            {/* Weight Selector */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Select Weight</p>
              <div className="flex flex-wrap gap-2">
                {WEIGHTS.map((w) => (
                  <button key={w} onClick={() => setSelectedWeight(w)}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold border transition ${selectedWeight === w ? "bg-orange-500 text-white border-orange-500 shadow-sm" : "border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"}`}
                  >{w}</button>
                ))}
              </div>
            </div>

            {/* Pack Count */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Packs</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setPacks((p) => Math.max(1, p - 1))}
                  className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-500 transition font-bold text-lg">−</button>
                <span className="w-8 text-center font-extrabold text-gray-800">{packs}</span>
                <button onClick={() => setPacks((p) => Math.min(product.stock, p + 1))} disabled={packs >= product.stock}
                  className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-500 disabled:opacity-40 transition font-bold text-lg">+</button>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">{packs} pack{packs > 1 ? "s" : ""} × {selectedWeight}</span>
                  <span className="text-sm font-bold text-orange-500">= {totalWeight(selectedWeight, packs)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-1">
              <button
                onClick={() => guard(() => addToCartMutate())}
                disabled={isAdding || product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold text-sm hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-200 disabled:opacity-60 transition"
              >
                <FaShoppingCart size={15} />
                {isAdding ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <button
                onClick={() => guard(() => wishlistMutate())}
                disabled={isWishlisting}
                className={`w-12 h-12 flex items-center justify-center border rounded-xl transition ${isWishlisted ? "bg-red-50 border-red-300 text-red-500" : "border-gray-200 text-gray-400 hover:bg-red-50 hover:border-red-300 hover:text-red-500"}`}
              >
                <FaHeart size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
