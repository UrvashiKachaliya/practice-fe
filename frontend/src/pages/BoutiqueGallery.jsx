import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

const GALLERY = [
  { src: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=750&fit=crop", label: "Bridal Lehenga", tag: "Bridal", desc: "Heavy embroidered bridal lehenga with mirror work" },
  { src: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=750&fit=crop", label: "Festive Saree", tag: "Festive", desc: "Silk saree with zari border for festive occasions" },
  { src: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&h=750&fit=crop", label: "Salwar Suit", tag: "Casual", desc: "Comfortable cotton salwar suit for daily wear" },
  { src: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e5b?w=600&h=750&fit=crop", label: "Embroidered Blouse", tag: "Embroidery", desc: "Hand-embroidered blouse with traditional motifs" },
  { src: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&h=750&fit=crop", label: "Anarkali Suit", tag: "Festive", desc: "Floor-length anarkali with intricate embroidery" },
  { src: "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=600&h=750&fit=crop", label: "Mirror Work Dupatta", tag: "Embroidery", desc: "Traditional Gujarati mirror work dupatta" },
  { src: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=750&fit=crop&q=80&sat=-20", label: "Chaniya Choli", tag: "Bridal", desc: "Navratri special chaniya choli with garba embroidery" },
  { src: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=750&fit=crop&q=80&sat=20", label: "Bandhani Saree", tag: "Festive", desc: "Authentic Gujarati bandhani tie-dye saree" },
  { src: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&h=750&fit=crop&q=80&hue=30", label: "Kurti Set", tag: "Casual", desc: "Printed kurti with palazzo pants" },
];

const TAGS = ["All", "Bridal", "Festive", "Casual", "Embroidery"];

export default function BoutiqueGallery() {
  const [activeTag, setActiveTag] = useState("All");
  const [lightbox, setLightbox] = useState(null);

  const filtered = activeTag === "All" ? GALLERY : GALLERY.filter(g => g.tag === activeTag);

  const openLightbox = (i) => setLightbox(i);
  const closeLightbox = () => setLightbox(null);
  const prevImg = () => setLightbox(i => (i - 1 + filtered.length) % filtered.length);
  const nextImg = () => setLightbox(i => (i + 1) % filtered.length);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4">Our Portfolio</span>
          <h1 className="text-4xl font-extrabold mb-3">The Boutique Gallery</h1>
          <p className="text-purple-100 text-lg max-w-xl mx-auto">Every outfit is a masterpiece. Browse our collection of handcrafted creations.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TAGS.map(tag => (
            <button key={tag} onClick={() => setActiveTag(tag)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${activeTag === tag ? "bg-purple-600 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600"}`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((item, i) => (
            <div key={i} className="relative group overflow-hidden rounded-2xl shadow-sm cursor-pointer" onClick={() => openLightbox(i)}>
              <img src={item.src} alt={item.label} className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full font-semibold">{item.tag}</span>
                  <p className="text-white font-bold mt-1">{item.label}</p>
                  <p className="text-white/70 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white text-center">
          <h3 className="text-2xl font-extrabold mb-2">Love what you see?</h3>
          <p className="text-purple-100 mb-5">Book a consultation and let us create something special for you.</p>
          <Link to="/boutique/inquiry" className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-3 rounded-xl font-extrabold text-sm hover:bg-purple-50 shadow-lg transition">
            Book Appointment <FiArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center px-4" onClick={closeLightbox}>
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <img src={filtered[lightbox].src} alt={filtered[lightbox].label} className="w-full max-h-[80vh] object-contain rounded-2xl" />
            <div className="mt-3 text-center">
              <p className="text-white font-bold">{filtered[lightbox].label}</p>
              <p className="text-white/60 text-sm">{filtered[lightbox].desc}</p>
            </div>
            <button onClick={closeLightbox} className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition shadow-lg">
              <IoClose size={20} />
            </button>
            <button onClick={prevImg} className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition shadow-lg">
              <FaChevronLeft size={14} />
            </button>
            <button onClick={nextImg} className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition shadow-lg">
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
