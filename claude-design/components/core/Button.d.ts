export interface ButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  size?: "xs" | "sm" | "default" | "lg" | "icon" | "icon-sm" | "icon-lg";
  /** Lucide icon name before the label. */
  icon?: string;
  /** Lucide icon name after the label. */
  iconEnd?: string;
  disabled?: boolean;
  /** Renders an <a> when set. */
  href?: string;
  onClick?: (e: any) => void;
  type?: "button" | "submit";
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
