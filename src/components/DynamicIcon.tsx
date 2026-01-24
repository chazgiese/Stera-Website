'use client';

import { iconMap, type DynamicVariantProps } from '@/data/iconComponents';

interface DynamicIconProps extends Omit<DynamicVariantProps, 'weight'> {
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
  const IconComponent = iconMap[iconName];
  
  if (!IconComponent) {
    return null;
  }
  
  return <IconComponent weight={weight} duotone={duotone} {...props} />;
}
