'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from 'stera-icons';
import clsx from 'clsx';

interface FilterDropdownProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function FilterDropdown({
  selectedFilter,
  onFilterChange,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filters = [
    { key: 'Regular', label: 'Regular' },
    { key: 'Bold', label: 'Bold' },
    { key: 'Filled', label: 'Filled' },
    { key: 'Filltone', label: 'Filltone' },
    { key: 'Linetone', label: 'Linetone' },
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
    <div className="absolute right-1 top-1" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'flex items-center pl-4 pr-4 py-2 gap-2 rounded-3xl focus:bg-zinc-800 focus:outline-none focus:border-transparent transition-all duration-200 bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-400'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedFilterData?.label}</span>
        <ChevronDownIcon 
          className={clsx(
            'w-4 h-4 transition-transform duration-200'
          )} 
        />
      </button>

      {isOpen && (
        <div className="
          absolute
          top-full
          right-0
          mt-1
          w-[160px]
          bg-white dark:bg-zinc-950
          border border-zinc-300 dark:border-zinc-800 rounded-2xl
          shadow-lg
          overflow-hidden
          z-50">
          <ul className="py-1" role="listbox">
            {filters.map((filter) => (
              <li key={filter.key} role="option" aria-selected={selectedFilter === filter.key}>
                <button
                  onClick={() => handleFilterSelect(filter.key)}
                  className={clsx(
                    'w-full text-left px-4 py-2 text-sm transition-colors',
                    selectedFilter === filter.key
                      ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  )}
                >
                  <span>{filter.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
