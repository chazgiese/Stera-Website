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
export async function loadIcon(iconName: string): Promise<React.ComponentType<IconProps>> {
  // Check if icon is already cached
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName)!;
  }

  try {
    // Import from the main package instead of individual files
    const iconModule = await import('stera-icons');
    
    // The icon is exported as a named export with the component name
    const IconComponent = (iconModule as Record<string, React.ComponentType<IconProps>>)[iconName];
    
    if (IconComponent) {
      iconCache.set(iconName, IconComponent);
      return IconComponent;
    } else {
      throw new Error(`Icon ${iconName} not found in module`);
    }
  } catch (error) {
    console.warn(`Failed to load icon ${iconName}:`, error);
    // Return fallback icon and cache it
    iconCache.set(iconName, FallbackIcon);
    return FallbackIcon;
  }
}

// Function to preload multiple icons
export async function preloadIcons(iconNames: string[]): Promise<void> {
  const loadPromises = iconNames.map(name => loadIcon(name));
  await Promise.all(loadPromises);
}

// Function to clear the cache (useful for development)
export function clearIconCache(): void {
  iconCache.clear();
}

// Function to determine icon style from name
export function getIconStyle(iconName: string): 'Regular' | 'Bold' | 'Filled' {
  if (iconName.endsWith('Bold')) return 'Bold';
  if (iconName.endsWith('Filled')) return 'Filled';
  return 'Regular';
}
