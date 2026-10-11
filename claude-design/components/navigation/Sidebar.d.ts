export interface SidebarProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export interface SidebarGroupProps {
  /** 12px muted section label, e.g. "Selling", "Buying". */
  label?: string;
  children?: React.ReactNode;
}
export interface SidebarItemProps {
  /** Lucide icon name. */
  icon?: string;
  label: string;
  active?: boolean;
  /** Trailing count. */
  badge?: React.ReactNode;
  onClick?: () => void;
}
export declare function Sidebar(props: SidebarProps): JSX.Element;
export declare function SidebarGroup(props: SidebarGroupProps): JSX.Element;
export declare function SidebarItem(props: SidebarItemProps): JSX.Element;
