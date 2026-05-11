import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { FaUserCircle, FaHeart, FaShoppingCart, FaBoxOpen, FaSignOutAlt, FaUserEdit, FaUserShield } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { FiHome, FiInfo, FiPhone } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const profileMenuItems = [
  { to: "/profile", icon: <FaUserCircle size={16} />, label: "My Profile" },
  { to: "/profile/edit", icon: <FaUserEdit size={16} />, label: "Edit Profile" },
  { to: "/orders", icon: <FaBoxOpen size={16} />, label: "My Orders" },
  { to: "/wishlist", icon: <FaHeart size={16} />, label: "Wishlist" },
  { to: "/cart", icon: <FaShoppingCart size={16} />, label: "Cart" },
];

const navLinks = [
  { to: "/", icon: <FiHome size={18} />, label: "Home" },
  { to: "/about", icon: <FiInfo size={18} />, label: "About" },
  { to: "/contact", icon: <FiPhone size={18} />, label: "Contact" },
];

function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState("");
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  // Close mobile drawer on route change
  useEffect(() => { setIsMobile(false); }, [location.pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isMobile ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobile]);

  const handleLogout = () => {
    logout();
    setShowProfile(false);
    setIsMobile(false);
    navigate("/signin");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${search.trim()}`);
      setSearch("");
      setIsMobile(false);
    }
  };

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-orange-100 px-4 md:px-6 py-3 relative z-50">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🌾</span>
            {/* <span className="text-lg font-extrabold text-orange-500 tracking-tight">Khakhra Co.</span> */}
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 gap-2 focus-within:border-orange-400 focus-within:bg-white transition">
            <IoSearchOutline size={17} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              // placeholder="Search khakhras..."
              className="flex-1 outline-none text-sm bg-transparent"
            />
          </form>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-5">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium transition hover:text-orange-500 ${location.pathname === to ? "text-orange-500" : "text-gray-600"}`}
              >
                {label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/wishlist" className={`hover:text-orange-500 transition ${location.pathname === "/wishlist" ? "text-orange-500" : "text-gray-500"}`}>
                  <FaHeart size={19} />
                </Link>
                <Link to="/cart" className={`relative hover:text-orange-500 transition ${location.pathname === "/cart" ? "text-orange-500" : "text-gray-500"}`}>
                  <FaShoppingCart size={19} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center gap-2 hover:text-orange-500 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold">
                      {initials}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{user.name?.split(" ")[0]}</span>
                  </button>

                  {showProfile && (
                    <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[9999] overflow-hidden">
                      <div className="bg-gradient-to-r from-orange-400 to-amber-500 px-4 py-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                          {initials}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-sm text-white truncate">{user.name}</p>
                          <p className="text-xs text-orange-100 truncate">{user.email}</p>
                        </div>
                      </div>
                      <ul className="py-1">
                        {user?.role === "admin" && (
                          <li>
                            <Link
                              to="/admin"
                              onClick={() => setShowProfile(false)}
                              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-purple-50 hover:text-purple-600 ${location.pathname === "/admin" ? "text-purple-600 bg-purple-50" : "text-gray-600"}`}
                            >
                              <span className="text-gray-400"><FaUserShield size={16} /></span> Admin Dashboard
                            </Link>
                          </li>
                        )}
                        {profileMenuItems.map(({ to, icon, label }) => (
                          <li key={to}>
                            <Link
                              to={to}
                              onClick={() => setShowProfile(false)}
                              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-orange-50 hover:text-orange-500 ${location.pathname === to ? "text-orange-500 bg-orange-50" : "text-gray-600"}`}
                            >
                              <span className="text-gray-400">{icon}</span> {label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                        >
                          <FaSignOutAlt size={15} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/signin" className="text-sm font-semibold text-orange-500 border border-orange-400 px-4 py-1.5 rounded-full hover:bg-orange-50 transition">
                  Sign In
                </Link>
                <Link to="/signup" className="text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-1.5 rounded-full hover:from-orange-600 hover:to-amber-600 transition shadow-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Icons */}
          <div className="flex md:hidden items-center gap-3">
            {user && (
              <>
                <Link to="/wishlist" className="text-gray-500 hover:text-orange-500">
                  <FaHeart size={19} />
                </Link>
                <Link to="/cart" className="relative text-gray-500 hover:text-orange-500">
                  <FaShoppingCart size={19} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            <button
              onClick={() => setIsMobile(true)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-orange-50 text-orange-500 hover:bg-orange-100 transition"
            >
              <GiHamburgerMenu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-[998] md:hidden"
          onClick={() => setIsMobile(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`fixed top-0 right-0 h-full w-[300px] bg-white z-[999] md:hidden flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${isMobile ? "translate-x-0" : "translate-x-full"}`}>

        {/* Drawer Header */}
        <div className="bg-gradient-to-r from-orange-400 to-amber-500 px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            {/* <span className="text-white font-extrabold text-lg">Khakhra Co.</span> */}
          </div>
          <button
            onClick={() => setIsMobile(false)}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition"
          >
            <IoClose size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">

          {/* User Info (if logged in) */}
          {user && (
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-base shrink-0">
                {initials}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-gray-800 truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize mt-0.5 inline-block ${user.role === "admin" ? "bg-purple-100 text-purple-600" : user.role === "seller" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"}`}>
                  {user.role}
                </span>
              </div>
            </div>
          )}

          {/* Mobile Search */}
          <div className="px-5 py-3 border-b border-gray-100">
            <form onSubmit={handleSearch} className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 gap-2 focus-within:border-orange-400 transition">
              <IoSearchOutline size={17} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                // placeholder="Search khakhras..."
                className="flex-1 outline-none text-sm bg-transparent"
              />
            </form>
          </div>

          {/* Nav Links */}
          <div className="px-3 py-3 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Menu</p>
            {navLinks.map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition mb-0.5 ${location.pathname === to ? "bg-orange-50 text-orange-500" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <span className={location.pathname === to ? "text-orange-500" : "text-gray-400"}>{icon}</span>
                {label}
              </Link>
            ))}
          </div>

          {/* Profile Links (if logged in) */}
          {user && (
            <div className="px-3 py-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Account</p>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition mb-0.5 ${location.pathname === "/admin" ? "bg-purple-50 text-purple-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <span className={location.pathname === "/admin" ? "text-purple-600" : "text-gray-400"}><FaUserShield size={16} /></span>
                  Admin Dashboard
                </Link>
              )}
              {profileMenuItems.map(({ to, icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition mb-0.5 ${location.pathname === to ? "bg-orange-50 text-orange-500" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <span className={location.pathname === to ? "text-orange-500" : "text-gray-400"}>{icon}</span>
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="shrink-0 px-5 py-4 border-t border-gray-100">
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-50 text-red-500 font-semibold text-sm hover:bg-red-100 transition"
            >
              <FaSignOutAlt size={15} /> Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/signup"
                className="block text-center py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm hover:from-orange-600 hover:to-amber-600 transition shadow-sm"
              >
                Create Account
              </Link>
              <Link
                to="/signin"
                className="block text-center py-3 rounded-xl border border-orange-400 text-orange-500 font-bold text-sm hover:bg-orange-50 transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
