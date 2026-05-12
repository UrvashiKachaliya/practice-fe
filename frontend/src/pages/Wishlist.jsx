import React from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";
import { getWishlist, toggleWishlist, addToCart } from "../helpers/apiRequest";

function Wishlist() {
  const qc = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => getWishlist().then((r) => r.data),
  });

  const removeMutation = useMutation({
    mutationFn: (productId) => toggleWishlist(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Removed from wishlist");
    },
    onError: () => toast.error("Failed to remove"),
  });

  const cartMutation = useMutation({
    mutationFn: (productId) => addToCart({ productId, quantity: 1, weight: "500g" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart! 🛒");
    },
    onError: () => toast.error("Failed to add to cart"),
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-500">
            <FaHeart size={18} />
          </div>
          <h2 className="text-xl font-extrabold text-gray-800">My Wishlist</h2>
          {items.length > 0 && (
            <span className="bg-pink-100 text-pink-500 text-xs font-bold px-2.5 py-1 rounded-full">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-orange-100 py-16 px-6 flex flex-col items-center gap-5 text-center">
            <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center">
              <FaHeart size={36} className="text-pink-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-1">Your wishlist is empty</h3>
              <p className="text-gray-400 text-sm">Save your favourite khakhras here!</p>
            </div>
            <Link to="/products"
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-xl font-bold text-sm hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-200 transition-all">
              Browse Khakhras
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden group">
                <Link to={`/products/${item.product_id}`} className="block relative overflow-hidden">
                  <img
                    src={item.image || "https://placehold.co/300x200?text=🌾"}
                    alt={item.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-white text-gray-700 text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
                    </div>
                  )}
                </Link>
                <div className="p-4">
                  <span className="text-xs bg-orange-100 text-orange-500 px-2 py-0.5 rounded-full font-medium">{item.category}</span>
                  <Link to={`/products/${item.product_id}`}>
                    <p className="font-bold text-gray-800 text-sm mt-1.5 truncate hover:text-orange-500 transition">{item.title}</p>
                  </Link>
                  <p className="text-xs text-gray-400 mb-3">by {item.seller_name}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-orange-500 font-extrabold">₹{item.price}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.stock > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                      {item.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => cartMutation.mutate(item.product_id)}
                      disabled={item.stock === 0 || cartMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2 rounded-xl text-xs font-bold hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 transition"
                    >
                      <FaShoppingCart size={12} /> Add to Cart
                    </button>
                    <button
                      onClick={() => removeMutation.mutate(item.product_id)}
                      disabled={removeMutation.isPending}
                      className="w-9 h-9 flex items-center justify-center border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
