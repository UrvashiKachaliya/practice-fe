import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { getAllProducts, getActiveOffers } from "../helpers/apiRequest";
import { useAuth } from "../context/AuthContext";
import { FaLeaf, FaTruck, FaAward, FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

// ── Static hero slides ────────────────────────────────────────
const HERO_SLIDES = [
  {
    badge: "🌾 Authentic Gujarati Khakhras",
    title: "Crispy. Healthy.\nDelivered Fresh.",
    desc: "Handcrafted with traditional recipes & 100% natural ingredients. Available in 500g to 5kg packs.",
    emoji: "🌾",
    from: "#f97316", to: "#f59e0b",
  },
  {
    badge: "🚚 Free Delivery on ₹499+",
    title: "Order More,\nSave More.",
    desc: "Bulk packs starting from 500g. Perfect for families, gifting & corporate orders.",
    emoji: "📦",
    from: "#10b981", to: "#059669",
  },
  {
    badge: "❤️ 10,000+ Happy Customers",
    title: "Taste the\nDifference.",
    desc: "No preservatives. No artificial flavors. Just pure, crispy goodness in every bite.",
    emoji: "",
    from: "#8b5cf6", to: "#7c3aed",
  },
];

const features = [
  { icon: <FaLeaf size={20} />, title: "100% Natural", desc: "No preservatives", color: "bg-green-50 text-green-500" },
  { icon: <FaTruck size={20} />, title: "Free Delivery", desc: "On orders ₹499+", color: "bg-blue-50 text-blue-500" },
  { icon: <FaAward size={20} />, title: "Quality Assured", desc: "Tested every batch", color: "bg-purple-50 text-purple-500" },
  { icon: <FaHeart size={20} />, title: "Handcrafted", desc: "Traditional recipes", color: "bg-red-50 text-red-500" },
];

// ── Hero Slider ───────────────────────────────────────────────
function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent(c => (c + 1) % HERO_SLIDES.length), []);
  const prev = () => setCurrent(c => (c - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  useEffect(() => {
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [next]);

  const slide = HERO_SLIDES[current];

  return (
    <section
      className="relative overflow-hidden text-white transition-all duration-700"
      style={{ background: `linear-gradient(135deg, ${slide.from}, ${slide.to})` }}
    >
      {/* Decorative circles */}
      <div className="absolute top-[-80px] right-[-80px] w-72 h-72 bg-white/10 rounded-full pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-40px] w-56 h-56 bg-white/10 rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 transition-all">
              {slide.badge}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 whitespace-pre-line">
              {slide.title}
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-md">{slide.desc}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link
                to="/products"
                className="flex items-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/90 shadow-lg transition"
                style={{ color: slide.from }}
              >
                Shop Now <FiArrowRight size={16} />
              </Link>
              <Link
                to="/about"
                className="flex items-center gap-2 border-2 border-white/50 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition"
              >
                Our Story
              </Link>
            </div>
          </div>
          <div className="text-[100px] md:text-[150px] leading-none select-none animate-bounce-slow">
            {slide.emoji}
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition z-20">
        <FaChevronLeft size={14} />
      </button>
      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition z-20">
        <FaChevronRight size={14} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"}`}
          />
        ))}
      </div>
    </section>
  );
}

// ── Offers Slider
function OffersSlider() {
  const [current, setCurrent] = useState(0);
  const { data: offers = [] } = useQuery({
    queryKey: ["offers"],
    queryFn: () => getActiveOffers().then(r => r.data),
  });

  const next = useCallback(() => setCurrent(c => (c + 1) % offers.length), [offers.length]);
  const prev = () => setCurrent(c => (c - 1 + offers.length) % offers.length);

  useEffect(() => {
    if (offers.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, offers.length]);

  if (offers.length === 0) return null;

  const offer = offers[current];

  return (
    <section className="max-w-6xl mx-auto px-4 pt-8">
      <div
        className="relative rounded-3xl overflow-hidden text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg"
        style={{ background: `linear-gradient(135deg, ${offer.bg_from}, ${offer.bg_to})` }}
      >
        <div className="flex items-center gap-4">
          <span className="text-5xl">{offer.emoji}</span>
          <div>
            {offer.badge && (
              <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-1">
                {offer.badge}
              </span>
            )}
            <h3 className="text-xl md:text-2xl font-extrabold">{offer.title}</h3>
            {offer.subtitle && <p className="text-white/80 text-sm mt-0.5">{offer.subtitle}</p>}
            {offer.expires_at && (
              <p className="text-white/60 text-xs mt-1">
                ⏰ Expires {new Date(offer.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            )}
          </div>
        </div>
        <Link
          to="/products"
          className="shrink-0 bg-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-white/90 shadow transition whitespace-nowrap"
          style={{ color: offer.bg_from }}
        >
          Grab the Deal Now
        </Link>

        {/* Prev / Next (only if multiple offers) */}
        {offers.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
              <FaChevronLeft size={11} />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
              <FaChevronRight size={11} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {offers.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all ${i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// ── Main Page ─────────────────────────────────────────────────
function Products() {
  const { user } = useAuth();
  const canAddProduct = user?.role === "seller" || user?.role === "admin";
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase().trim() || "";

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    select: (res) => res.data.products,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!searchQuery) return data;
    return data.filter(p =>
      p.title.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery) ||
      p.seller_name?.toLowerCase().includes(searchQuery)
    );
  }, [data, searchQuery]);

  return (
    <div className="min-h-screen bg-amber-50">

      {/* Hero Slider */}
      <HeroSlider />

      {/* Offers Slider */}
      <OffersSlider />

      {/* Features Strip */}
      <section className="bg-white border-y border-orange-100 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${f.color}`}>{f.icon}</div>
              <div>
                <p className="font-bold text-gray-800 text-sm">{f.title}</p>
                <p className="text-xs text-gray-400">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            {searchQuery ? (
              <>
                <h2 className="text-2xl font-extrabold text-gray-800">Search results for "{searchQuery}"</h2>
                <p className="text-gray-400 text-sm mt-0.5">{filtered.length} product{filtered.length !== 1 ? "s" : ""} found</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold text-gray-800">Our Khakhras</h2>
                <p className="text-gray-400 text-sm mt-0.5">Fresh batches, crispy every time</p>
              </>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-gray-500 font-semibold">No products found for "{searchQuery}"</p>
            <p className="text-gray-400 text-sm mt-1">Try a different keyword</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-orange-100 hover:border-orange-300 transition overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image || "https://placehold.co/300x200?text=🌾"}
                    alt={product.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-white text-gray-700 text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <span className="text-xs bg-orange-100 text-orange-500 px-2 py-0.5 rounded-full font-medium">{product.category}</span>
                  <p className="font-bold text-gray-800 text-sm mt-1.5 truncate">{product.title}</p>
                  <p className="text-xs text-gray-400 mb-2">by {product.seller_name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-500 font-extrabold">₹{product.price}</span>
                    <span className="text-xs text-gray-400">from 500g</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div>
            <h3 className="text-2xl font-extrabold mb-1">Bulk Orders Available!</h3>
            <p className="text-orange-100">Special pricing for orders above 5kg. Perfect for gifting & events.</p>
          </div>
          <Link to="/contact" className="shrink-0 bg-white text-orange-500 px-8 py-3 rounded-xl font-bold text-sm hover:bg-orange-50 shadow-lg transition whitespace-nowrap">
            Contact Us →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Products;
