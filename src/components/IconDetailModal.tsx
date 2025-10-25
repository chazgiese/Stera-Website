'use client';

import { useState, useEffect } from 'react';
import { XIcon, CopyIcon, SaveIcon } from 'stera-icons';
import { CheckIcon } from 'stera-icons';
import { IconData } from '@/types/icon';
import DynamicIcon from './DynamicIcon';

interface IconDetailModalProps {
  icon: IconData | null;
  isOpen: boolean;
  onClose: () => void;
  selectedVariant?: 'regular' | 'bold' | 'filled' | 'filltone' | 'linetone';
}

const AVAILABLE_VARIANTS: Array<{ key: 'regular' | 'bold' | 'filled' | 'filltone' | 'linetone'; label: string }> = [
  { key: 'regular', label: 'Regular' },
  { key: 'bold', label: 'Bold' },
  { key: 'filled', label: 'Filled' },
  { key: 'filltone', label: 'Fill Tone' },
  { key: 'linetone', label: 'Line Tone' }
];

export default function IconDetailModal({ icon, isOpen, onClose, selectedVariant = 'regular' }: IconDetailModalProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [iconSize] = useState(64);
  const [iconColor] = useState('#000000');
  const [currentVariant, setCurrentVariant] = useState<'regular' | 'bold' | 'filled' | 'filltone' | 'linetone'>(selectedVariant);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Update current variant when selectedVariant prop changes
  useEffect(() => {
    setCurrentVariant(selectedVariant);
  }, [selectedVariant]);

  if (!icon || !isOpen) return null;

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Parse the icon name to get component name and variant
  const parseIconInfo = (displayName: string) => {
    // With the new variant system, all icons are base icons
    // The variant is determined by the currentVariant state
    const componentName = displayName.endsWith('Icon') ? displayName : `${displayName}Icon`;
    return { componentName, variant: currentVariant };
  };

  const { componentName, variant } = parseIconInfo(icon.name);
  const prettyName = componentName.endsWith('Icon') ? componentName.slice(0, -4) : componentName;
  const importCode = `import { ${componentName} } from 'stera-icons';`;
  const usageCode = variant === 'regular' 
    ? `<${componentName} size={${iconSize}} />`
    : `<${componentName} variant="${variant}" size={${iconSize}} />`;

  const getSVGData = () => {
    const svgElement = document.querySelector('#icon-preview svg');
    if (svgElement) {
      return new XMLSerializer().serializeToString(svgElement);
    }
    return '';
  };

  const downloadSVG = () => {
    const svgData = getSVGData();
    if (svgData) {
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${icon.name.toLowerCase()}-${currentVariant}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {/* Header - Fixed */}
          <div 
            className="flex-shrink-0 relative z-10 rounded-t-3xl"
            style={{
              background: 'linear-gradient(180deg, rgba(39, 39, 42, 0.95) 0%, rgba(39, 39, 42, 0.90) 18.7%, rgba(39, 39, 42, 0.85) 34.9%, rgba(39, 39, 42, 0.80) 48.8%, rgba(39, 39, 42, 0.75) 60.56%, rgba(39, 39, 42, 0.70) 70.37%, rgba(39, 39, 42, 0.65) 78.4%, rgba(39, 39, 42, 0.60) 84.83%, rgba(39, 39, 42, 0.55) 89.84%, rgba(39, 39, 42, 0.50) 93.6%, rgba(39, 39, 42, 0.45) 96.3%, rgba(39, 39, 42, 0.40) 98.1%, rgba(39, 39, 42, 0.35) 99.2%, rgba(39, 39, 42, 0.30) 99.76%, rgba(39, 39, 42, 0.25) 99.97%, rgba(39, 39, 42, 0.20) 100%)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div className="flex items-center px-6 py-5 gap-3">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {prettyName}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    v{icon.variants?.[currentVariant] || icon.versionAdded}
                  </span>
                </div>
              <button
                onClick={onClose}
                className="p-2 absolute top-4 right-4 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl transition-colors text-zinc-500 dark:text-zinc-400"
              >
                <XIcon variant="bold" className="w-5 h-5" />
              </button>
            </div>

            {/* Variant Tabs */}
            <div className="px-6 pb-4">
              <div className="flex gap-2">
                {AVAILABLE_VARIANTS.map((variantOption) => (
                  <button
                    key={variantOption.key}
                    onClick={() => setCurrentVariant(variantOption.key)}
                    className={`px-4 py-3 text-sm/4 font-semibold rounded-full flex items-center justify-center gap-2 ${
                      currentVariant === variantOption.key
                        ? 'flex-none bg-white dark:bg-white text-zinc-900 dark:text-zinc-950 shadow-sm'
                        : 'flex-1 bg-zinc-700 text-zinc-600 dark:text-white hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <DynamicIcon 
                      iconName={icon.name} 
                      variant={variantOption.key} 
                      size={16}
                    />
                    {currentVariant === variantOption.key && variantOption.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto -mt-32 pt-32 px-6 pb-6">
            <div className="grid grid-cols-1 gap-4">
              {/* Preview Section */}
              <div className="bg-zinc-900 rounded-lg">
                <div className="flex items-center justify-between p-1">
                  <h3 className="text-sm font-medium text-white px-2">Preview</h3>
                  <div className="flex">
                    <button
                      onClick={downloadSVG}
                      className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                      title="Download SVG"
                    >
                      <SaveIcon variant="bold" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(getSVGData(), 'svg')}
                      className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                      title="Copy SVG"
                    >
                      <CopyIcon variant="bold" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div 
                  id="icon-preview"
                  className="flex items-center justify-center pb-9"
                >
                  <DynamicIcon 
                    iconName={icon.name} 
                    variant={currentVariant} 
                    size={64}
                  />
                </div>
              </div>
              {/* Code Examples */}
              <div className="space-y-6">
                <div>
                  {/* Import */}
                  <div className="mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-white">Import</h3>
                      <button
                        onClick={() => copyToClipboard(importCode, 'import')}
                        className="flex items-center gap-1 px-2 py-2 text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                      >
                        {copied === 'import' ? <CheckIcon variant="bold" size={16} /> : <CopyIcon variant="bold" size={16} />}
                      </button>
                    </div>
                    <pre className="p-3 bg-zinc-700 rounded-md text-sm overflow-x-auto">
                      <code className="text-zinc-800 dark:text-zinc-200">{importCode}</code>
                    </pre>
                  </div>

                  {/* Usage */}
                  <div className="mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-white">Usage</h3>
                      <button
                        onClick={() => copyToClipboard(usageCode, 'usage')}
                        className="flex items-center gap-1 px-2 py-2 text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                      >
                        {copied === 'usage' ? <CheckIcon variant="bold" size={16} /> : <CopyIcon variant="bold" size={16} />}
                      </button>
                    </div>
                    <pre className="p-3 bg-zinc-700 rounded-md text-sm overflow-x-auto">
                      <code className="text-zinc-800 dark:text-zinc-200">{usageCode}</code>
                    </pre>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <div className="mb-2">
                    <h3 className="text-sm font-medium text-white">Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {icon.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
