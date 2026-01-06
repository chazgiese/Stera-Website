'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CircleIcon } from 'stera-icons';
import clsx from 'clsx';

interface IconStyleSelectorProps {
  selectedWeight: 'regular' | 'bold' | 'fill';
  isDuotone: boolean;
  onWeightChange: (weight: 'regular' | 'bold' | 'fill') => void;
  onDuotoneChange: (duotone: boolean) => void;
}

export default function IconStyleSelector({
  selectedWeight,
  isDuotone,
  onWeightChange,
  onDuotoneChange
}: IconStyleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const weights = [
    { key: 'regular' as const, label: 'Regular' },
    { key: 'bold' as const, label: 'Bold' },
    { key: 'fill' as const, label: 'Fill' },
  ];

  const duotoneOptions = [
    { key: false, label: 'False' },
    { key: true, label: 'True' },
  ];

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

  const handleWeightSelect = (weightKey: 'regular' | 'bold' | 'fill') => {
    onWeightChange(weightKey);
  };

  const handleDuotoneSelect = (duotone: boolean) => {
    onDuotoneChange(duotone);
  };

  return (
    <div className="absolute right-1 top-1" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'flex items-center px-2 py-2 gap-2 text-sm font-medium',
          'bg-zinc-200/60 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-100',
          'border-zinc-300 dark:border-zinc-600 rounded-full',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <CircleIcon 
          weight={selectedWeight}
          duotone={isDuotone}
          className="w-6 h-6"
        />
        <ChevronDownIcon 
          className="w-4 h-4 text-zinc-500 dark:text-zinc-400" 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-[200px] bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-2xl shadow-lg z-50 overflow-clip">
          <div className="py-1">
            {/* Weight Section */}
            <div className="px-3 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Weight
            </div>
            <ul role="listbox">
              {weights.map((weight) => (
                <li key={weight.key} role="option" aria-selected={selectedWeight === weight.key}>
                  <button
                    onClick={() => handleWeightSelect(weight.key)}
                    className={clsx(
                      'w-full text-left px-4 py-2 text-sm transition-colors',
                      selectedWeight === weight.key
                        ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/32'
                    )}
                  >
                    <span>{weight.label}</span>
                  </button>
                </li>
              ))}
            </ul>
            
            {/* Separator */}
            <div className="border-t border-zinc-200 dark:border-zinc-700 my-1" />
            
            {/* Duotone Section */}
            <div className="px-3 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Duotone
            </div>
            <ul role="listbox">
              {duotoneOptions.map((option) => (
                <li key={String(option.key)} role="option" aria-selected={isDuotone === option.key}>
                  <button
                    onClick={() => handleDuotoneSelect(option.key)}
                    className={clsx(
                      'w-full text-left px-4 py-2 text-sm transition-colors',
                      isDuotone === option.key
                        ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                    )}
                  >
                    <span>{option.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

