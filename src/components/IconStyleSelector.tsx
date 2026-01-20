'use client';

import { useState, useRef, useEffect } from 'react';
import { CheckCircle, ChevronDown, LayoutGridCircle } from 'stera-icons/dynamic-variants';
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
    <div className="relative hidden md:block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center p-4 space-x-2 rounded-full backdrop-blur-sm dark:bg-white/4 dark:hover:bg-white/8 bg-black/3 hover:bg-black/5 inset-shadow-stera-light dark:inset-shadow-stera-dark"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <LayoutGridCircle 
          weight={selectedWeight}
          duotone={isDuotone}
          className="w-4 h-4"
        />
        <ChevronDown 
          className="w-3 h-3 text-zinc-500 dark:text-zinc-400" 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[200px] backdrop-blur-sm dark:bg-white/4 bg-black/3 rounded-2xl shadow-lg inset-shadow-stera-light dark:inset-shadow-stera-dark z-50 overflow-clip">
          <div className="py-1">
            {/* Weight Section */}
            <div className="px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400">
              Weight
            </div>
            <ul role="listbox">
              {weights.map((weight) => (
                <li key={weight.key} role="option" aria-selected={selectedWeight === weight.key}>
                  <button
                    onClick={() => handleWeightSelect(weight.key)}
                    className={clsx(
                      'w-full px-4 py-2 text-sm transition-colors flex items-center justify-between gap-3 text-zinc-900 dark:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/6',
                      selectedWeight === weight.key && ''
                    )}
                  >
                    <span>{weight.label}</span>
                    <CheckCircle
                      aria-hidden={true}
                      size={16}
                      weight="fill"
                      duotone={false}
                      className={clsx(
                        'shrink-0',
                        selectedWeight === weight.key ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </button>
                </li>
              ))}
            </ul>
            
            {/* Separator */}
            <div className="border-t border-zinc-300 dark:border-zinc-800 my-1" />
            
            {/* Duotone Section */}
            <div className="px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400">
              Duotone
            </div>
            <ul role="listbox">
              {duotoneOptions.map((option) => (
                <li key={String(option.key)} role="option" aria-selected={isDuotone === option.key}>
                  <button
                    onClick={() => handleDuotoneSelect(option.key)}
                    className={clsx(
                      'w-full px-4 py-2 text-sm transition-colors flex items-center justify-between gap-3 text-zinc-900 dark:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/6',
                      isDuotone === option.key && ''
                    )}
                  >
                    <span>{option.label}</span>
                    <CheckCircle
                      aria-hidden={true}
                      size={16}
                      weight="fill"
                      duotone={false}
                      className={clsx(
                        'shrink-0',
                        isDuotone === option.key ? 'opacity-100' : 'opacity-0'
                      )}
                    />
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

