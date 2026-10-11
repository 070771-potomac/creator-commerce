export interface IconProps {
  /** Phosphor icon name, kebab-case (e.g. "shopping-bag", "download-simple"). Lucide names used earlier are mapped. */
  name: string;
  /** Pixel size. Default 16 (shadcn size-4). */
  size?: number;
  /** Any CSS color. Default currentColor. */
  color?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
