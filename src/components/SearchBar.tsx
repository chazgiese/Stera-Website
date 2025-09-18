'use client';

import { Search, X } from 'stera-icons';
import { useState } from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
}

export default function SearchBar({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search icons by name or tags..." 
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <div className="relative w-full mx-auto pb-8">
      <div className={`relative flex items-center transition-all duration-200 ${
        isFocused ? '' : ''
      }`}>
        <Search 
          className={`absolute left-4 h-4 w-4 transition-colors ${
            isFocused ? 'text-zinc-600 dark:text-zinc-200' : 'text-zinc-100 dark:text-zinc-400'
          }`} 
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="
            w-full
            h-[48px]
            pl-10 pr-10 py-3
            border border-zinc-300 dark:border-zinc-800 rounded-3xl
            bg-white dark:bg-zinc-900
            focus:outline-none
            dark:focus:bg-zinc-900
            focus:border-zinc-700
            transition-all duration-200
            dark:text-white"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="
              absolute
              right-3
              p-2
              dark:hover:text-zinc-100 dark:text-zinc-400
              hover:bg-gray-100 dark:hover:bg-zinc-700
              rounded-full
              transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
