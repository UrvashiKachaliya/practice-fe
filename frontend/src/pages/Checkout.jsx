import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FiMapPin, FiShoppingBag, FiCalendar } from "react-icons/fi";
import { getCart, placeOrder, createPaymentOrder, getActiveOffers, validateCoupon } from "../helpers/apiRequest";
import { useAuth } from "../context/AuthContext";
import { totalWeight } from "../utils/weightUtils";
import { ONLINE_PAYMENT_ENABLED } from "../constants/featureFlags";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

// ── Set to true to enable online payment via Razorpay ────────

function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [address, setAddress] = useState(user?.address || "");
  const [requestedDate, setRequestedDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" | "online"
  const [isPending, setIsPending] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart().then((r) => r.data),
  });

  const { data: offers = [] } = useQuery({
    queryKey: ["offers"],
    queryFn: () => getActiveOffers().then((r) => r.data),
  });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = subtotal >= 499 ? 0 : 49;
  const discount = appliedCoupon ? Math.min(Number(appliedCoupon.discount) || 0, subtotal) : 0;
  const total = Math.max(subtotal - discount + deliveryFee, 0);
  const couponOffers = offers.filter((offer) => offer.code);

  const handleApplyCoupon = async (code = couponCode) => {
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) return toast.error("Enter a coupon code");
    setIsApplyingCoupon(true);
    try {
      const { data } = await validateCoupon({ code: normalizedCode, subtotal });
      setAppliedCoupon(data);
      setCouponCode(data.code);
      toast.success(`${data.code} applied`);
    } catch (err) {
      setAppliedCoupon(null);
      toast.error(err.response?.data?.message || "Invalid coupon code");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handleCOD = async () => {
    if (!address.trim()) return toast.error("Please enter a delivery address");
    setIsPending(true);
    try {
      const res = await placeOrder({ address, requestedDeliveryDate: requestedDate || null, couponCode: appliedCoupon?.code });
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success(`Order #${res.data.orderId} placed! Check your email 📧`);
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setIsPending(false);
    }
  };

  const handleOnlinePayment = async () => {
    if (!address.trim()) return toast.error("Please enter a delivery address");
    setIsPending(true);

    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error("Failed to load payment gateway.");
      setIsPending(false);
      return;
    }

    try {
      const { data } = await createPaymentOrder(total);

      const options = {
        key: data.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Khakhra Co.",
        description: "Fresh Crispy Khakhras 🌾",
        order_id: data.razorpay_order_id,
        prefill: { name: user.name, email: user.email, contact: user.contact || "" },
        theme: { color: "#f97316" },
        handler: async (response) => {
          try {
            const res = await placeOrder({
              address,
              requestedDeliveryDate: requestedDate || null,
              couponCode: appliedCoupon?.code,
              paymentDetails: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            });
            qc.invalidateQueries({ queryKey: ["cart"] });
            toast.success(`Order #${res.data.orderId} placed! Check your email 📧`);
            navigate("/orders");
          } catch (err) {
            toast.error(err.response?.data?.message || "Order placement failed");
          } finally {
            setIsPending(false);
          }
        },
        modal: {
          ondismiss: () => { toast.error("Payment cancelled"); setIsPending(false); },
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to initiate payment");
      setIsPending(false);
    }
  };

  const handleSubmit = () => paymentMethod === "cod" ? handleCOD() : handleOnlinePayment();

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
              <textarea rows={3} value={address} onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full delivery address..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 resize-none transition" />
            </div>

            {/* Preferred Delivery Date */}
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-2">
                <FiCalendar className="text-orange-500" size={18} />
                <h3 className="font-extrabold text-gray-800">Preferred Delivery Date</h3>
                <span className="text-xs text-gray-400 font-normal">(optional)</span>
              </div>
              <p className="text-xs text-gray-400 mb-3">Let us know when you'd like your order delivered.</p>
              <input type="date" value={requestedDate} onChange={(e) => setRequestedDate(e.target.value)}
                min={today}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 transition" />
            </div>

            {/* Coupon */}
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
              <h3 className="font-extrabold text-gray-800 mb-4">Apply Coupon</h3>
              {couponOffers.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {couponOffers.slice(0, 4).map((offer) => (
                    <button
                      key={offer.id}
                      onClick={() => handleApplyCoupon(offer.code)}
                      disabled={isApplyingCoupon}
                      className="px-3 py-1.5 rounded-lg border border-orange-200 bg-orange-50 text-orange-600 text-xs font-bold hover:bg-orange-100 disabled:opacity-60"
                    >
                      {offer.code}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 transition"
                />
                <button
                  onClick={() => handleApplyCoupon()}
                  disabled={isApplyingCoupon || !couponCode.trim()}
                  className="px-4 py-3 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 disabled:opacity-60"
                >
                  {isApplyingCoupon ? "Checking..." : "Apply"}
                </button>
              </div>
              {appliedCoupon && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-green-50 border border-green-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-bold text-green-700">{appliedCoupon.code} applied</p>
                    <p className="text-xs text-gray-500">{appliedCoupon.description} on {appliedCoupon.title}</p>
                  </div>
                  <button onClick={removeCoupon} className="text-xs font-bold text-red-500 hover:text-red-600">
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
              <h3 className="font-extrabold text-gray-800 mb-4">Payment Method</h3>
              <div className="flex flex-col gap-3">

                {/* COD */}
                <button onClick={() => setPaymentMethod("cod")}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition text-left ${paymentMethod === "cod" ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-orange-200"}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === "cod" ? "border-orange-500" : "border-gray-300"}`}>
                    {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                  </div>
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">💵</span>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Cash on Delivery</p>
                      <p className="text-xs text-gray-400">Pay when your order arrives at your door</p>
                    </div>
                  </div>
                </button>

                {/* Online — only shown when enabled */}
                {ONLINE_PAYMENT_ENABLED && (
                  <button onClick={() => setPaymentMethod("online")}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition text-left ${paymentMethod === "online" ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-orange-200"}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === "online" ? "border-orange-500" : "border-gray-300"}`}>
                      {paymentMethod === "online" && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                    </div>
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">🔒</span>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">Pay Online</p>
                        <p className="text-xs text-gray-400">UPI · Cards · Netbanking · Wallets via Razorpay</p>
                      </div>
                    </div>
                  </button>
                )}

              </div>
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
            <SummaryCard subtotal={subtotal} deliveryFee={deliveryFee} discount={discount} appliedCoupon={appliedCoupon} total={total}
              address={address} isPending={isPending} onSubmit={handleSubmit} paymentMethod={paymentMethod} />
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 shadow-2xl px-4 py-4 z-40">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">Total</span>
          <span className="text-lg font-extrabold text-orange-500">₹{total.toFixed(2)}</span>
        </div>
        <button onClick={handleSubmit} disabled={isPending || !address.trim()}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60 transition">
          {isPending ? "Processing..." : paymentMethod === "cod" ? "Place Order →" : `Pay ₹${total.toFixed(2)} →`}
        </button>
      </div>
    </div>
  );
}

function SummaryCard({ subtotal, deliveryFee, discount, appliedCoupon, total, address, isPending, onSubmit, paymentMethod }) {
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
        {appliedCoupon && (
          <div className="flex justify-between text-green-600">
            <span>Coupon ({appliedCoupon.code})</span>
            <span className="font-semibold">-₹{discount.toFixed(2)}</span>
          </div>
        )}
        <div className="border-t border-gray-100 pt-3 flex justify-between font-extrabold text-gray-800">
          <span>Total</span>
          <span className="text-orange-500 text-lg">₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Selected payment info */}
      {paymentMethod === "cod" ? (
        <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-4">
          <span className="text-lg">💵</span>
          <div>
            <p className="text-xs font-bold text-green-700">Cash on Delivery</p>
            <p className="text-xs text-gray-400">Pay when order arrives</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">
          <span className="text-lg">🔒</span>
          <div>
            <p className="text-xs font-bold text-blue-700">Secure Payment</p>
            <p className="text-xs text-gray-400">UPI · Cards · Wallets via Razorpay</p>
          </div>
        </div>
      )}

      <button onClick={onSubmit} disabled={isPending || !address.trim()}
        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60 transition">
        {isPending ? "Processing..." : paymentMethod === "cod" ? "Place Order →" : `Pay ₹${total.toFixed(2)} →`}
      </button>
    </div>
  );
}

export default Checkout;
