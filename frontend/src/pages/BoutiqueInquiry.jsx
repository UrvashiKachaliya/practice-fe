import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { FiUser, FiPhone, FiMail, FiCalendar, FiMessageSquare, FiScissors } from "react-icons/fi";
import { GiDress } from "react-icons/gi";

const SERVICES = [
  "Custom Stitching", "Bridal Package", "Alterations & Repairs",
  "Embroidery & Embellishment", "Design Consultation", "Kids & Men's Wear",
];

const inputClass = "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 transition";

export default function BoutiqueInquiry() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", date: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.service) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitted(true);
    toast.success("Appointment request sent! We'll contact you within 24 hours 🪡");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-12 w-full max-w-md text-center">
          <div className="text-6xl mb-5">🎉</div>
          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Request Received!</h2>
          <p className="text-gray-400 mb-2">Thank you, <strong className="text-gray-700">{form.name}</strong>!</p>
          <p className="text-gray-400 text-sm mb-8">We'll reach out to you on <strong className="text-purple-600">{form.phone}</strong> within 24 hours to confirm your appointment.</p>
          <div className="flex flex-col gap-3">
            <Link to="/boutique" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition">
              Back to Boutique
            </Link>
            <Link to="/" className="border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">🪡</div>
          <h1 className="text-4xl font-extrabold mb-2">Book an Appointment</h1>
          <p className="text-purple-100 text-lg">Tell us about your dream outfit and we'll make it happen.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Info Cards */}
          <div className="flex flex-col gap-4">
            {[
              { icon: "📍", title: "Visit Us", desc: "123 Boutique Lane, Ahmedabad, Gujarat 380001" },
              { icon: "📞", title: "Call Us", desc: "+91 98765 43210\nMon–Sat, 10am – 7pm" },
              { icon: "⏱️", title: "Turnaround", desc: "Regular: 7–10 days\nBridal: 3–4 weeks" },
              { icon: "💰", title: "Starting Price", desc: "Blouse from ₹500\nLehenga from ₹3,000" },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5 flex gap-4">
                <span className="text-3xl shrink-0">{c.icon}</span>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{c.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 whitespace-pre-line">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-purple-100 p-8">
            <h2 className="text-xl font-extrabold text-gray-800 mb-1">Inquiry Form</h2>
            <p className="text-gray-400 text-sm mb-7">Fill in the details and we'll get back to you within 24 hours.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your name" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="10-digit number" className={inputClass} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Service Required <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SERVICES.map(s => (
                    <button key={s} type="button" onClick={() => set("service", s)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition text-left ${form.service === s ? "bg-purple-600 text-white border-purple-600 shadow-sm" : "border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 bg-gray-50"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Preferred Date</label>
                <div className="relative">
                  <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="date" value={form.date} onChange={e => set("date", e.target.value)} min={new Date().toISOString().split("T")[0]} className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Additional Details</label>
                <div className="relative">
                  <FiMessageSquare className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                  <textarea rows={4} value={form.message} onChange={e => set("message", e.target.value)}
                    placeholder="Describe your outfit, fabric preferences, occasion, budget..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 resize-none transition"
                  />
                </div>
              </div>

              <button type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-xl font-extrabold text-sm hover:opacity-90 shadow-lg shadow-purple-200 transition flex items-center justify-center gap-2"
              >
                <FiScissors size={16} /> Send Appointment Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
