import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { IoSearchOutline } from "react-icons/io5";

export default function SearchBar({ onSearch, className = "" }) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const wrapperRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getSuggestions = (query) => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    // Read from React Query cache — no extra API call
    const cached = qc.getQueryData(["products"]);
    const products = cached?.data?.products || [];
    const matches = products.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    ).slice(0, 6);
    return matches;
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    const s = getSuggestions(val);
    setSuggestions(s);
    setShowSuggestions(val.trim().length > 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    setShowSuggestions(false);
    if (onSearch) onSearch();
    navigate(`/?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  const handleSelect = (product) => {
    setShowSuggestions(false);
    setSearch("");
    if (onSearch) onSearch();
    navigate(`/products/${product.id}`);
  };

  const handleSuggestionSearch = (text) => {
    setShowSuggestions(false);
    setSearch("");
    if (onSearch) onSearch();
    navigate(`/?search=${encodeURIComponent(text)}`);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 gap-2 focus-within:border-orange-400 focus-within:bg-white transition">
        <IoSearchOutline size={17} className="text-gray-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={handleChange}
          onFocus={() => search.trim() && setShowSuggestions(true)}
          placeholder="Search khakhras..."
          className="flex-1 outline-none text-sm bg-transparent"
        />
        {search && (
          <button type="button" onClick={() => { setSearch(""); setSuggestions([]); setShowSuggestions(false); }}
            className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[9999] overflow-hidden">
          {suggestions.map((p) => (
            <button key={p.id} onClick={() => handleSelect(p)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition text-left">
              <img src={p.image || "https://placehold.co/40x40?text=🌾"} alt={p.title}
                className="w-9 h-9 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{p.title}</p>
                <p className="text-xs text-gray-400">{p.category}</p>
              </div>
              <span className="text-xs font-bold text-orange-500 shrink-0">₹{p.price}</span>
            </button>
          ))}
          {/* Search all results */}
          <button onClick={() => handleSuggestionSearch(search)}
            className="w-full flex items-center gap-2 px-4 py-3 bg-orange-50 hover:bg-orange-100 transition text-left border-t border-orange-100">
            <IoSearchOutline size={15} className="text-orange-500" />
            <span className="text-sm font-semibold text-orange-500">Search all results for "{search}"</span>
          </button>
        </div>
      )}

      {/* No results */}
      {showSuggestions && search.trim() && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[9999] px-4 py-3">
          <p className="text-sm text-gray-400">No products found for "{search}"</p>
        </div>
      )}
    </div>
  );
}
