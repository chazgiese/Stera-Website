'use client';

import { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { IconData } from '@/types/icon';
import SearchBar from '@/components/SearchBar';
import IconStyleSelector from '@/components/IconStyleSelector';
import IconGrid from '@/components/IconGrid';
import IconDetailModal from '@/components/IconDetailModal';
import { AstriskAltIcon, FigmaIcon, GithubIcon, ScribbleIcon, InfoCircleIcon } from 'stera-icons';
import iconData from '@/data/icons.json';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [icons, setIcons] = useState<IconData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWeight, setSelectedWeight] = useState<'regular' | 'bold' | 'fill'>('regular');
  const [isDuotone, setIsDuotone] = useState<boolean>(false);
  const [selectedIcon, setSelectedIcon] = useState<IconData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoMenuOpen, setIsInfoMenuOpen] = useState(false);
  const infoMenuRef = useRef<HTMLDivElement | null>(null);

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

  // Close mobile info menu on outside click / Escape
  useEffect(() => {
    if (!isInfoMenuOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (infoMenuRef.current?.contains(target)) return;
      setIsInfoMenuOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsInfoMenuOpen(false);
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isInfoMenuOpen]);

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

      // All icons are base icons that can have different weights and duotone styles
      // The filtering now works by showing all icons, and the weight/duotone is handled in the display
      const matchesStyle = true; // All icons can be shown

      return matchesSearch && matchesStyle;
    });
  }, [icons, searchTerm]);


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
      <header className="sticky flex justify-between items-center gap-4 md:space-x-0 top-0 z-25 px-3 py-4 md:px-6">
        <Link
          href="/"
          className="inline-flex items-center p-4 gap-2 rounded-full backdrop-blur-sm dark:bg-white/4 bg-black/3 hover:bg-black/5 inset-shadow-stera-light dark:inset-shadow-stera-dark dark:hover:bg-white/8 cursor-default"
        >
          <AstriskAltIcon className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
          <h1 className="text-sm/4 font-medium text-zinc-900 dark:text-zinc-100 hidden md:block">
            Stera
          </h1>
        </Link>
        <div className="flex w-full md:w-sm items-center md:space-x-2">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          <IconStyleSelector
            selectedWeight={selectedWeight}
            isDuotone={isDuotone}
            onWeightChange={setSelectedWeight}
            onDuotoneChange={setIsDuotone}
          />
        </div>
        <div ref={infoMenuRef} className="relative inline-flex md:hidden">
          <button
            type="button"
            aria-label="Open links menu"
            aria-haspopup="menu"
            aria-expanded={isInfoMenuOpen}
            onClick={() => setIsInfoMenuOpen((v) => !v)}
            className="inline-flex items-center p-4 rounded-full backdrop-blur-sm dark:bg-white/4 bg-black/3 hover:bg-black/5 inset-shadow-stera-light dark:inset-shadow-stera-dark"
          >
            <InfoCircleIcon className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
          </button>

          {isInfoMenuOpen && (
            <div
              role="menu"
              aria-label="Links"
              className="absolute right-0 top-full mt-2 backdrop-blur-sm dark:bg-white/4 bg-black/3 rounded-2xl shadow-lg inset-shadow-stera-light dark:inset-shadow-stera-dark overflow-clip"
            >
              <a
                role="menuitem"
                href="https://www.figma.com/community/file/1548871823641702097/stera-icons"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsInfoMenuOpen(false)}
                className="px-4 py-2 text-sm transition-colors flex items-center gap-2 text-zinc-900 dark:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/6 cursor-pointer"
              >
                <FigmaIcon className="w-4 h-4" />
                <span>Figma</span>
              </a>
              <a
                role="menuitem"
                href="https://github.com/chazgiese/Stera-Icons"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsInfoMenuOpen(false)}
                className="px-4 py-2 text-sm transition-colors flex items-center gap-2 text-zinc-900 dark:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/6 cursor-pointer"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          )}
        </div>

        <div className="hidden md:inline-flex items-center p-2 space-x-2 rounded-full backdrop-blur-sm dark:bg-white/4 bg-black/3 inset-shadow-stera-light dark:inset-shadow-stera-dark">
          <a
            href="https://www.figma.com/community/file/1548871823641702097/stera-icons"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm p-2 text-zinc-900 dark:text-zinc-100 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors rounded-full dark:hover:bg-white/8 hover:bg-zinc-200 cursor-default"
          >
            <FigmaIcon className="w-4 h-4" />
          </a>
          <a
            href="https://github.com/chazgiese/Stera-Icons"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm p-2 text-zinc-900 dark:text-zinc-100 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors rounded-full dark:hover:bg-white/8 hover:bg-zinc-200 cursor-default"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        
        {/* Icon Grid */}
        <IconGrid
          icons={filteredIcons}
          onIconClick={handleIconClick}
          loading={loading}
          weight={selectedWeight}
          duotone={isDuotone}
        />
      </main>

      {/* Footer */}
      <footer className="mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-zinc-500 dark:text-zinc-600">
            <p>
              made with <ScribbleIcon weight="fill" className="w-4 h-4 inline-block" />
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
        weight={selectedWeight}
        duotone={isDuotone}
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