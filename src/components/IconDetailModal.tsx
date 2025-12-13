'use client';

import { useState, useEffect } from 'react';
import { XCircleIcon, CopyIcon, DownloadIcon, CheckCircleIcon } from 'stera-icons';
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
      // Clone the element to avoid modifying the original
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;
      // Capitalize variant (first letter uppercase, rest lowercase)
      const variantLabel = currentVariant.charAt(0).toUpperCase() + currentVariant.slice(1).toLowerCase();
      // Add id attribute with format: {prettyName}-{Variant}
      clonedSvg.setAttribute('id', `${prettyName}-${variantLabel}`);
      return new XMLSerializer().serializeToString(clonedSvg);
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
        className="fixed inset-0 bg-zinc-950/20 dark:bg-zinc-800/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4 overflow-hidden">
        <div className="relative bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-y-scroll">
          {/* Header - Fixed */}
          <div 
            className="flex-shrink-0 sticky top-0 left-0 right-0 z-10 bg-white/10 dark:bg-zinc-950/10 backdrop-blur-sm"
          >
            <div className="flex items-center px-4 py-4 gap-3">
              {/* Close button on left */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors text-zinc-500 dark:text-zinc-400"
              >
                <XCircleIcon variant="filltone" size={16} />
              </button>
              
              {/* Icon name in center */}
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-400 flex-1">
                {prettyName}
              </h2>
              
              {/* Copy/Download buttons on right */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(getSVGData(), 'svg')}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300"
                  title="Copy SVG"
                >
                  {copied === 'svg' ? <CheckCircleIcon variant="filltone" size={16} /> : <CopyIcon variant="linetone" size={16} />}
                </button>
                <button
                  onClick={downloadSVG}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300"
                  title="Download SVG"
                >
                  <DownloadIcon variant="linetone" size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 px-6 pt-4 pb-6">
            <div className="">
              {/* Preview Section - Large icon display */}
              <div className="pb-16">
                <div 
                  id="icon-preview"
                  className="flex items-center justify-center text-zinc-950 dark:text-zinc-200"
                >
                  <DynamicIcon 
                    iconName={icon.name} 
                    variant={currentVariant} 
                    size={64}
                  />
                </div>
              </div>

              {/* Variant Tabs */}
              <div className="flex -mx-6 pb-4 gap-[1px]">
                {AVAILABLE_VARIANTS.map((variantOption) => (
                  <button
                    key={variantOption.key}
                    onClick={() => setCurrentVariant(variantOption.key)}
                    className={`
                      px-4 py-3 text-sm font-medium flex-1 items-center justify-center transition-colors text-zinc-900 dark:text-zinc-400
                      ${
                        currentVariant === variantOption.key
                          ? 'bg-zinc-300 dark:bg-zinc-200 dark:text-zinc-800'
                          : 'bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                      }
                    `}
                  >
                    <span className="whitespace-nowrap">{variantOption.label}</span>
                  </button>
                ))}
              </div>

              {/* Tags */}
              <div  className="mb-6">
                <div className="flex items-center justify-between h-10">
                  <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-400">Tags</h3>
                </div>
                <div className="flex flex-wrap gap-1 py-1">
                  {icon.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-400 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Import */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-400">Import</h3>
                  <button
                    onClick={() => copyToClipboard(importCode, 'import')}
                    className="flex items-center gap-1 px-2 py-2 text-xs text-zinc-400 hover:text-zinc-500 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    {copied === 'import' ? <CheckCircleIcon variant="filltone" size={16} /> : <CopyIcon variant="linetone" size={16} />}
                  </button>
                </div>
                <pre className="py-1 text-sm overflow-x-auto">
                  <code className="text-zinc-800 dark:text-zinc-200">{importCode}</code>
                </pre>
              </div>

              {/* Usage */}
              <div>
                <div className="flex items-center justify-between h-10">
                  <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-400">Usage</h3>
                  <button
                    onClick={() => copyToClipboard(usageCode, 'usage')}
                    className="flex items-center gap-1 px-2 py-2 text-xs text-zinc-400 hover:text-zinc-500 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    {copied === 'usage' ? <CheckCircleIcon variant="filltone" size={16} /> : <CopyIcon variant="linetone" size={16} />}
                  </button>
                </div>
                <pre className="py-1 text-sm overflow-x-auto">
                  <code className="text-zinc-800 dark:text-zinc-200">{usageCode}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
