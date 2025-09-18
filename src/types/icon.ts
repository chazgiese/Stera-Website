export interface IconData {
  name: string;
  tags: string[];
  category: string;
  style: 'Regular' | 'Bold' | 'Filled';
}

export interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}
