'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { IconData } from '@/types/icon';
import SearchBar from '@/components/SearchBar';
import FilterDropdown from '@/components/FilterDropdown';
import IconGrid from '@/components/IconGrid';
import IconDetailModal from '@/components/IconDetailModal';
import { getIconStyle } from '@/utils/iconRegistry';
import { AstriskAlt } from 'stera-icons';
import iconData from '@/data/icons.json';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [icons, setIcons] = useState<IconData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Regular');
  const [selectedIcon, setSelectedIcon] = useState<IconData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load icons on mount
  useEffect(() => {
    setLoading(true);
    try {
      // Use imported data directly for static export
      setIcons(iconData as IconData[]);
    } catch (error) {
      console.error('Failed to load icons:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle URL parameters for icon modal
  useEffect(() => {
    const iconName = searchParams.get('icon');
    if (iconName && icons.length > 0) {
      const icon = icons.find(i => i.name === iconName);
      if (icon) {
        setSelectedIcon(icon);
        setIsModalOpen(true);
      }
    }
  }, [searchParams, icons]);

  // Filter icons based on search and style filter
  const filteredIcons = useMemo(() => {
    return icons.filter((icon) => {
      // Search term filter - handle multi-word queries
      const matchesSearch = searchTerm === '' || (() => {
        const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
        const searchableText = [
          icon.name.toLowerCase(),
          ...icon.tags.map(tag => tag.toLowerCase())
        ].join(' ');
        
        // Check if all search words are found in the combined searchable text
        return searchWords.every(word => searchableText.includes(word));
      })();

      // Determine style from icon name
      const iconStyle = getIconStyle(icon.name);

      // Style filter (All, Regular, Bold, Filled)
      const matchesStyle = selectedFilter === 'All' || 
        (selectedFilter === 'Regular' && iconStyle === 'Regular') ||
        (selectedFilter === 'Bold' && iconStyle === 'Bold') ||
        (selectedFilter === 'Filled' && iconStyle === 'Filled');

      return matchesSearch && matchesStyle;
    });
  }, [icons, searchTerm, selectedFilter]);

  // Calculate counts for each filter
  const iconCounts = useMemo(() => {
    const totalCount = icons.length;
    const regularCount = icons.filter(icon => getIconStyle(icon.name) === 'Regular').length;
    const boldCount = icons.filter(icon => getIconStyle(icon.name) === 'Bold').length;
    const filledCount = icons.filter(icon => getIconStyle(icon.name) === 'Filled').length;
    
    return { totalCount, regularCount, boldCount, filledCount };
  }, [icons]);

  const handleIconClick = (icon: IconData) => {
    setSelectedIcon(icon);
    setIsModalOpen(true);
    // Update URL with icon parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('icon', icon.name);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedIcon(null);
    // Remove icon parameter from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete('icon');
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <header className="lg:fixed top-0 left-0 right-0 z-25 bg-white/60 dark:bg-zinc-950/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-1">
                <AstriskAlt className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Stera
                </h1>
              </Link>
              <a
                href="https://github.com/chazgiese/Stera-Icons/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                v3.2.0
              </a>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="https://www.figma.com/community/file/1548871823641702097/stera-icons"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <span>Figma</span>
              </a>
              <a
                href="https://github.com/chazgiese/Stera-Icons"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Search and Filters */}
        <div className="sticky top-2 z-50 flex gap-4 lg:max-w-lg m-auto">
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
      <footer className="mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-zinc-500 dark:text-zinc-600">
            <p>
              <a
                href="https://www.npmjs.com/package/stera-icons"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-800 dark:text-zinc-200 dark:hover:text-zinc-400 hover:text-zinc-600"
              >
                stera-icons
              </a>
              {' '}by{' '}
              <a
                href="https://github.com/chazgiese"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-800 dark:text-zinc-200 dark:hover:text-zinc-400 hover:text-zinc-600"
              >
                chaz giese
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Icon Detail Modal */}
      <IconDetailModal
        icon={selectedIcon}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500 dark:text-zinc-400">Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}