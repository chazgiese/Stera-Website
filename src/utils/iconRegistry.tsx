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


// Function to parse icon name and get component name and variant
function parseIconName(displayName: string): { componentName: string; variant: 'regular' | 'bold' | 'filled' } {
  if (displayName.endsWith('Bold')) {
    const baseName = displayName.replace(/Bold$/, '');
    return { componentName: `${baseName}Icon`, variant: 'bold' };
  } else if (displayName.endsWith('Filled')) {
    const baseName = displayName.replace(/Filled$/, '');
    return { componentName: `${baseName}Icon`, variant: 'filled' };
  } else {
    return { componentName: `${displayName}Icon`, variant: 'regular' };
  }
}

// Function to dynamically load an icon
export async function loadIcon(iconName: string): Promise<React.ComponentType<IconProps>> {
  // Check if icon is already cached
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName)!;
  }

  try {
    // Import from the main package instead of individual files
    const iconModule = await import('stera-icons');
    
    // Parse the icon name to get component and variant
    const { componentName, variant } = parseIconName(iconName);
    
    // The icon is exported as a named export with the component name
    const BaseIconComponent = (iconModule as Record<string, React.ComponentType<IconProps & { variant?: 'regular' | 'bold' | 'filled' }>>)[componentName];
    
    if (BaseIconComponent) {
      // Create a wrapper that applies the variant
      const IconWithVariant = (props: IconProps) => {
        return React.createElement(BaseIconComponent, { ...props, variant });
      };
      IconWithVariant.displayName = `${componentName}[${variant}]`;
      
      iconCache.set(iconName, IconWithVariant);
      return IconWithVariant;
    } else {
      throw new Error(`Icon ${componentName} not found in module`);
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
