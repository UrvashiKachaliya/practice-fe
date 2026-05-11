import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getAllProducts, getActiveOffers } from "../helpers/apiRequest";
import { useAuth } from "../context/AuthContext";
import { useBrand } from "../context/BrandContext";
import { FaLeaf, FaTruck, FaAward, FaHeart, FaChevronLeft, FaChevronRight, FaStar, FaQuoteLeft } from "react-icons/fa";
import { FiArrowRight, FiScissors } from "react-icons/fi";
import { GiSewingNeedle, GiDress } from "react-icons/gi";
import { MdDesignServices, MdOutlineLocalLaundryService } from "react-icons/md";

// ── KHAKHRA DATA ──────────────────────────────────────────────
const KHAKHRA_SLIDES = [
  { badge: "🌾 Authentic Gujarati Khakhras", title: "Crispy. Healthy.\nDelivered Fresh.", desc: "Handcrafted with traditional recipes & 100% natural ingredients. Available in 500g to 5kg packs.", emoji: "🌾", from: "#f97316", to: "#f59e0b" },
  { badge: "🚚 Free Delivery on ₹499+", title: "Order More,\nSave More.", desc: "Bulk packs starting from 500g. Perfect for families, gifting & corporate orders.", emoji: "📦", from: "#10b981", to: "#059669" },
  { badge: "❤️ 10,000+ Happy Customers", title: "Taste the\nDifference.", desc: "No preservatives. No artificial flavors. Just pure, crispy goodness in every bite.", emoji: "😋", from: "#8b5cf6", to: "#7c3aed" },
];

const KHAKHRA_FEATURES = [
  { icon: <FaLeaf size={20} />, title: "100% Natural", desc: "No preservatives", color: "bg-green-50 text-green-500" },
  { icon: <FaTruck size={20} />, title: "Free Delivery", desc: "On orders ₹499+", color: "bg-blue-50 text-blue-500" },
  { icon: <FaAward size={20} />, title: "Quality Assured", desc: "Tested every batch", color: "bg-purple-50 text-purple-500" },
  { icon: <FaHeart size={20} />, title: "Handcrafted", desc: "Traditional recipes", color: "bg-red-50 text-red-500" },
];

// ── BOUTIQUE DATA ─────────────────────────────────────────────
const BOUTIQUE_SLIDES = [
  { badge: "✂️ Handcrafted with Love", title: "Where Every Stitch\nTells a Story", desc: "Traditional Gujarati craftsmanship meets modern elegance. Custom stitching for every occasion.", emoji: "🪡", from: "#7c3aed", to: "#a855f7" },
  { badge: "👗 Bridal & Festive Wear", title: "Dressed for Your\nBest Moments", desc: "Lehengas, sarees, salwar suits — stitched to perfection for weddings, festivals & celebrations.", emoji: "👘", from: "#be185d", to: "#ec4899" },
  { badge: "🌸 Gujarati Boutique Culture", title: "Rooted in Tradition,\nStyled for Today", desc: "Authentic embroidery, mirror work & bandhani — bringing Gujarat's textile heritage to your wardrobe.", emoji: "🌺", from: "#b45309", to: "#d97706" },
];

const BOUTIQUE_SERVICES = [
  { icon: <GiDress size={28} />, title: "Custom Stitching", desc: "Salwar suits, lehengas, blouses — stitched to your exact measurements.", color: "bg-purple-50 text-purple-600", border: "border-purple-100" },
  { icon: <FiScissors size={28} />, title: "Alterations & Repairs", desc: "Resize, reshape or restore your favourite outfits with expert precision.", color: "bg-pink-50 text-pink-600", border: "border-pink-100" },
  { icon: <MdDesignServices size={28} />, title: "Design Consultation", desc: "Work with our designer to create your dream outfit from scratch.", color: "bg-amber-50 text-amber-600", border: "border-amber-100" },
  { icon: <GiSewingNeedle size={28} />, title: "Embroidery & Embellishment", desc: "Mirror work, zari, thread embroidery & bandhani — the Gujarati way.", color: "bg-rose-50 text-rose-600", border: "border-rose-100" },
  { icon: <MdOutlineLocalLaundryService size={28} />, title: "Bridal Packages", desc: "Complete bridal trousseau stitching — lehenga to blouse to dupatta.", color: "bg-indigo-50 text-indigo-600", border: "border-indigo-100" },
  { icon: <GiDress size={28} />, title: "Kids & Men's Wear", desc: "Ethnic wear for the whole family — kurtas, sherwanis, frocks & more.", color: "bg-teal-50 text-teal-600", border: "border-teal-100" },
];

