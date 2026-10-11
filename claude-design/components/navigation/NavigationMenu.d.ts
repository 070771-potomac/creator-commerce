export interface NavMenuLink {
  label: string;
  href?: string;
  icon?: string;
  destructive?: boolean;
}
export interface NavMenuItem extends NavMenuLink {
  /** Dropdown links; opens on hover/click. */
  items?: NavMenuLink[];
  /** Align dropdown to the trigger's right edge. */
  align?: "start" | "end";
}
export interface NavigationMenuProps {
  items: NavMenuItem[];
  onSelect?: (item: NavMenuLink) => void;
  style?: React.CSSProperties;
}
export declare function NavigationMenu(props: NavigationMenuProps): JSX.Element;
