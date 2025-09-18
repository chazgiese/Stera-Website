'use client';

import { useState } from 'react';
import { IconData } from '@/types/icon';
import DynamicIcon from './DynamicIcon';

interface IconCardProps {
  icon: IconData;
  onIconClick: (icon: IconData) => void;
}

export default function IconCard({ icon, onIconClick }: IconCardProps) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const importCode = `import { ${icon.name} } from 'stera-icons';`;
    const usageCode = `<${icon.name} size={24} color="currentColor" />`;
    
    const codeToCopy = `${importCode}\n\n${usageCode}`;
    
    try {
      await navigator.clipboard.writeText(codeToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div
      className="group relative bg-white dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-lg p-4 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-blue-300 dark:hover:border-zinc-600"
      onClick={() => onIconClick(icon)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon Display */}
      <div className="flex items-center justify-center h-16 mb-3">
        <DynamicIcon 
          iconName={icon.name}
          size={32} 
          className="text-gray-700 dark:text-gray-300 transition-colors" 
        />
      </div>

      {/* Icon Name */}
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center mb-2 truncate">
        {icon.name}
      </h3>

      {/* Style and Category Badges */}
      <div className="flex flex-col items-center gap-1 mb-2">
        <div className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
          {icon.style}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {icon.category}
        </div>
      </div>
    </div>
  );
}
