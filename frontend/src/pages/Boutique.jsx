import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiScissors } from "react-icons/fi";
import { FaChevronLeft, FaChevronRight, FaStar, FaQuoteLeft } from "react-icons/fa";
import { GiSewingNeedle, GiDress } from "react-icons/gi";
import { MdDesignServices, MdOutlineLocalLaundryService } from "react-icons/md";

// ── Hero Slides ───────────────────────────────────────────────
const SLIDES = [
  {
    badge: "✂️ Handcrafted with Love",
    title: "Where Every Stitch\nTells a Story",
    desc: "Traditional Gujarati craftsmanship meets modern elegance. Custom stitching for every occasion.",
    emoji: "🪡",
    from: "#7c3aed", to: "#a855f7",
  },
  {
    badge: "👗 Bridal & Festive Wear",
    title: "Dressed for Your\nBest Moments",
    desc: "Lehengas, sarees, salwar suits — stitched to perfection for weddings, festivals & celebrations.",
    emoji: "👘",
    from: "#be185d", to: "#ec4899",
  },
  {
    badge: "🌸 Gujarati Boutique Culture",
    title: "Rooted in Tradition,\nStyled for Today",
    desc: "Authentic embroidery, mirror work & bandhani — bringing Gujarat's textile heritage to your wardrobe.",
    emoji: "🌺",
    from: "#b45309", to: "#d97706",
  },
];

// ── Services ──────────────────────────────────────────────────
const SERVICES = [
  {
    icon: <GiDress size={32} />,
    title: "Custom Stitching",
    desc: "Salwar suits, lehengas, blouses & more — stitched to your exact measurements.",
    color: "bg-purple-50 text-purple-600",
    border: "border-purple-100",
  },
  {
    icon: <FiScissors size={32} />,
    title: "Alterations & Repairs",
    desc: "Resize, reshape or restore your favourite outfits with expert precision.",
    color: "bg-pink-50 text-pink-600",
    border: "border-pink-100",
  },
  {
    icon: <MdDesignServices size={32} />,
    title: "Design Consultation",
    desc: "Work with our designer to create your dream outfit from scratch.",
    color: "bg-amber-50 text-amber-600",
    border: "border-amber-100",
  },
  {
    icon: <GiSewingNeedle size={32} />,
    title: "Embroidery & Embellishment",
    desc: "Mirror work, zari, thread embroidery & bandhani — the Gujarati way.",
    color: "bg-rose-50 text-rose-600",
    border: "border-rose-100",
  },
  {
    icon: <MdOutlineLocalLaundryService size={32} />,
    title: "Bridal Packages",
    desc: "Complete bridal trousseau stitching — from lehenga to blouse to dupatta.",
    color: "bg-indigo-50 text-indigo-600",
    border: "border-indigo-100",
  },
  {
    icon: <GiDress size={32} />,
    title: "Kids & Men's Wear",
    desc: "Ethnic wear for the whole family — kurtas, sherwanis, frocks & more.",
    color: "bg-teal-50 text-teal-600",
    border: "border-teal-100",
  },
];

