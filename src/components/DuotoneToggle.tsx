'use client';

import clsx from 'clsx';
import { SquareBold, CheckSquareFill } from 'stera-icons';

interface DuotoneToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function DuotoneToggle({ enabled, onToggle }: DuotoneToggleProps) {
  return (
    <div className="dark:bg-zinc-950 p-1 rounded-full">
      <button
        onClick={() => onToggle(!enabled)}
        className={clsx(
          'flex items-center gap-2 px-3 py-2 rounded-full transition-all',
          'focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900',
          enabled
            ? 'bg-zinc-800 dark:bg-zinc-800 text-white dark:text-zinc-300'
            : 'text-zinc-300 dark:text-zinc-500 dark:hover:text-zinc-400'
        )}
        role="switch"
        aria-checked={enabled}
        aria-label="Toggle duotone"
      >
        {enabled ? (
          <CheckSquareFill className="w-4 h-4 flex-shrink-0" />
        ) : (
          <SquareBold className="w-4 h-4 flex-shrink-0" />
        )}
        <span className="text-xs font-medium">Duotone</span>
      </button>
    </div>
  );
}
