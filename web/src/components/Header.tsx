"use client";

import { Link } from "react-router";
import { useEffect } from "react";
import { useAppStore } from "@/stores/appStore";
import { getVisitStats } from "@/lib/api";
import SearchBar from "./SearchBar";

export default function Header() {
  const categories = useAppStore((state) => state.categories);
  const totalVisits = useAppStore((state) => state.totalVisits);
  const setTotalVisits = useAppStore((state) => state.setTotalVisits);

  useEffect(() => {
    getVisitStats()
      .then((stats) => setTotalVisits(stats.total))
      .catch(console.error);
  }, [setTotalVisits]);

  return (
    <header className="sticky top-0 z-50 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--foreground)]/10">
      <nav className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Stats */}
          <div className="flex items-center gap-4">
            <Link to="/" className="text-2xl text-[var(--primary)] hover:text-[var(--accent)] transition-colors cursor-pointer">
              墨韵
            </Link>
            <span className="text-sm text-[var(--muted)] hidden sm:inline">浏览 {totalVisits.toLocaleString()}</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors cursor-pointer"
            >
              首页
            </Link>
            <Link
              to="/archives"
              className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors cursor-pointer"
            >
              归档
            </Link>
            {/* Categories Dropdown */}
            <div className="relative group">
              <span className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors cursor-pointer">
                分类
              </span>
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-[var(--background)] border border-[var(--foreground)]/10 rounded-lg shadow-lg py-2 min-w-[120px]">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/categories/${cat.slug}`}
                      className="block px-4 py-2 text-[var(--foreground)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors cursor-pointer"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <SearchBar />
        </div>
      </nav>
    </header>
  );
}
