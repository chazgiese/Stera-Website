'use client';

import { useState, useEffect } from 'react';
import { IconProps } from '@/types/icon';
import { loadIcon } from '@/utils/iconRegistry';

interface DynamicIconProps extends IconProps {
  iconName: string;
  weight?: 'regular' | 'bold' | 'fill';
  duotone?: boolean;
}

export default function DynamicIcon({ iconName, weight = 'regular', duotone = false, ...props }: DynamicIconProps) {
  const [IconComponent, setIconComponent] = useState<React.ComponentType<IconProps> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIconComponent = async () => {
      try {
        const iconComponent = await loadIcon(iconName, weight, duotone);
        setIconComponent(() => iconComponent);
      } catch (error) {
        console.error(`Failed to load icon ${iconName}:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadIconComponent();
  }, [iconName, weight, duotone]);

  if (loading) {
    return (
      <div 
        className="animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded"
        style={{ width: props.size || 24, height: props.size || 24 }}
      />
    );
  }

  if (!IconComponent) {
    return null;
  }

  return <IconComponent {...props} />;
}
