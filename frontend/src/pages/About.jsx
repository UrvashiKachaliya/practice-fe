import React from "react";
import { Link } from "react-router-dom";
import { useBrand } from "../context/BrandContext";
import { FaLeaf, FaHeart, FaTruck, FaAward, FaStar } from "react-icons/fa";
import { FiScissors } from "react-icons/fi";
import { GiSewingNeedle, GiDress } from "react-icons/gi";
import { MdDesignServices } from "react-icons/md";

// ── Khakhra Content ───────────────────────────────────────────
const khakhraFeatures = [
  { icon: <FaLeaf size={26} />, title: "100% Natural", desc: "No preservatives, no artificial flavors — just pure ingredients.", color: "bg-green-50 text-green-500" },
  { icon: <FaHeart size={26} />, title: "Handcrafted", desc: "Traditional recipes passed down through generations.", color: "bg-red-50 text-red-500" },
  { icon: <FaTruck size={26} />, title: "Fast Delivery", desc: "Fresh khakhras at your doorstep within 2–3 days.", color: "bg-blue-50 text-blue-500" },
  { icon: <FaAward size={26} />, title: "Quality Assured", desc: "Every batch tested for taste, crunch & freshness.", color: "bg-orange-50 text-orange-500" },
];

function KhakhraAbout({ theme }) {
  return (
    <div className={`min-h-screen ${theme.bg}`}>
      <div className={`bg-gradient-to-r ${theme.gradientClass} text-white py-16 px-4`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">🌾</div>
          <h1 className="text-4xl font-extrabold mb-3">About Khakhra Co.</h1>
          <p className="text-orange-100 text-lg max-w-2xl mx-auto">
            Bringing the authentic taste of Gujarat to your home, one crispy bite at a time.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className={`bg-white rounded-3xl shadow-sm border ${theme.cardBorder} p-8 md:p-12 mb-8`}>
          <h2 className="text-2xl font-extrabold text-gray-800 mb-4">Our Story</h2>
          <div className="text-gray-600 leading-relaxed space-y-4">
            <p>Founded in 2020, Khakhra Co. started with a simple mission: to share the authentic taste of traditional Gujarati khakhras with food lovers across India. What began as a small home kitchen has grown into a trusted brand serving thousands of happy customers.</p>
            <p>Our khakhras are made using time-tested recipes perfected over generations. We source the finest ingredients directly from local farmers and use traditional methods to ensure every khakhra is crispy, flavorful, and nutritious.</p>
            <p>Today, we offer a wide variety of flavors — from classic methi and masala to innovative fusion varieties — all made with the same love that went into our very first batch.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {khakhraFeatures.map((f, i) => (
            <div key={i} className={`bg-white rounded-2xl shadow-sm border ${theme.cardBorder} p-6 flex gap-4`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${f.color}`}>{f.icon}</div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className={`bg-white rounded-2xl shadow-sm border ${theme.cardBorder} p-8`}>
            <h3 className="text-xl font-extrabold text-gray-800 mb-3">Our Mission</h3>
            <p className="text-gray-600 text-sm leading-relaxed">To preserve and promote traditional Indian snacks by making them accessible to everyone, while supporting local farmers and maintaining the highest quality standards.</p>
          </div>
          <div className={`bg-white rounded-2xl shadow-sm border ${theme.cardBorder} p-8`}>
            <h3 className="text-xl font-extrabold text-gray-800 mb-3">Our Vision</h3>
            <p className="text-gray-600 text-sm leading-relaxed">To become India's most loved khakhra brand, known for authenticity, quality, and innovation, while staying true to our roots and values.</p>
          </div>
        </div>

        <div className={`bg-gradient-to-r ${theme.gradientClass} rounded-3xl shadow-lg p-8 text-center text-white`}>
          <h3 className="text-2xl font-extrabold mb-2">Ready to taste the difference?</h3>
          <p className="text-orange-100 mb-5">Explore our range of handcrafted khakhras</p>
          <Link to="/products" className="inline-block bg-white text-orange-500 px-8 py-3 rounded-xl font-bold text-sm hover:bg-orange-50 shadow-md transition-all">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Boutique Content ──────────────────────────────────────────
const boutiqueFeatures = [
  { icon: <GiDress size={26} />, title: "Custom Stitching", desc: "Every outfit stitched to your exact measurements and style.", color: "bg-purple-50 text-purple-600" },
  { icon: <FiScissors size={26} />, title: "Master Artisans", desc: "20+ years of tailoring expertise in every stitch.", color: "bg-pink-50 text-pink-600" },
  { icon: <GiSewingNeedle size={26} />, title: "Gujarati Heritage", desc: "Authentic mirror work, bandhani & zari embroidery.", color: "bg-amber-50 text-amber-600" },
  { icon: <MdDesignServices size={26} />, title: "Design Consultation", desc: "Free consultation to bring your dream outfit to life.", color: "bg-rose-50 text-rose-600" },
];

const testimonials = [
  { name: "Priya Mehta", location: "Ahmedabad", text: "My bridal lehenga was absolutely stunning! The embroidery was so detailed and the fit was perfect.", avatar: "PM", color: "bg-purple-100 text-purple-600" },
  { name: "Kavita Shah", location: "Surat", text: "I've been getting my salwar suits stitched here for 3 years. Quality and attention to detail is unmatched.", avatar: "KS", color: "bg-pink-100 text-pink-600" },
];

function BoutiqueAbout({ theme }) {
  return (
    <div className={`min-h-screen ${theme.bg}`}>
      <div className={`bg-gradient-to-r ${theme.gradientClass} text-white py-16 px-4`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">🪡</div>
          <h1 className="text-4xl font-extrabold mb-3">About Stitch & Taste</h1>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto">
            Where Gujarati craftsmanship meets modern elegance — handcrafted fashion for every occasion.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className={`bg-white rounded-3xl shadow-sm border ${theme.cardBorder} p-8 md:p-12 mb-8`}>
          <h2 className="text-2xl font-extrabold text-gray-800 mb-4">Our Story</h2>
          <div className="text-gray-600 leading-relaxed space-y-4">
            <p>Stitch & Taste was born from the same family that brought you Khakhra Co. — a family that believes everything worth having should be handcrafted with love. What started as stitching outfits for family and friends has grown into a full boutique serving brides, families, and fashion lovers across Gujarat.</p>
            <p>Our artisans bring 20+ years of tailoring expertise to every outfit. From intricate mirror work to delicate zari embroidery, we preserve the rich textile heritage of Gujarat while creating pieces that feel modern and personal.</p>
            <p>Every outfit we create is a collaboration — between our artisans' skill and your vision. We don't just stitch clothes; we craft memories.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {boutiqueFeatures.map((f, i) => (
            <div key={i} className={`bg-white rounded-2xl shadow-sm border ${theme.cardBorder} p-6 flex gap-4`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${f.color}`}>{f.icon}</div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className={`bg-white rounded-2xl shadow-sm border ${theme.cardBorder} p-8`}>
            <h3 className="text-xl font-extrabold text-gray-800 mb-3">Our Mission</h3>
            <p className="text-gray-600 text-sm leading-relaxed">To preserve Gujarati textile heritage by creating handcrafted outfits that make every woman feel beautiful, confident, and connected to her roots.</p>
          </div>
          <div className={`bg-white rounded-2xl shadow-sm border ${theme.cardBorder} p-8`}>
            <h3 className="text-xl font-extrabold text-gray-800 mb-3">Our Vision</h3>
            <p className="text-gray-600 text-sm leading-relaxed">To become Gujarat's most trusted boutique — where every stitch reflects our commitment to craftsmanship, authenticity, and the joy of wearing something truly made for you.</p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {testimonials.map((t, i) => (
            <div key={i} className={`bg-white rounded-2xl shadow-sm border ${theme.cardBorder} p-6`}>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => <FaStar key={j} className="text-amber-400" size={13} />)}
              </div>
              <p className="text-gray-600 text-sm italic mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${t.color}`}>{t.avatar}</div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`bg-gradient-to-r ${theme.gradientClass} rounded-3xl shadow-lg p-8 text-center text-white`}>
          <h3 className="text-2xl font-extrabold mb-2">Ready to create your dream outfit?</h3>
          <p className="text-purple-100 mb-5">Book a free consultation with our artisans today</p>
          <Link to="/boutique/inquiry" className="inline-block bg-white text-purple-600 px-8 py-3 rounded-xl font-bold text-sm hover:bg-purple-50 shadow-md transition-all">
            Book Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Unified About ─────────────────────────────────────────────
export default function About() {
  const { mode, theme } = useBrand();
  return mode === "boutique"
    ? <BoutiqueAbout theme={theme} />
    : <KhakhraAbout theme={theme} />;
}
