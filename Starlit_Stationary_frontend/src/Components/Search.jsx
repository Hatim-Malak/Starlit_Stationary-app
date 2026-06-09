import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useDebounce } from '../Hooks/useDebounce.js';

const Search = ({ placeholder = "Search products...", onSearch }) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="relative w-full">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={20} />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-10 py-2.5 bg-warm border-2 border-accent/30 rounded-xl text-primary placeholder-secondary/60 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
      />
      {query && (
        <button type="button" onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors">
          <X size={18} />
        </button>
      )}
    </div>
  );
}

export default Search;