'use client';

import { IconData } from '@/types/icon';
import IconCard from './IconCard';
import { SquareDashedIcon } from 'stera-icons';

interface IconGridProps {
  icons: IconData[];
  onIconClick: (icon: IconData) => void;
  loading?: boolean;
  selectedVariant?: 'regular' | 'bold' | 'filled' | 'filltone' | 'linetone';
}

export default function IconGrid({ icons, onIconClick, loading = false, selectedVariant = 'regular' }: IconGridProps) {
  if (loading) {
    return (
      <div className="
        grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-8
        gap-4
        pb-8
        min-h-[calc(100vh-264px)]
      ">
        {Array.from({ length: 48 }).map((_, index) => (
          <div
            key={index}
            className="
            bg-zinc-100 dark:bg-zinc-900 rounded-lg p-4 h-24 animate-pulse flex items-center justify-center
          ">
            <div className="h-8 w-8 p-4 bg-zinc-300 dark:bg-zinc-800 rounded-3xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (icons.length === 0) {
    return (
      <div className="text-center py-12 min-h-[calc(100vh-264px)]">
        <div className="text-zinc-400 dark:text-zinc-600 mb-4">
          <SquareDashedIcon variant="bold" className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No icons found
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
          Try adjusting your search term or request an icon by commenting on Figma
        </p>
      <div className="mt-6">
        <button
          type="button"
          className="inline-block px-4 py-2 bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-3xl hover:bg-zinc-700 dark:hover:bg-zinc-300 transition"
          onClick={() => window.open('https://www.figma.com/community/file/1548871823641702097', '_blank', 'noopener,noreferrer')}
        >
          Request an icon
        </button>
      </div>
      </div>
    );
  }

  return (
    <div className="
      grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-8
      gap-4
      pb-8
    ">
      {icons.map((icon) => (
        <IconCard
          key={icon.name}
          icon={icon}
          onIconClick={onIconClick}
          variant={selectedVariant}
        />
      ))}
    </div>
  );
}
