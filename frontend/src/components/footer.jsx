import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin, FiArrowRight } from "react-icons/fi";

const Footer = () => {
  const [email, setEmail] = useState("");

  const currentYear = new Date().getFullYear();

  // const categories = [
  //   "Masala Khakhra", "Methi Khakhra", "Jeera Khakhra",
  //   "Peri Peri Khakhra", "Plain Khakhra", "Multigrain Khakhra",
  // ];

  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "All Products", to: "/products" },
    { label: "About Us", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "My Orders", to: "/orders" },
    { label: "Wishlist", to: "/wishlist" },
  ];

  const socialLinks = [
    { icon: <FaInstagram size={17} />, href: "#", label: "Instagram", color: "hover:bg-pink-500" },
    { icon: <FaFacebookF size={17} />, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
    { icon: <FaTwitter size={17} />, href: "#", label: "Twitter", color: "hover:bg-sky-500" },
    { icon: <FaYoutube size={17} />, href: "#", label: "YouTube", color: "hover:bg-red-500" },
    { icon: <FaWhatsapp size={17} />, href: "#", label: "WhatsApp", color: "hover:bg-green-500" },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="bg-gray-900 text-gray-400">

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-white">
            <span className="text-2xl">🌾</span>
            <p className="font-semibold text-sm">Free delivery on orders above ₹499! Use code <span className="font-extrabold bg-white/20 px-2 py-0.5 rounded-lg">CRISPY10</span> for 10% off</p>
          </div>
          <Link to="/products" className="shrink-0 bg-white text-orange-500 font-bold text-sm px-5 py-2 rounded-full hover:bg-orange-50 transition">
            Shop Now
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🌾</span>
              {/* <span className="text-white text-xl font-extrabold tracking-tight">Khakhra Co.</span> */}
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Bringing you the crispiest, healthiest, and most delicious khakhras made with 100% natural ingredients. Taste tradition in every bite.
            </p>

            {/* Social Icons */}
            <div className="flex gap-2">
              {socialLinks.map(({ icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition ${color}`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Quick Links</h3>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm flex items-center gap-2 hover:text-orange-400 transition group"
                  >
                    <FiArrowRight size={13} className="text-orange-500 opacity-0 group-hover:opacity-100 transition -ml-1" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          {/* <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Our Khakhras</h3>
            <ul className="flex flex-col gap-2.5">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${cat}`}
                    className="text-sm flex items-center gap-2 hover:text-orange-400 transition group"
                  >
                    <FiArrowRight size={13} className="text-orange-500 opacity-0 group-hover:opacity-100 transition -ml-1" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Contact + Newsletter */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Get In Touch</h3>

            <ul className="flex flex-col gap-3 mb-6">
              <li className="flex items-start gap-3 text-sm">
                <FiMapPin size={16} className="text-orange-400 shrink-0 mt-0.5" />
                {/* <span>123 Khakhra Lane, Ahmedabad, Gujarat 380001</span> */}
              </li>
              <li className="flex items-center gap-3 text-sm">
                <FiPhone size={16} className="text-orange-400 shrink-0" />
                {/* <a href="tel:+919876543210" className="hover:text-orange-400 transition">+91 98765 43210</a> */}
              </li>
              <li className="flex items-center gap-3 text-sm">
                <FiMail size={16} className="text-orange-400 shrink-0" />
                {/* <a href="mailto:hello@khakhraco.com" className="hover:text-orange-400 transition">hello@khakhraco.com</a> */}
              </li>
            </ul>

            {/* Newsletter */}
            <h4 className="text-white font-bold text-sm mb-3">Newsletter</h4>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 min-w-0 px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition"
              />
              <button
                type="submit"
                className="shrink-0 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:from-orange-600 hover:to-amber-600 transition"
              >
                Join
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Divider */}
      {/* <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {currentYear} <span className="text-orange-400 font-semibold">Khakhra Co.</span> All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-orange-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-orange-400 transition">Terms of Service</a>
            <a href="#" className="hover:text-orange-400 transition">Sitemap</a>
          </div>
        </div>
      </div> */}

    </footer>
  );
};

export default Footer;
