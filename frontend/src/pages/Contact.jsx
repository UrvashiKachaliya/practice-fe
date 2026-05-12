import React, { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from "react-icons/fi";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { toast } from "sonner";

const faqs = [
  {
    q: "What is the shelf life of your khakhras?",
    a: "Our khakhras stay fresh for up to 30 days when stored in an airtight container at room temperature.",
  },
  {
    q: "Do you offer bulk orders?",
    a: "Yes! We offer special pricing for bulk orders above 5 kg. Contact us directly for a custom quote.",
  },
  {
    q: "Are your products gluten-free?",
    a: "Most of our khakhras are made with wheat flour. We do offer a few gluten-free variants — check the product description for details.",
  },
  {
    q: "How long does delivery take?",
    a: "During Jain festivals and peak seasonal rush, order preparation and delivery may take a little extra time as we prepare everything fresh with care.",
  },
];

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Message sent! We'll get back to you within 24 hours 🌾");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-600 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-3"></div>
          <h1 className="text-4xl font-extrabold mb-2">Get in Touch</h1>
          <p className="text-orange-100 text-lg">We'd love to hear from you. We're here to help!</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            {[
              { icon: <FiMail size={20} />, label: "Email", value: "hello@khakhraco.in", color: "bg-orange-50 text-orange-500" },
              { icon: <FiPhone size={20} />, label: "Phone", value: "+91 98765 43210", color: "bg-blue-50 text-blue-500" },
              { icon: <FaWhatsapp size={20} />, label: "WhatsApp", value: "+91 98765 43210", color: "bg-green-50 text-green-500" },
              { icon: <FiMapPin size={20} />, label: "Address", value: "Ahmedabad, Gujarat, India", color: "bg-purple-50 text-purple-500" },
              { icon: <FiClock size={20} />, label: "Hours", value: "Mon–Sat, 9am – 6pm", color: "bg-amber-50 text-amber-500" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-700">{item.value}</p>
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4">
              <p className="text-xs text-gray-400 font-medium mb-3">Follow Us</p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="flex items-center gap-2 bg-pink-50 text-pink-500 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-pink-100 transition"
                >
                  <FaInstagram size={16} /> Instagram
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 bg-green-50 text-green-500 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-100 transition"
                >
                  <FaWhatsapp size={16} /> WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-orange-100 p-7">
            <h2 className="text-xl font-extrabold text-gray-800 mb-1">Send us a message</h2>
            <p className="text-gray-400 text-sm mb-6">We'll get back to you within 24 hours</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email <span className="text-red-400">*</span></label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message <span className="text-red-400">*</span></label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us more..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-bold text-sm hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-200 transition-all"
              >
                <FiSend size={15} /> Send Message
              </button>
            </form>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-3xl shadow-sm border border-orange-100 p-7">
          <h2 className="text-xl font-extrabold text-gray-800 mb-5">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-orange-50 transition"
                >
                  <span className="font-semibold text-gray-800 text-sm">{faq.q}</span>
                  <span className={`text-orange-500 font-bold text-lg transition-transform ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
