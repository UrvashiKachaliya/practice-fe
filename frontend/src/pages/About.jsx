import React from "react";
import { Link } from "react-router-dom";
import { FaLeaf, FaHeart, FaTruck, FaAward } from "react-icons/fa";

const features = [
  {
    icon: <FaLeaf size={28} />,
    title: "100% Natural",
    desc: "Made with authentic ingredients, no preservatives or artificial flavors",
    color: "bg-green-50 text-green-500",
  },
  {
    icon: <FaHeart size={28} />,
    title: "Handcrafted",
    desc: "Traditional recipes passed down through generations",
    color: "bg-red-50 text-red-500",
  },
  {
    icon: <FaTruck size={28} />,
    title: "Fast Delivery",
    desc: "Fresh khakhras delivered to your doorstep within 2-3 days",
    color: "bg-blue-50 text-blue-500",
  },
  {
    icon: <FaAward size={28} />,
    title: "Quality Assured",
    desc: "Every batch is tested for taste, crunch, and freshness",
    color: "bg-orange-50 text-orange-500",
  },
];

function About() {
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">🌾</div>
          <h1 className="text-4xl font-extrabold mb-3">About Khakhra Co.</h1>
          <p className="text-orange-100 text-lg max-w-2xl mx-auto">
            Bringing the authentic taste of Gujarat to your home, one crispy bite at a time.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-orange-100 p-8 md:p-12 mb-8">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-4">Our Story</h2>
          <div className="text-gray-600 leading-relaxed space-y-4">
            <p>
              Founded in 2020, Khakhra Co. started with a simple mission: to share the authentic taste of traditional Gujarati khakhras with food lovers across Gujarat. What began as a small home kitchen operation has now grown into a trusted brand serving thousands of happy customers.
            </p>
            <p>
              Our khakhras are made using time-tested recipes that have been perfected over generations. We source the finest ingredients directly from local farmers and use traditional methods to ensure every khakhra is crispy, flavorful, and nutritious.
            </p>
            <p>
              Today, we offer a wide variety of flavors — from classic methi and masala to innovative fusion varieties — all made with the same love and care that went into our very first batch.
            </p>
          </div>
        </div>

        {/* Video Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-orange-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-orange-400 to-amber-500 px-8 py-5 flex items-center gap-3">
            <span className="text-2xl">🎬</span>
            <div>
              <h2 className="text-lg font-extrabold text-white">Watch Us Make It</h2>
              <p className="text-orange-100 text-xs">From raw dough to crispy perfection — the traditional way</p>
            </div>
          </div>
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/5GGS7KMbFBQ?autoplay=0&rel=0&modestbranding=1"
              title="How Khakhra is Made"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold text-gray-800 text-sm">Traditional Khakhra Making Process</p>
              <p className="text-gray-400 text-xs mt-0.5">Hand-rolled, slow-roasted on a tawa — just like grandma made it 🌾</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-orange-100 text-orange-500 px-3 py-1 rounded-full font-semibold">🔥 Authentic</span>
              <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-semibold">✅ No Preservatives</span>
            </div>
          </div>
        </div>

        {/* Jain & Diet Friendly Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-7 flex flex-col gap-4">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-3xl shrink-0">🕉️</div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-800 mb-2">100% Jain Friendly</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                All our khakhras are prepared strictly without onion, garlic, or any root vegetables. Made in a dedicated Jain-friendly kitchen following traditional Jain dietary principles — so you can enjoy every bite with complete peace of mind.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-3 py-1 rounded-full font-semibold">✅ No Onion</span>
                <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-3 py-1 rounded-full font-semibold">✅ No Garlic</span>
                <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-3 py-1 rounded-full font-semibold">✅ No Root Vegetables</span>
                <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-3 py-1 rounded-full font-semibold">✅ Pure Vegetarian</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-7 flex flex-col gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl shrink-0">💪</div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-800 mb-2">Perfect Diet Snack</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Low in calories, high in fiber and protein — khakhras are the ideal guilt-free snack for anyone on a diet or fitness journey. Baked not fried, made with whole wheat flour and minimal oil, they keep you full without the extra calories.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs bg-orange-50 text-orange-500 border border-orange-200 px-3 py-1 rounded-full font-semibold">🔥 Low Calorie</span>
                <span className="text-xs bg-orange-50 text-orange-500 border border-orange-200 px-3 py-1 rounded-full font-semibold">🌾 High Fiber</span>
                <span className="text-xs bg-orange-50 text-orange-500 border border-orange-200 px-3 py-1 rounded-full font-semibold">💧 Low Fat</span>
                <span className="text-xs bg-orange-50 text-orange-500 border border-orange-200 px-3 py-1 rounded-full font-semibold">🥗 Diet Friendly</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nutrition Strip */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 mb-8">
          <h3 className="text-sm font-extrabold text-gray-700 uppercase tracking-widest mb-4">Why Khakhra Beats Other Snacks</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Calories", value: "~120 kcal", sub: "per 100g", color: "text-green-500" },
              { label: "Protein", value: "~5g", sub: "per 100g", color: "text-blue-500" },
              { label: "Fat", value: "~3g", sub: "per 100g", color: "text-orange-500" },
              { label: "Fiber", value: "~4g", sub: "per 100g", color: "text-purple-500" },
            ].map((n, i) => (
              <div key={i} className="text-center p-4 bg-gray-50 rounded-2xl">
                <p className={`text-2xl font-extrabold ${n.color}`}>{n.value}</p>
                <p className="text-sm font-bold text-gray-700 mt-0.5">{n.label}</p>
                <p className="text-xs text-gray-400">{n.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 flex gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${f.color}`}>
                {f.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8">
            <h3 className="text-xl font-extrabold text-gray-800 mb-3">Our Mission</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              To preserve and promote traditional Indian snacks by making them accessible to everyone, while supporting local farmers and maintaining the highest quality standards.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8">
            <h3 className="text-xl font-extrabold text-gray-800 mb-3">Our Vision</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              To become India's most loved khakhra brand, known for authenticity, quality, and innovation, while staying true to our roots and values.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl shadow-lg p-8 text-center text-white">
          <h3 className="text-2xl font-extrabold mb-2">Ready to taste the difference?</h3>
          <p className="text-orange-100 mb-5">Explore our range of handcrafted khakhras</p>
          <Link
            to="/products"
            className="inline-block bg-white text-orange-500 px-8 py-3 rounded-xl font-bold text-sm hover:bg-orange-50 shadow-md transition-all"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default About;
