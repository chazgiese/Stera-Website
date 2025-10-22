'use client';

import { IconData } from '@/types/icon';
import DynamicIcon from './DynamicIcon';

interface IconCardProps {
  icon: IconData;
  onIconClick: (icon: IconData) => void;
  variant?: 'regular' | 'bold' | 'filled' | 'filltone' | 'linetone';
}

export default function IconCard({ icon, onIconClick, variant = 'regular' }: IconCardProps) {

  return (
    <div
      className="group relative bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-lg p-4 transition-all duration-200 cursor-pointer"
      onClick={() => onIconClick(icon)}
    >
      {/* Icon Display */}
      <div className="flex items-center justify-center h-16">
        <DynamicIcon 
          iconName={icon.name}
          variant={variant}
          size={32} 
          className="text-zinc-700 dark:text-zinc-300 transition-colors" 
        />
      </div>
    </div>
  );
}
