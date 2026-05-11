import React, { createContext, useContext, useState } from "react";
import { BOUTIQUE_ENABLED } from "../constants/featureFlags";

// ── Theme tokens ──────────────────────────────────────────────
export const THEMES = {
  khakhra: {
    mode: "khakhra",
    name: "Khakhra Co.",
    tagline: "Crispy. Healthy. Delivered Fresh.",
    emoji: "🌾",
    // Tailwind class strings
    bg: "bg-amber-50",
    navBorder: "border-orange-100",
    navActiveTxt: "text-orange-500",
    gradientFrom: "from-orange-400",
    gradientVia: "via-orange-500",
    gradientTo: "to-amber-600",
    gradientClass: "from-orange-400 via-orange-500 to-amber-600",
    btnPrimary: "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-200",
    btnPrimaryTxt: "text-white",
    cardBorder: "border-orange-100",
    badgeBg: "bg-orange-100",
    badgeTxt: "text-orange-500",
    accentTxt: "text-orange-500",
    accentBg: "bg-orange-50",
    ringColor: "focus:ring-orange-400",
    drawerGradient: "from-orange-400 to-amber-500",
    footerBanner: "from-orange-500 to-amber-500",
    // raw hex for inline styles
    hex1: "#f97316",
    hex2: "#f59e0b",
  },
  boutique: {
    mode: "boutique",
    name: "Stitch & Taste",
    tagline: "Where Every Stitch Tells a Story.",
    emoji: "🪡",
    bg: "bg-stone-50",
    navBorder: "border-purple-100",
    navActiveTxt: "text-purple-600",
    gradientFrom: "from-purple-600",
    gradientVia: "via-pink-600",
    gradientTo: "to-rose-500",
    gradientClass: "from-purple-600 via-pink-600 to-rose-500",
    btnPrimary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 shadow-purple-200",
    btnPrimaryTxt: "text-white",
    cardBorder: "border-purple-100",
    badgeBg: "bg-purple-100",
    badgeTxt: "text-purple-600",
    accentTxt: "text-purple-600",
    accentBg: "bg-purple-50",
    ringColor: "focus:ring-purple-400",
    drawerGradient: "from-purple-600 to-pink-600",
    footerBanner: "from-purple-600 to-pink-600",
    hex1: "#9333ea",
    hex2: "#ec4899",
  },
};

const BrandContext = createContext(null);

export const BrandProvider = ({ children }) => {
  const [mode, setMode] = useState("khakhra");

  const toggleMode = () => {
    if (!BOUTIQUE_ENABLED) return;
    setMode(m => m === "khakhra" ? "boutique" : "khakhra");
  };

  const theme = THEMES[mode];

  return (
    <BrandContext.Provider value={{ mode, theme, toggleMode, BOUTIQUE_ENABLED }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => useContext(BrandContext);
