export interface IconData {
  name: string;
  tags: string[];
  versionAdded: string;
  versionLastModified?: string;
  weights: ('regular' | 'bold' | 'fill')[];
  supportsDuotone: boolean;
  variants: Record<string, string>; // Maps variant keys (e.g., "regular", "bold-duotone") to version strings
}

export interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}
