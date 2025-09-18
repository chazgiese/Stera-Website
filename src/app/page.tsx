'use client';

import { useState, useMemo, useEffect } from 'react';
import { IconData } from '@/types/icon';
import SearchBar from '@/components/SearchBar';
import FilterDropdown from '@/components/FilterDropdown';
import IconGrid from '@/components/IconGrid';
import IconDetailModal from '@/components/IconDetailModal';
import { Github, Package, ExternalLink } from 'lucide-react';

export default function Home() {
  const [icons, setIcons] = useState<IconData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedIcon, setSelectedIcon] = useState<IconData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load icons on mount
  useEffect(() => {
    const loadIcons = async () => {
      setLoading(true);
      try {
        const response = await fetch('/data/icons.json');
        if (!response.ok) {
          throw new Error('Failed to fetch icons');
        }
        const iconData = await response.json();
        setIcons(iconData);
      } catch (error) {
        console.error('Failed to load icons:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIcons();
  }, []);

  // Filter icons based on search and style filter
  const filteredIcons = useMemo(() => {
    return icons.filter((icon) => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        icon.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Style filter (All, Regular, Bold, Filled)
      const matchesStyle = selectedFilter === 'All' || 
        (selectedFilter === 'Regular' && icon.style === 'Regular') ||
        (selectedFilter === 'Bold' && icon.style === 'Bold') ||
        (selectedFilter === 'Filled' && icon.style === 'Filled');

      return matchesSearch && matchesStyle;
    });
  }, [icons, searchTerm, selectedFilter]);

  // Calculate counts for each filter
  const iconCounts = useMemo(() => {
    const totalCount = icons.length;
    const regularCount = icons.filter(icon => icon.style === 'Regular').length;
    const boldCount = icons.filter(icon => icon.style === 'Bold').length;
    const filledCount = icons.filter(icon => icon.style === 'Filled').length;
    
    return { totalCount, regularCount, boldCount, filledCount };
  }, [icons]);

  const handleIconClick = (icon: IconData) => {
    setSelectedIcon(icon);
    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedFilter('All');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Stera Icons
                </h1>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {icons.length} icons
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="https://www.npmjs.com/package/stera-icons"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <Package className="w-4 h-4" />
                <span>NPM</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://github.com/chazgiese/Stera-Icons"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Browse & Discover Icons
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Find the perfect icon for your project from our collection of {icons.length}+ icons
            </p>
          </div>
        </div>
        <div className="sticky top-2 z-10 flex gap-4 lg:max-w-2xl m-auto">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            <FilterDropdown
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
              totalCount={iconCounts.totalCount}
              regularCount={iconCounts.regularCount}
              boldCount={iconCounts.boldCount}
              filledCount={iconCounts.filledCount}
            />
          </div>
        {/* Icon Grid */}
        <IconGrid
          icons={filteredIcons}
          onIconClick={handleIconClick}
          loading={loading}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">
              Built with Next.js, TypeScript, and Tailwind CSS
            </p>
            <p>
              Icons from{' '}
              <a
                href="https://www.npmjs.com/package/stera-icons"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                stera-icons
              </a>
              {' '}by{' '}
              <a
                href="https://github.com/chazgiese"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                Chaz Giese
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Icon Detail Modal */}
      <IconDetailModal
        icon={selectedIcon}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
