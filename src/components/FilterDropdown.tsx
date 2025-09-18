'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronRegularDown } from 'stera-icons';
import clsx from 'clsx';

interface FilterDropdownProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  totalCount: number;
  outlineCount: number;
  solidCount: number;
}

export default function FilterDropdown({
  selectedFilter,
  onFilterChange,
  totalCount,
  outlineCount,
  solidCount,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filters = [
    { key: 'All', label: 'All', count: totalCount },
    { key: 'Outline', label: 'Regular', count: outlineCount },
    { key: 'Solid', label: 'Fill', count: solidCount },
  ];

  const selectedFilterData = filters.find(filter => filter.key === selectedFilter);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFilterSelect = (filterKey: string) => {
    onFilterChange(filterKey);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'flex items-center justify-center pl-4 pr-4 py-3 gap-2 rounded-3xl focus:bg-zinc-800 focus:outline-none focus:border-transparent transition-all duration-200 bg-white dark:bg-zinc-900 dark:text-white'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedFilterData?.label}</span>
        <ChevronRegularDown 
          className={clsx(
            'w-4 h-4 transition-transform duration-200',
            isOpen && ''
          )} 
        />
      </button>

      {isOpen && (
        <div className="
          absolute
          top-full
          left-0
          mt-1
          w-full
          bg-white dark:bg-zinc-800
          border border-zinc-300 dark:border-zinc-600 rounded-3xl
          shadow-lg
          overflow-hidden
          z-50">
          <ul className="py-1" role="listbox">
            {filters.map((filter) => (
              <li key={filter.key} role="option">
                <button
                  onClick={() => handleFilterSelect(filter.key)}
                  className={clsx(
                    'w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between',
                    selectedFilter === filter.key
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                  )}
                >
                  <span>{filter.label}</span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {filter.count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
