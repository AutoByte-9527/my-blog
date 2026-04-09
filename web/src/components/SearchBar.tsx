"use client";

import { useState } from "react";
import { useNavigate } from "react-router";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索..."
        className="w-32 md:w-40 px-4 py-2 pl-10 text-sm bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-full focus:outline-none focus:border-[var(--accent)] transition-colors"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
    </form>
  );
}
