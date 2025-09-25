'use client';

import { useState, useEffect } from 'react';
import { XBold, CopyBold, CheckBold, SaveBold } from 'stera-icons';
import { IconData } from '@/types/icon';
import DynamicIcon from './DynamicIcon';

interface IconDetailModalProps {
  icon: IconData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function IconDetailModal({ icon, isOpen, onClose }: IconDetailModalProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [iconSize, setIconSize] = useState(64);
  const [iconColor, setIconColor] = useState('#000000');

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

  const importCode = `import { ${icon.name} } from 'stera-icons';`;
  const usageCode = `<${icon.name} size={${iconSize}} color="${iconColor}" />`;
  const jsxCode = `import React from 'react';\nimport { ${icon.name} } from 'stera-icons';\n\nexport default function MyComponent() {\n  return (\n    <div>\n      <${icon.name} size={${iconSize}} color="${iconColor}" />\n    </div>\n  );\n}`;

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
      link.download = `${icon.name.toLowerCase()}.svg`;
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
        <div className="relative bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-zinc-200 dark:border-zinc-800">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-700 gap-4">
            <div
                id="icon-preview"
                className="flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-lg w-fit p-3"
              >
                <DynamicIcon iconName={icon.name} size={32} color={iconColor} />
            </div>
            <div className="w-full">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {icon.name}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {icon.category} • {icon.tags.length} tags
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500 dark:text-zinc-400"
            >
              <XBold className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex gap-3">
                {/* Download SVG Button */}
                <button
                  onClick={downloadSVG}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm font-medium w-full"
                >
                  <SaveBold className="w-4 h-4" />
                  Download SVG
                </button>
                {/* Copy SVG Button */}
                <button
                  onClick={() => copyToClipboard(getSVGData(), 'svg')}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm font-medium w-full"
                >
                  <CopyBold className="w-4 h-4" />
                  {copied === 'svg' ? 'Copied!' : 'Copy SVG'}
                </button>
              </div>
              {/* Code Examples */}
              <div className="space-y-6">
                <div>

                  {/* Import */}
                  <div className="mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    <div className="flex items-center border-b border-zinc-200 dark:border-zinc-900 justify-between mb-2 p-3">
                      <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                        Import
                      </label>
                      <button
                        onClick={() => copyToClipboard(importCode, 'import')}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-full transition-colors"
                      >
                        {copied === 'import' ? <CheckBold className="w-3 h-3" /> : <CopyBold className="w-3 h-3" />}
                        {copied === 'import' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="p-3 rounded-md text-sm overflow-x-auto">
                      <code className="text-zinc-800 dark:text-zinc-200">{importCode}</code>
                    </pre>
                  </div>

                  {/* Usage */}
                  <div className="mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    <div className="flex items-center border-b border-zinc-200 dark:border-zinc-900 justify-between mb-2 p-3">
                      <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                        Usage
                      </label>
                      <button
                        onClick={() => copyToClipboard(usageCode, 'usage')}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-full transition-colors"
                      >
                        {copied === 'usage' ? <CheckmarkBold className="w-3 h-3" /> : <CopyBold className="w-3 h-3" />}
                        {copied === 'usage' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="p-3 text-sm overflow-x-auto">
                      <code className="text-zinc-800 dark:text-zinc-200">{usageCode}</code>
                    </pre>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <div className="flex flex-wrap gap-2">
                    {icon.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 text-xs rounded-full"
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
