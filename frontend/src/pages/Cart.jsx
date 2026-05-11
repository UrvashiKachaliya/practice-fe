import React from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import { getCart, updateCartItem, removeCartItem } from "../helpers/apiRequest";
import { totalWeight } from "../utils/weightUtils";

function Cart() {
  const qc = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart().then((r) => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }) => updateCartItem(id, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
    onError: () => toast.error("Failed to update"),
  });

  const removeMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cart"] }); toast.success("Item removed"); },
    onError: () => toast.error("Failed to remove item"),
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= 499 ? 0 : 49;
  const total = subtotal + deliveryFee;

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-amber-50 py-6 px-4 pb-36 lg:pb-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
            <FaShoppingCart size={18} />
          </div>
          <h2 className="text-xl font-extrabold text-gray-800">My Cart</h2>
          {items.length > 0 && (
            <span className="bg-orange-100 text-orange-500 text-xs font-bold px-2.5 py-1 rounded-full">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-orange-100 py-16 px-6 flex flex-col items-center gap-5 text-center">
            <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center">
              <FaShoppingCart size={36} className="text-orange-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-1">Your cart is empty</h3>
              <p className="text-gray-400 text-sm">Add some crispy khakhras to your cart!</p>
            </div>
            <Link
              to="/products"
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-xl font-bold text-sm hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-200 transition-all"
            >
              Browse Khakhras
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-5">

            {/* Cart Items */}
            <div className="flex-1 flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4">
                  <div className="flex gap-3">
                    {/* Image */}
                    <img
                      src={item.image || "https://placehold.co/80x80?text=🌾"}
                      alt={item.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2">{item.title}</h3>
                        <button
                          onClick={() => removeMutation.mutate(item.id)}
                          disabled={removeMutation.isPending}
                          className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition shrink-0"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>

                      {/* Weight badge + total weight */}
                      {item.weight && (
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="text-xs bg-orange-50 text-orange-500 border border-orange-200 px-2 py-0.5 rounded-full font-semibold">
                            {item.weight} × {item.quantity} pack{item.quantity > 1 ? "s" : ""}
                          </span>
                          <span className="text-xs font-bold text-gray-700">
                            = {totalWeight(item.weight, item.quantity)}
                          </span>
                        </div>
                      )}

                      <p className="text-orange-500 font-bold text-sm mt-1.5">₹{item.price}</p>
                    </div>
                  </div>

                  {/* Bottom row: pack controls + item total */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-400 mr-1">Packs:</span>
                      <button
                        onClick={() => updateMutation.mutate({ id: item.id, quantity: item.quantity - 1 })}
                        disabled={item.quantity <= 1 || updateMutation.isPending}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-500 disabled:opacity-40 transition font-bold"
                      >
                        −
                      </button>
                      <span className="w-7 text-center font-extrabold text-gray-800 text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateMutation.mutate({ id: item.id, quantity: item.quantity + 1 })}
                        disabled={item.quantity >= item.stock || updateMutation.isPending}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-500 disabled:opacity-40 transition font-bold"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-extrabold text-gray-800 text-sm">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary — desktop sidebar */}
            <div className="hidden lg:block lg:w-72 shrink-0">
              <OrderSummary subtotal={subtotal} deliveryFee={deliveryFee} total={total} itemCount={items.length} />
            </div>
          </div>
        )}
      </div>

      {/* Order Summary — mobile sticky bottom bar */}
      {items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 shadow-2xl px-4 py-4 z-40">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-gray-400">
              Subtotal <span className="font-bold text-gray-700">₹{subtotal.toFixed(2)}</span>
              {deliveryFee === 0
                ? <span className="ml-2 text-green-500 font-semibold">+ FREE delivery</span>
                : <span className="ml-2 text-gray-500">+ ₹{deliveryFee} delivery</span>
              }
            </div>
            <p className="text-lg font-extrabold text-orange-500">₹{total.toFixed(2)}</p>
          </div>
          <Link
            to="/checkout"
            className="block w-full text-center bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold text-sm hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-200 transition-all"
          >
            Proceed to Checkout →
          </Link>
        </div>
      )}
    </div>
  );
}

function OrderSummary({ subtotal, deliveryFee, total, itemCount }) {
  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 sticky top-6">
      <h3 className="font-extrabold text-gray-800 mb-5">Order Summary</h3>
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
          <span className="font-semibold text-gray-700">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Delivery</span>
          <span className={`font-semibold ${deliveryFee === 0 ? "text-green-500" : "text-gray-700"}`}>
            {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
          </span>
        </div>
        {deliveryFee > 0 && (
          <p className="text-xs text-orange-400 bg-orange-50 px-3 py-2 rounded-lg">
            🎉 Add ₹{(499 - subtotal).toFixed(2)} more for free delivery
          </p>
        )}
        <div className="border-t border-gray-100 pt-3 flex justify-between font-extrabold text-gray-800">
          <span>Total</span>
          <span className="text-orange-500 text-lg">₹{total.toFixed(2)}</span>
        </div>
      </div>
      <Link
        to="/checkout"
        className="mt-5 block w-full text-center bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold text-sm hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-200 transition-all"
      >
        Proceed to Checkout →
      </Link>
      <Link
        to="/products"
        className="mt-3 block w-full text-center border border-orange-200 text-orange-500 py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-50 transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default Cart;
