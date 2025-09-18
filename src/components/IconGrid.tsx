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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 24 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 animate-pulse"
          >
            <div className="h-16 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="flex gap-1 justify-center">
              <div className="h-5 w-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="h-5 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4">
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
