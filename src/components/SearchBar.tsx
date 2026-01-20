'use client';

import { Search, X } from 'stera-icons/dynamic-variants';
import { useState } from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
}

export default function SearchBar({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search icons" 
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <div className={`relative flex w-full items-center transition-all duration-200 ${
      isFocused ? '' : ''
    }`}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="
          w-full
          h-12
          px-12 py-4
          border-none
          rounded-full backdrop-blur-sm dark:bg-white/4 dark:hover:bg-white/8 bg-black/3 hover:bg-black/5
          inset-shadow-stera-light dark:inset-shadow-stera-dark
          focus:outline-none
          dark:focus:bg-zinc-100/8
          focus:bg-black/5
          transition-all duration-200
          dark:text-zinc-400
          text-sm/4"
      />
      <Search 
        weight="bold"
        className={`absolute left-4 h-4 w-4 transition-colors ${
          isFocused ? 'text-zinc-900 dark:text-zinc-200' : 'text-zinc-700 dark:text-zinc-100'
        }`} 
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          className="
            absolute
            right-1
            p-3
            dark:hover:text-zinc-100 dark:text-zinc-400
            hover:bg-gray-100 dark:hover:bg-zinc-800
            rounded-full
            transition-colors"
          aria-label="Clear search"
        >
          <X weight="bold" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
