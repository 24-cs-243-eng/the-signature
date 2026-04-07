import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  resultCount?: number;
  query: string;
}

const SearchBar = ({ onSearch, resultCount, query }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // ESC to clear
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSearch("");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSearch]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-2">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search burgers, pizza, fries…"
          className="w-full bg-card border border-border rounded-xl pl-11 pr-10 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
              onClick={() => { onSearch(""); inputRef.current?.focus(); }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Result count chip */}
      <AnimatePresence>
        {query && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-muted-foreground mt-2 pl-1"
          >
            {resultCount === 0
              ? `No results for "${query}" — try something else`
              : `Showing ${resultCount} result${resultCount !== 1 ? "s" : ""} for "${query}"`}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
