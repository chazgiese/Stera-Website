'use client';

import { IconData } from '@/types/icon';
import DynamicIcon from './DynamicIcon';

interface IconCardProps {
  icon: IconData;
  onIconClick: (icon: IconData) => void;
  weight?: 'regular' | 'bold' | 'fill';
  duotone?: boolean;
}

export default function IconCard({ icon, onIconClick, weight = 'regular', duotone = false }: IconCardProps) {

  return (
    <div
      className="relative flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-900 p-4 transition-all duration-200 cursor-pointer border border-zinc-200 dark:border-zinc-900 aspect-square -m-[.5px]"
      onClick={() => onIconClick(icon)}
    >
      {/* Icon Display */}
      <div className="">
        <DynamicIcon 
          iconName={icon.name}
          weight={weight}
          duotone={duotone}
          size={32} 
          className="text-zinc-700 dark:text-zinc-300 transition-colors" 
        />
      </div>
    </div>
  );
}