// ── Gallery Items ─────────────────────────────────────────────
const GALLERY = [
  { src: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop", label: "Bridal Lehenga", tag: "Bridal" },
  { src: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=500&fit=crop", label: "Festive Saree", tag: "Festive" },
  { src: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=500&fit=crop", label: "Salwar Suit", tag: "Casual" },
  { src: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e5b?w=400&h=500&fit=crop", label: "Embroidered Blouse", tag: "Embroidery" },
  { src: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&h=500&fit=crop", label: "Anarkali Suit", tag: "Festive" },
  { src: "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=400&h=500&fit=crop", label: "Mirror Work Dupatta", tag: "Embroidery" },
];

// ── Testimonials ──────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Priya Mehta",
    location: "Ahmedabad",
    rating: 5,
    text: "My bridal lehenga was absolutely stunning! The embroidery was so detailed and the fit was perfect. I felt like a queen on my wedding day.",
    avatar: "PM",
    color: "bg-purple-100 text-purple-600",
  },
  {
    name: "Kavita Shah",
    location: "Surat",
    rating: 5,
    text: "I've been getting my salwar suits stitched here for 3 years. The quality and attention to detail is unmatched. Highly recommend!",
    avatar: "KS",
    color: "bg-pink-100 text-pink-600",
  },
  {
    name: "Ritu Patel",
    location: "Vadodara",
    rating: 5,
    text: "The mirror work blouse they made for my navratri outfit was breathtaking. Everyone kept asking where I got it stitched!",
    avatar: "RP",
    color: "bg-amber-100 text-amber-600",
  },
];

// ── Process Steps ─────────────────────────────────────────────
const PROCESS = [
  { step: "01", title: "Book Consultation", desc: "Visit us or book online for a free design consultation." },
  { step: "02", title: "Choose Fabric & Design", desc: "Browse our fabric collection and finalize your design." },
  { step: "03", title: "Measurements", desc: "We take precise measurements for a perfect fit." },
  { step: "04", title: "Crafting", desc: "Our skilled artisans stitch your outfit with care." },
  { step: "05", title: "Fitting & Delivery", desc: "Final fitting and delivery within the promised timeline." },
];

// ── Hero Slider Component ─────────────────────────────────────
function BoutiqueHero() {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent(c => (c + 1) % SLIDES.length), []);
  const prev = () => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <section
      className="relative overflow-hidden text-white min-h-[520px] flex items-center transition-all duration-700"
      style={{ background: `linear-gradient(135deg, ${slide.from}, ${slide.to})` }}
    >
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-white/10 rounded-full pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-60px] w-72 h-72 bg-white/10 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 py-20 relative z-10 w-full">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full mb-5">
              {slide.badge}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5 whitespace-pre-line tracking-tight">
              {slide.title}
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-lg leading-relaxed">{slide.desc}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link to="/boutique/inquiry"
                className="flex items-center gap-2 bg-white font-bold text-sm px-7 py-3.5 rounded-xl hover:bg-white/90 shadow-xl transition"
                style={{ color: slide.from }}
              >
                Book Appointment <FiArrowRight size={16} />
              </Link>
              <Link to="/boutique/gallery"
                className="flex items-center gap-2 border-2 border-white/40 text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-white/10 transition backdrop-blur-sm"
              >
                View Gallery
              </Link>
            </div>
          </div>
          <div className="text-[120px] md:text-[180px] leading-none select-none drop-shadow-2xl">
            {slide.emoji}
          </div>
        </div>
      </div>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition z-20 backdrop-blur-sm">
        <FaChevronLeft size={14} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition z-20 backdrop-blur-sm">
        <FaChevronRight size={14} />
      </button>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? "w-7 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/40"}`}
          />
        ))}
      </div>
    </section>
  );
}

// ── Main Boutique Page ────────────────────────────────────────
export default function Boutique() {
  const [activeTag, setActiveTag] = useState("All");
  const tags = ["All", "Bridal", "Festive", "Casual", "Embroidery"];
  const filtered = activeTag === "All" ? GALLERY : GALLERY.filter(g => g.tag === activeTag);

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Hero */}
      <BoutiqueHero />

      {/* Brand Bridge Banner */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌾</span>
            <div>
              <p className="font-extrabold text-gray-800 text-sm">Khakhra Co. × Stitch & Taste</p>
              <p className="text-xs text-gray-400">Two crafts. One family. Endless love.</p>
            </div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-gray-200" />
          <div className="flex items-center gap-3">
            <span className="text-3xl">🪡</span>
            <div>
              <p className="font-extrabold text-gray-800 text-sm">Handcrafted Fashion</p>
              <p className="text-xs text-gray-400">Just like our khakhras — made with love</p>
            </div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-gray-200" />
          <div className="flex items-center gap-3">
            <span className="text-3xl">✨</span>
            <div>
              <p className="font-extrabold text-gray-800 text-sm">Gujarati Heritage</p>
              <p className="text-xs text-gray-400">Authentic craftsmanship since generations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="inline-block bg-purple-100 text-purple-600 text-xs font-bold px-4 py-1.5 rounded-full mb-3">Our Services</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">Crafted for Every Occasion</h2>
          <p className="text-gray-400 max-w-xl mx-auto">From everyday wear to bridal masterpieces — we stitch your stories with care and precision.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <div key={i} className={`bg-white rounded-2xl border ${s.border} shadow-sm p-6 hover:shadow-md transition group`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${s.color} group-hover:scale-110 transition-transform`}>
                {s.icon}
              </div>
              <h3 className="font-extrabold text-gray-800 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-pink-100 text-pink-600 text-xs font-bold px-4 py-1.5 rounded-full mb-3">Our Work</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">The Boutique Gallery</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Real outfits. Real craftsmanship. Every piece tells a story.</p>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tags.map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${activeTag === tag ? "bg-purple-600 text-white shadow-md" : "bg-stone-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600"}`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map((item, i) => (
              <div key={i} className="relative group overflow-hidden rounded-2xl shadow-sm">
                <img src={item.src} alt={item.label}
                  className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full font-semibold">{item.tag}</span>
                    <p className="text-white font-bold mt-1">{item.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/boutique/gallery"
              className="inline-flex items-center gap-2 border-2 border-purple-200 text-purple-600 px-8 py-3 rounded-xl font-bold text-sm hover:bg-purple-50 transition"
            >
              View Full Gallery <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="inline-block bg-amber-100 text-amber-600 text-xs font-bold px-4 py-1.5 rounded-full mb-3">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">From Dream to Dress</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Our simple 5-step process ensures your outfit is exactly what you envisioned.</p>
        </div>
        <div className="relative">
          <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-purple-200 via-pink-200 to-amber-200" />
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {PROCESS.map((p, i) => (
              <div key={i} className="flex flex-col items-center text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-extrabold text-lg mb-4 shadow-lg shadow-purple-200 z-10">
                  {p.step}
                </div>
                <h3 className="font-extrabold text-gray-800 text-sm mb-1">{p.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-purple-100 text-purple-600 text-xs font-bold px-4 py-1.5 rounded-full mb-3">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">Loved by Our Customers</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Real stories from real women who wore their dreams.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-3xl shadow-sm border border-purple-100 p-7 relative">
                <FaQuoteLeft className="text-purple-200 mb-4" size={28} />
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <FaStar key={j} className="text-amber-400" size={14} />)}
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm ${t.color}`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 rounded-3xl p-10 md:p-14 text-white text-center relative overflow-hidden">
          <div className="absolute top-[-60px] right-[-60px] w-64 h-64 bg-white/10 rounded-full" />
          <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 bg-white/10 rounded-full" />
          <div className="relative z-10">
            <div className="text-5xl mb-4">🪡</div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Ready to Create Your Dream Outfit?</h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Book a free consultation today and let our artisans bring your vision to life.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/boutique/inquiry"
                className="bg-white text-purple-600 px-8 py-3.5 rounded-xl font-extrabold text-sm hover:bg-purple-50 shadow-xl transition"
              >
                Book Free Consultation →
              </Link>
              <Link to="/contact"
                className="border-2 border-white/50 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-white/10 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
