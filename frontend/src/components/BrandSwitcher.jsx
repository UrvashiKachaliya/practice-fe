import React from "react";
import { useBrand } from "../context/BrandContext";

export default function BrandSwitcher() {
  const { mode, toggleMode, BOUTIQUE_ENABLED } = useBrand();

  if (!BOUTIQUE_ENABLED) return null;

  const isKhakhra = mode === "khakhra";

  return (
    <button
      onClick={toggleMode}
      className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition shrink-0"
      title={`Switch to ${isKhakhra ? "Boutique" : "Khakhra"}`}
    >
      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isKhakhra ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm" : "text-gray-400"}`}>
        🌾 Khakhra
      </span>
      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${!isKhakhra ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm" : "text-gray-400"}`}>
        🪡 Boutique
      </span>
    </button>
  );
}
