import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FaBoxOpen, FaWhatsapp, FaRedo } from "react-icons/fa";
import { getUserOrders, repeatOrder } from "../helpers/apiRequest";
import { totalWeight } from "../utils/weightUtils";

// ── Config — set VITE_WHATSAPP_NUMBER in your .env ─────────
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "919876543210";

const statusStyle = {
  pending:   "bg-yellow-100 text-yellow-600",
  confirmed: "bg-blue-100 text-blue-600",
  shipped:   "bg-purple-100 text-purple-600",
  delivered: "bg-green-100 text-green-600",
  cancelled: "bg-red-100 text-red-500",
};

const statusIcon = {
  pending: "🕐", confirmed: "✅", shipped: "🚚", delivered: "🎉", cancelled: "❌",
};

function Orders() {
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getUserOrders().then((r) => r.data),
  });

  const repeatMutation = useMutation({
    mutationFn: (orderId) => repeatOrder(orderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Items added to cart! 🛒");
      navigate("/cart");
    },
    onError: () => toast.error("Failed to repeat order"),
  });

  const openWhatsApp = (order) => {
    const items = typeof order.items === "string" ? JSON.parse(order.items) : order.items;
    const itemList = items.map(i => `• ${i.title} (${i.weight} × ${i.quantity})`).join("\n");
    const msg = encodeURIComponent(
      `Hi! I need help with my order.\n\n*Order #${order.id}*\n${itemList}\n\n*Total: ₹${parseFloat(order.total_amount).toFixed(2)}*\n*Status: ${order.status}*\n\nPlease assist me.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-500">
              <FaBoxOpen size={18} />
            </div>
            <h2 className="text-xl font-extrabold text-gray-800">My Orders</h2>
            {orders.length > 0 && (
              <span className="bg-green-100 text-green-600 text-xs font-bold px-2.5 py-1 rounded-full">
                {orders.length} order{orders.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* WhatsApp Support Button */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I need help with my order on Khakhra Co.")}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition shadow-sm shadow-green-200"
          >
            <FaWhatsapp size={16} /> Support
          </a>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-orange-100 py-16 px-6 flex flex-col items-center gap-5 text-center">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
              <FaBoxOpen size={36} className="text-green-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-1">No orders yet</h3>
              <p className="text-gray-400 text-sm">Start shopping for crispy goodness!</p>
            </div>
            <Link to="/products"
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-xl font-bold text-sm hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-200 transition-all">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const items = typeof order.items === "string" ? JSON.parse(order.items) : order.items;
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">

                  {/* Order Header */}
                  <button
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-orange-50/30 transition text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{statusIcon[order.status]}</span>
                      <div>
                        <p className="font-extrabold text-gray-800 text-sm">Order #{order.id}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${statusStyle[order.status]}`}>
                        {order.status}
                      </span>
                      <span className="font-extrabold text-orange-500 text-sm">₹{parseFloat(order.total_amount).toFixed(0)}</span>
                      <span className={`text-gray-400 text-xs transition-transform ${expanded === order.id ? "rotate-180" : ""}`}>▼</span>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {expanded === order.id && (
                    <div className="border-t border-gray-50 px-4 pb-4 pt-3">

                      {/* Items */}
                      <div className="flex flex-col gap-3 mb-4">
                        {items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-lg shrink-0">🌾</div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-800 text-sm truncate">{item.title}</p>
                              <p className="text-xs text-gray-400">
                                {item.weight} × {item.quantity} = <span className="font-semibold text-orange-500">{totalWeight(item.weight, item.quantity)}</span>
                              </p>
                            </div>
                            <p className="font-bold text-gray-700 text-sm shrink-0">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>

                      {/* Totals */}
                      <div className="border-t border-gray-50 pt-3 flex flex-col gap-1 text-sm mb-4">
                        <div className="flex justify-between text-gray-400">
                          <span>Delivery</span>
                          <span className={parseFloat(order.delivery_fee) === 0 ? "text-green-500 font-semibold" : "text-gray-600"}>
                            {parseFloat(order.delivery_fee) === 0 ? "FREE" : `₹${parseFloat(order.delivery_fee).toFixed(2)}`}
                          </span>
                        </div>
                        <div className="flex justify-between font-extrabold text-gray-800">
                          <span>Total</span>
                          <span className="text-orange-500">₹{parseFloat(order.total_amount).toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">📍 {order.address}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {/* Repeat Order */}
                        <button
                          onClick={() => repeatMutation.mutate(order.id)}
                          disabled={repeatMutation.isPending}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2.5 rounded-xl text-xs font-bold hover:from-orange-600 hover:to-amber-600 disabled:opacity-60 transition shadow-sm shadow-orange-200"
                        >
                          <FaRedo size={12} />
                          {repeatMutation.isPending ? "Adding..." : "Repeat Order"}
                        </button>

                        {/* WhatsApp Help for this order */}
                        <button
                          onClick={() => openWhatsApp(order)}
                          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm shadow-green-200"
                        >
                          <FaWhatsapp size={14} /> Help
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I need help with my order on Khakhra Co.")}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-green-300 transition z-50"
        title="WhatsApp Support"
      >
        <FaWhatsapp size={26} />
      </a>
    </div>
  );
}

export default Orders;
