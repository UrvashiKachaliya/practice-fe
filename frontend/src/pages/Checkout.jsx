import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FiMapPin, FiShoppingBag, FiCalendar } from "react-icons/fi";
import { getCart, placeOrder } from "../helpers/apiRequest";
import { useAuth } from "../context/AuthContext";
import { totalWeight } from "../utils/weightUtils";

function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [address, setAddress] = useState(user?.address || "");
  const [requestedDate, setRequestedDate] = useState("");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart().then((r) => r.data),
  });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = subtotal >= 499 ? 0 : 49;
  const total = subtotal + deliveryFee;

  const { mutate, isPending } = useMutation({
    mutationFn: () => placeOrder({ address, requestedDeliveryDate: requestedDate || null }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success(`Order #${res.data.orderId} placed! Check your email 📧`);
      navigate("/orders");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to place order"),
  });

  const today = new Date().toISOString().split("T")[0];

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (items.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
        <div className="text-center">
          <div className="text-5xl mb-3">🛒</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
          <Link to="/products" className="text-orange-500 font-semibold hover:underline">Browse products</Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4 pb-32 lg:pb-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
            <FiShoppingBag size={18} />
          </div>
          <h2 className="text-xl font-extrabold text-gray-800">Checkout</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-4">

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiMapPin className="text-orange-500" size={18} />
                <h3 className="font-extrabold text-gray-800">Delivery Address</h3>
              </div>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full delivery address..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 resize-none transition"
              />
            </div>

            {/* Requested Delivery Date */}
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-2">
                <FiCalendar className="text-orange-500" size={18} />
                <h3 className="font-extrabold text-gray-800">Preferred Delivery Date</h3>
                <span className="text-xs text-gray-400 font-normal">(optional)</span>
              </div>
              <p className="text-xs text-gray-400 mb-3">Let us know when you'd like your order delivered. We'll confirm or suggest an alternate date.</p>
              <input
                type="date"
                value={requestedDate}
                onChange={(e) => setRequestedDate(e.target.value)}
                min={today}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 transition"
              />
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
              <h3 className="font-extrabold text-gray-800 mb-4">Order Items</h3>
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.image || "https://placehold.co/50x50?text=🌾"} alt={item.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{item.title}</p>
                      <p className="text-xs text-gray-400">
                        {item.weight} × {item.quantity} = <span className="font-semibold text-orange-500">{totalWeight(item.weight, item.quantity)}</span>
                      </p>
                    </div>
                    <p className="font-bold text-gray-800 text-sm shrink-0">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary — desktop */}
          <div className="hidden lg:block lg:w-72 shrink-0">
            <SummaryCard subtotal={subtotal} deliveryFee={deliveryFee} total={total}
              address={address} isPending={isPending} onPlace={() => mutate()} />
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 shadow-2xl px-4 py-4 z-40">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">Total</span>
          <span className="text-lg font-extrabold text-orange-500">₹{total.toFixed(2)}</span>
        </div>
        <button onClick={() => mutate()} disabled={isPending || !address.trim()}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60 transition">
          {isPending ? "Placing Order..." : "Place Order →"}
        </button>
      </div>
    </div>
  );
}

function SummaryCard({ subtotal, deliveryFee, total, address, isPending, onPlace }) {
  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 sticky top-6">
      <h3 className="font-extrabold text-gray-800 mb-5">Order Summary</h3>
      <div className="flex flex-col gap-3 text-sm mb-5">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-700">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Delivery</span>
          <span className={`font-semibold ${deliveryFee === 0 ? "text-green-500" : "text-gray-700"}`}>
            {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
          </span>
        </div>
        <div className="border-t border-gray-100 pt-3 flex justify-between font-extrabold text-gray-800">
          <span>Total</span>
          <span className="text-orange-500 text-lg">₹{total.toFixed(2)}</span>
        </div>
      </div>
      <button onClick={onPlace} disabled={isPending || !address.trim()}
        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60 transition">
        {isPending ? "Placing Order..." : "Place Order →"}
      </button>
    </div>
  );
}

export default Checkout;
