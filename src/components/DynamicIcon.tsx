'use client';

import { DynamicIcon as SteraDynamicIcon } from 'stera-icons/dynamic';
import type { DynamicIconProps as SteraDynamicIconProps } from 'stera-icons/dynamic';

interface DynamicIconProps extends Omit<SteraDynamicIconProps, 'name'> {
  iconName: string;       // kebab-case icon name (e.g., "chart-bar-x-y")
  weight?: 'regular' | 'bold' | 'fill';
  duotone?: boolean;
}

export default function DynamicIcon({ 
  iconName,
  weight = 'regular', 
  duotone = false, 
  ...props 
}: DynamicIconProps) {
  return (
    <SteraDynamicIcon 
      name={iconName} 
      weight={weight} 
      duotone={duotone} 
      {...props} 
    />
  );
}

export type { DynamicIconProps };
