// Re-export IconProps and IconWeight from stera-icons for type consistency
export type { IconProps, IconWeight } from 'stera-icons';

export interface IconData {
  name: string;              // PascalCase (e.g., "ChartBarXY")
  kebabName: string;         // kebab-case (e.g., "chart-bar-x-y")
  componentName?: string;    // Optional explicit PascalCase
  tags: string[];
  versionAdded: string;
  versionLastModified?: string;
  weights: ('regular' | 'bold' | 'fill')[];
  supportsDuotone: boolean;
  variants: Record<string, string>; // Maps variant keys (e.g., "regular", "bold-duotone") to version strings
}
