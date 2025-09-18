'use client';

import { useState, useEffect } from 'react';
import { X, Copy, Check, Download } from 'lucide-react';
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

  const downloadSVG = () => {
    const svgElement = document.querySelector('#icon-preview svg');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
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
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {icon.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {icon.category} • {icon.tags.length} tags
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Icon Preview */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Preview
                  </h3>
                  <div
                    id="icon-preview"
                    className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <DynamicIcon iconName={icon.name} size={iconSize} color={iconColor} />
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Size: {iconSize}px
                    </label>
                    <input
                      type="range"
                      min="16"
                      max="128"
                      value={iconSize}
                      onChange={(e) => setIconSize(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={iconColor}
                        onChange={(e) => setIconColor(e.target.value)}
                        className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={iconColor}
                        onChange={(e) => setIconColor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  <button
                    onClick={downloadSVG}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download SVG
                  </button>
                </div>
              </div>

              {/* Code Examples */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Code Examples
                  </h3>

                  {/* Import */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Import
                      </label>
                      <button
                        onClick={() => copyToClipboard(importCode, 'import')}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                      >
                        {copied === 'import' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied === 'import' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md text-sm overflow-x-auto">
                      <code className="text-gray-800 dark:text-gray-200">{importCode}</code>
                    </pre>
                  </div>

                  {/* Usage */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Usage
                      </label>
                      <button
                        onClick={() => copyToClipboard(usageCode, 'usage')}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                      >
                        {copied === 'usage' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied === 'usage' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md text-sm overflow-x-auto">
                      <code className="text-gray-800 dark:text-gray-200">{usageCode}</code>
                    </pre>
                  </div>

                  {/* Full Component */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Component
                      </label>
                      <button
                        onClick={() => copyToClipboard(jsxCode, 'component')}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                      >
                        {copied === 'component' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied === 'component' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md text-sm overflow-x-auto max-h-40">
                      <code className="text-gray-800 dark:text-gray-200">{jsxCode}</code>
                    </pre>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {icon.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
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
