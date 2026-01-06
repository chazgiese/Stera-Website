'use client';

import clsx from 'clsx';

interface DuotoneToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function DuotoneToggle({ enabled, onToggle }: DuotoneToggleProps) {
  const options = [
    { key: true, label: 'True' },
    { key: false, label: 'False' },
  ];

  return (
    <div className="relative flex items-center bg-zinc-200 dark:bg-zinc-900 rounded-full w-40 p-1">
      {options.map((option) => (
        <button
          key={String(option.key)}
          onClick={() => onToggle(option.key)}
          className={clsx(
            'relative flex-1 p-2 text-xs/4 font-medium rounded-full transition-all',
            'focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900',
            enabled === option.key
              ? 'bg-zinc-800 dark:bg-zinc-300 text-zinc-200 dark:text-zinc-800'
              : 'text-zinc-500 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400'
          )}
          role="radio"
          aria-checked={enabled === option.key}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

