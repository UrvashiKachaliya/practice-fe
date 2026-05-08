import React from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen } from "react-icons/fa";

function Orders() {
  const orders = [];

  return (
    <div className="min-h-screen bg-amber-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-500">
            <FaBoxOpen size={18} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-800">My Orders</h2>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-orange-100 p-16 flex flex-col items-center gap-5 text-center">
            <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center">
              <FaBoxOpen size={40} className="text-green-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-1">No orders yet</h3>
              <p className="text-gray-400 text-sm">You haven't placed any orders yet. Start shopping for crispy goodness!</p>
            </div>
            <Link
              to="/products"
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-xl font-bold text-sm hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-200 transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* order items will render here */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
