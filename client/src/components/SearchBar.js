"use client";

import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [company, setCompany] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!company.trim()) return;

    onSearch(company);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-3 mb-8"
    >
      <input
        type="text"
        placeholder="Search company (e.g. NVIDIA)"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="flex-1 p-3 rounded-lg bg-slate-800 text-white"
      />

      <button
        className="px-6 py-3 bg-blue-600 rounded-lg"
      >
        Search
      </button>
    </form>
  );
}