"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({ onSearch }) {
  const [company, setCompany] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!company.trim()) return;

    onSearch(company);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mb-8"
    >
      <div className={`card flex items-center gap-2 p-0 transition-all ${isFocused ? 'ring-2 ring-blue-500' : ''}`}>
        <input
          type="text"
          placeholder="Search company name or ticker (e.g., NVIDIA, AAPL)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent px-4 py-4 outline-none text-white placeholder-slate-400"
        />

        <button
          type="submit"
          className="px-6 py-4 text-blue-400 hover:text-blue-300 transition"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
}