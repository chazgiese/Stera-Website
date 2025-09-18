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
      className="group relative bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-lg p-4 transition-all duration-200 cursor-pointer"
      onClick={() => onIconClick(icon)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon Display */}
      <div className="flex items-center justify-center h-16">
        <DynamicIcon 
          iconName={icon.name}
          size={32} 
          className="text-zinc-700 dark:text-zinc-300 transition-colors" 
        />
      </div>
    </div>
  );
}