const BOUTIQUE_GALLERY = [
  { src: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop", label: "Bridal Lehenga", tag: "Bridal" },
  { src: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=500&fit=crop", label: "Festive Saree", tag: "Festive" },
  { src: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=500&fit=crop", label: "Salwar Suit", tag: "Casual" },
  { src: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e5b?w=400&h=500&fit=crop", label: "Embroidered Blouse", tag: "Embroidery" },
  { src: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&h=500&fit=crop", label: "Anarkali Suit", tag: "Festive" },
  { src: "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=400&h=500&fit=crop", label: "Mirror Work Dupatta", tag: "Embroidery" },
];

const BOUTIQUE_TESTIMONIALS = [
  { name: "Priya Mehta", location: "Ahmedabad", rating: 5, text: "My bridal lehenga was absolutely stunning! The embroidery was so detailed and the fit was perfect.", avatar: "PM", color: "bg-purple-100 text-purple-600" },
  { name: "Kavita Shah", location: "Surat", rating: 5, text: "I've been getting my salwar suits stitched here for 3 years. Quality and attention to detail is unmatched.", avatar: "KS", color: "bg-pink-100 text-pink-600" },
  { name: "Ritu Patel", location: "Vadodara", rating: 5, text: "The mirror work blouse they made for my navratri outfit was breathtaking. Everyone kept asking where I got it!", avatar: "RP", color: "bg-amber-100 text-amber-600" },
];

// ── Shared Slider ─────────────────────────────────────────────
function HeroSlider({ slides, ctaTo, ctaLabel, storyTo }) {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), [slides.length]);
  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden text-white transition-all duration-700"
      style={{ background: `linear-gradient(135deg, ${slide.from}, ${slide.to})` }}>
      <div className="absolute top-[-80px] right-[-80px] w-72 h-72 bg-white/10 rounded-full pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-40px] w-56 h-56 bg-white/10 rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">{slide.badge}</span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 whitespace-pre-line">{slide.title}</h1>
            <p className="text-white/80 text-lg mb-8 max-w-md">{slide.desc}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link to={ctaTo} className="flex items-center gap-2 bg-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/90 shadow-lg transition" style={{ color: slide.from }}>
                {ctaLabel} <FiArrowRight size={16} />
              </Link>
              <Link to={storyTo} className="flex items-center gap-2 border-2 border-white/50 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition">
                Our Story
              </Link>
            </div>
          </div>
          <div className="text-[100px] md:text-[150px] leading-none select-none">{slide.emoji}</div>
        </div>
      </div>

      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition z-20"><FaChevronLeft size={14} /></button>
      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition z-20"><FaChevronRight size={14} /></button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`rounded-full transition-all ${i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"}`} />
        ))}
      </div>
    </section>
  );
}

// ── Offers Slider (khakhra only) ──────────────────────────────
function OffersSlider() {
  const [current, setCurrent] = useState(0);
  const { data: offers = [] } = useQuery({ queryKey: ["offers"], queryFn: () => getActiveOffers().then(r => r.data) });
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
      <div className="relative rounded-3xl overflow-hidden text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg"
        style={{ background: `linear-gradient(135deg, ${offer.bg_from}, ${offer.bg_to})` }}>
        <div className="flex items-center gap-4">
          <span className="text-5xl">{offer.emoji}</span>
          <div>
            {offer.badge && <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-1">{offer.badge}</span>}
            <h3 className="text-xl md:text-2xl font-extrabold">{offer.title}</h3>
            {offer.subtitle && <p className="text-white/80 text-sm mt-0.5">{offer.subtitle}</p>}
          </div>
        </div>
        <Link to="/products" className="shrink-0 bg-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-white/90 shadow transition" style={{ color: offer.bg_from }}>
          Grab the Deal Now
        </Link>
        {offers.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"><FaChevronLeft size={11} /></button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"><FaChevronRight size={11} /></button>
          </>
        )}
      </div>
    </section>
  );
}

// ── KHAKHRA HOME ──────────────────────────────────────────────
function KhakhraHome({ user }) {
  const canAddProduct = user?.role === "seller" || user?.role === "admin";
  const { data, isLoading } = useQuery({ queryKey: ["products"], queryFn: getAllProducts, select: (res) => res.data.products });

  return (
    <div className="min-h-screen bg-amber-50">
      <HeroSlider slides={KHAKHRA_SLIDES} ctaTo="/products" ctaLabel="Shop Now" storyTo="/about" />
      <OffersSlider />

      {/* Features */}
      <section className="bg-white border-y border-orange-100 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {KHAKHRA_FEATURES.map((f, i) => (
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
            <h2 className="text-2xl font-extrabold text-gray-800">Our Khakhras</h2>
            <p className="text-gray-400 text-sm mt-0.5">Fresh batches, crispy every time</p>
          </div>
          {canAddProduct && (
            <Link to="/products/add" className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition">+ Add Product</Link>
          )}
        </div>
        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" /></div>
        ) : !data || data.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-orange-100 hover:border-orange-300 transition overflow-hidden group">
                <div className="relative overflow-hidden">
                  <img src={product.image || "https://placehold.co/300x200?text=🌾"} alt={product.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
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

// ── BOUTIQUE HOME ─────────────────────────────────────────────
function BoutiqueHome() {
  const [activeTag, setActiveTag] = useState("All");
  const tags = ["All", "Bridal", "Festive", "Casual", "Embroidery"];
  const filtered = activeTag === "All" ? BOUTIQUE_GALLERY : BOUTIQUE_GALLERY.filter(g => g.tag === activeTag);

  return (
    <div className="min-h-screen bg-stone-50">
      <HeroSlider slides={BOUTIQUE_SLIDES} ctaTo="/boutique/inquiry" ctaLabel="Book Appointment" storyTo="/about" />

      {/* Brand Bridge */}
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
          <p className="text-gray-400 max-w-xl mx-auto">From everyday wear to bridal masterpieces — we stitch your stories with care.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BOUTIQUE_SERVICES.map((s, i) => (
            <div key={i} className={`bg-white rounded-2xl border ${s.border} shadow-sm p-6 hover:shadow-md transition group`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${s.color} group-hover:scale-110 transition-transform`}>{s.icon}</div>
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
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tags.map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${activeTag === tag ? "bg-purple-600 text-white shadow-md" : "bg-stone-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600"}`}>
                {tag}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map((item, i) => (
              <div key={i} className="relative group overflow-hidden rounded-2xl shadow-sm">
                <img src={item.src} alt={item.label} className="w-full h-64 md:h-72 object-cover group-hover:scale-105 transition-transform duration-500" />
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
            <Link to="/boutique/gallery" className="inline-flex items-center gap-2 border-2 border-purple-200 text-purple-600 px-8 py-3 rounded-xl font-bold text-sm hover:bg-purple-50 transition">
              View Full Gallery <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-purple-100 text-purple-600 text-xs font-bold px-4 py-1.5 rounded-full mb-3">Testimonials</span>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Loved by Our Customers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BOUTIQUE_TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-3xl shadow-sm border border-purple-100 p-7">
                <FaQuoteLeft className="text-purple-200 mb-4" size={28} />
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <FaStar key={j} className="text-amber-400" size={14} />)}
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm ${t.color}`}>{t.avatar}</div>
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
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 rounded-3xl p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-[-60px] right-[-60px] w-64 h-64 bg-white/10 rounded-full" />
          <div className="relative z-10">
            <div className="text-5xl mb-4">🪡</div>
            <h2 className="text-3xl font-extrabold mb-3">Ready to Create Your Dream Outfit?</h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Book a free consultation and let our artisans bring your vision to life.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/boutique/inquiry" className="bg-white text-purple-600 px-8 py-3.5 rounded-xl font-extrabold text-sm hover:bg-purple-50 shadow-xl transition">
                Book Free Consultation →
              </Link>
              <Link to="/contact" className="border-2 border-white/50 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-white/10 transition">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── ROOT COMPONENT — switches based on mode ───────────────────
export default function Home() {
  const { mode } = useBrand();
  const { user } = useAuth();

  return mode === "boutique"
    ? <BoutiqueHome />
    : <KhakhraHome user={user} />;
}
