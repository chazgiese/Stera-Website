export interface IconData {
  name: string;
  tags: string[];
  versionAdded: string;
  versionLastModified?: string;
  variants: {
    regular?: string;
    bold?: string;
    filled?: string;
    filltone?: string;
    linetone?: string;
  };
}

export interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}
