'use client';

import { useState, useEffect } from 'react';
import { XCircle, Copy, Download, CheckCircle } from 'stera-icons';
import { IconData } from '@/types/icon';
import DynamicIcon from './DynamicIcon';
import WeightSelector from './WeightSelector';
import DuotoneToggle from './DuotoneToggle';

interface IconDetailModalProps {
  icon: IconData | null;
  isOpen: boolean;
  onClose: () => void;
  weight?: 'regular' | 'bold' | 'fill';
  duotone?: boolean;
}

export default function IconDetailModal({ icon, isOpen, onClose, weight: initialWeight = 'regular', duotone: initialDuotone = false }: IconDetailModalProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [iconSize] = useState(64);
  const [currentWeight, setCurrentWeight] = useState<'regular' | 'bold' | 'fill'>(initialWeight);
  const [currentDuotone, setCurrentDuotone] = useState<boolean>(initialDuotone);

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

  // Update current weight and duotone when props change
  useEffect(() => {
    setCurrentWeight(initialWeight);
    setCurrentDuotone(initialDuotone);
  }, [initialWeight, initialDuotone]);

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

  // Parse the icon name to get component name
  // In v7.0.0+, component names no longer have the 'Icon' suffix
  const componentName = icon.name;
  const prettyName = componentName;
  const importCode = `import { ${componentName} } from 'stera-icons/${componentName}';`;
  
  // Generate usage code based on weight and duotone
  const getUsageCode = (weight: 'regular' | 'bold' | 'fill', duotone: boolean) => {
    const props: string[] = [];
    
    if (weight !== 'regular') {
      props.push(`weight="${weight}"`);
    }
    
    if (duotone) {
      props.push('duotone');
    }
    
    props.push(`size={${iconSize}}`);
    
    const propsString = props.length > 0 ? ` ${props.join(' ')}` : '';
    return `<${componentName}${propsString} />`;
  };
  
  const usageCode = getUsageCode(currentWeight, currentDuotone);

  const getSVGData = () => {
    const svgElement = document.querySelector('#icon-preview svg');
    if (svgElement) {
      // Clone the element to avoid modifying the original
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;
      // Create label from weight and duotone
      const weightLabel = currentWeight.charAt(0).toUpperCase() + currentWeight.slice(1);
      const variantLabel = currentDuotone ? `${weightLabel}-Duotone` : weightLabel;
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
      const filename = currentDuotone 
        ? `${icon.name.toLowerCase()}-${currentWeight}-duotone.svg`
        : `${icon.name.toLowerCase()}-${currentWeight}.svg`;
      link.href = url;
      link.download = filename;
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
                <XCircle weight="fill" duotone size={16} />
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
                  {copied === 'svg' ? <CheckCircle weight="fill" duotone size={16} /> : <Copy weight="bold" duotone size={16} />}
                </button>
                <button
                  onClick={downloadSVG}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300"
                  title="Download SVG"
                >
                  <Download weight="bold" duotone size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 px-6 pt-4 pb-6">
            <div className="">
              {/* Preview Section - Large icon display */}
              <div className="pb-12">
                <div 
                  id="icon-preview"
                  className="flex items-center justify-center text-zinc-950 dark:text-zinc-200"
                >
                  <DynamicIcon 
                    iconName={icon.name} 
                    weight={currentWeight}
                    duotone={currentDuotone}
                    size={64}
                  />
                </div>
              </div>

              {/* Weight and Duotone Controls */}
              <div className="flex gap-3 pb-4">
                <WeightSelector
                  selectedWeight={currentWeight}
                  onWeightChange={setCurrentWeight}
                />
                <div className="text-zinc-200 dark:text-zinc-900 -mx-8">
                  <svg width="56" height="40" viewBox="0 0 56 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M56 40C49.5735 40 43.8553 36.9684 40.1963 32.2578C32.7264 22.628 23.2921 22.6207 15.8193 32.2363C12.1611 36.9589 6.43608 39.9999 0 40V0C6.4358 9.66972e-05 12.1611 3.04042 15.8193 7.7627C23.2923 17.3791 32.7262 17.3723 40.1963 7.74219C43.8553 3.03164 49.5735 0 56 0V40Z" fill="currentColor"/></svg>
                </div>
                <DuotoneToggle
                  enabled={currentDuotone}
                  onToggle={setCurrentDuotone}
                />
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
                    {copied === 'import' ? <CheckCircle weight="fill" duotone size={16} /> : <Copy weight="bold" duotone size={16} />}
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
                    {copied === 'usage' ? <CheckCircle weight="fill" duotone size={16} /> : <Copy weight="bold" duotone size={16} />}
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
