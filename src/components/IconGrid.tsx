'use client';

import { IconData } from '@/types/icon';
import IconCard from './IconCard';

interface IconGridProps {
  icons: IconData[];
  onIconClick: (icon: IconData) => void;
  loading?: boolean;
}

export default function IconGrid({ icons, onIconClick, loading = false }: IconGridProps) {
  if (loading) {
    return (
      <div className="
        grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-8
        gap-4
        pb-8
      ">
        {Array.from({ length: 24 }).map((_, index) => (
          <div
            key={index}
            className="
            bg-white dark:bg-zinc-900 rounded-lg p-4 h-24 animate-pulse flex items-center justify-center
          ">
            <div className="h-8 w-8 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-3xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (icons.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-600 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No icons found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Try adjusting your search terms or filters
        </p>
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
        />
      ))}
    </div>
  );
}
