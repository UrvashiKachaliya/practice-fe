import React from "react";
import { Link } from "react-router-dom";
import { FaUserEdit, FaBoxOpen, FaHeart, FaShoppingCart } from "react-icons/fa";
import { FiPhone, FiMapPin, FiMail, FiShield } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { to: "/profile/edit", icon: <FaUserEdit size={22} />, label: "Edit Profile", desc: "Update your personal info", color: "bg-blue-50 text-blue-500" },
  { to: "/orders", icon: <FaBoxOpen size={22} />, label: "My Orders", desc: "Track your deliveries", color: "bg-green-50 text-green-500" },
  { to: "/wishlist", icon: <FaHeart size={22} />, label: "Wishlist", desc: "Your saved items", color: "bg-pink-50 text-pink-500" },
  { to: "/cart", icon: <FaShoppingCart size={22} />, label: "My Cart", desc: "Items ready to order", color: "bg-orange-50 text-orange-500" },
];

function Profile() {
  const { user } = useAuth();

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Cover Banner */}
      <div className="h-40 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-500 relative">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-12">
        {/* Avatar + Name */}
        <div className="relative -mt-10 mb-6 flex items-end justify-between flex-wrap gap-3">
          <div className="flex items-end gap-3">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold shadow-lg border-4 border-white">
              {initials}
            </div>
            <div className="mb-1">
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-800">{user?.name}</h2>
              <span className={`text-xs font-semibold px-3 py-0.5 rounded-full capitalize ${user?.role === "admin" ? "bg-purple-100 text-purple-600" : user?.role === "seller" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"}`}>
                {user?.role}
              </span>
            </div>
          </div>
          <Link to="/profile/edit" className="flex items-center gap-2 bg-white border border-orange-200 text-orange-500 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-50 shadow-sm">
            <FaUserEdit size={14} /> Edit
          </Link>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 mb-5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Account Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-400">
                <FiMail size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-semibold text-gray-700 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-400">
                <FiPhone size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Mobile</p>
                <p className="text-sm font-semibold text-gray-700">{user?.contact || "Not added"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-400">
                <FiMapPin size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Address</p>
                <p className="text-sm font-semibold text-gray-700">{user?.address || "Not added"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-400">
                <FiShield size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Account Type</p>
                <p className="text-sm font-semibold text-gray-700 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Cards */}
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map(({ to, icon, label, desc, color }) => (
            <Link
              key={to}
              to={to}
              className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 hover:shadow-md hover:border-orange-300 transition group"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                {icon}
              </div>
              <p className="font-bold text-gray-800 text-sm group-hover:text-orange-500 transition">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
