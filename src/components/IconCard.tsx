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
      className="relative flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-900 p-4 transition-all duration-200 cursor-pointer border border-zinc-200 dark:border-zinc-900 aspect-square -m-[.5px]"
      onClick={() => onIconClick(icon)}
    >
      {/* Icon Display */}
      <div className="">
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
