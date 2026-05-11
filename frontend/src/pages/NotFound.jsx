import React from "react";
import { Link, useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
      <div className="text-center">
        <div className="text-8xl mb-4">🌾</div>
        <h1 className="text-7xl font-extrabold text-orange-400 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Page not found</h2>
        <p className="text-gray-400 text-sm mb-8">
          Looks like this page crumbled away. Let's get you back on track!
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 border border-orange-300 text-orange-500 rounded-xl font-semibold text-sm hover:bg-orange-50 transition"
          >
            ← Go Back
          </button>
          <Link
            to="/"
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold text-sm hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-200 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
