export interface IconData {
  name: string;
  tags: string[];
  versionAdded: string;
}

export interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}
