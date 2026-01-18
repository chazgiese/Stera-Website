// Icon registry for dynamic icon loading
// This avoids importing the entire stera-icons package at once

import React from 'react';
import { IconProps } from '@/types/icon';

// Cache for loaded icon components
const iconCache = new Map<string, React.ComponentType<IconProps>>();

// Fallback icon component
const FallbackIcon = (props: IconProps) => (
  <svg
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <path d="M9 9h6v6H9z"/>
  </svg>
);

FallbackIcon.displayName = 'FallbackIcon';

// Function to dynamically load an icon
export async function loadIcon(
  iconName: string, 
  weight: 'regular' | 'bold' | 'fill' = 'regular',
  duotone: boolean = false
): Promise<React.ComponentType<IconProps>> {
  
  // Create a cache key that includes the weight and duotone
  const cacheKey = `${iconName}:${weight}:${duotone}`;
  
  // Check if icon is already cached
  if (iconCache.has(cacheKey)) {
    return iconCache.get(cacheKey)!;
  }

  try {
    // Import from the main package instead of individual files
    const iconModule = await import('stera-icons');
    
    // In v7.0.0+, component names no longer have the 'Icon' suffix
    // The iconName is the component name directly (e.g., "AstriskAlt", not "AstriskAltIcon")
    const componentName = iconName;
    
    // The icon is exported as a named export with the component name
    const BaseIconComponent = (iconModule as unknown as Record<string, React.ComponentType<IconProps & { weight?: 'regular' | 'bold' | 'fill'; duotone?: boolean }>>)[componentName];
    
    if (BaseIconComponent) {
      // Create a wrapper that applies the weight and duotone props
      const IconWithProps = (props: IconProps) => {
        return React.createElement(BaseIconComponent, { ...props, weight, duotone });
      };
      IconWithProps.displayName = `${componentName}[${weight}${duotone ? '-duotone' : ''}]`;
      
      iconCache.set(cacheKey, IconWithProps);
      return IconWithProps;
    } else {
      throw new Error(`Icon ${componentName} not found in module`);
    }
  } catch (error) {
    console.warn(`Failed to load icon ${iconName}:`, error);
    // Return fallback icon and cache it
    iconCache.set(cacheKey, FallbackIcon);
    return FallbackIcon;
  }
}

// Function to preload multiple icons
export async function preloadIcons(iconNames: string[]): Promise<void> {
  const loadPromises = iconNames.map(name => loadIcon(name, 'regular', false));
  await Promise.all(loadPromises);
}

// Function to clear the cache (useful for development)
export function clearIconCache(): void {
  iconCache.clear();
}

