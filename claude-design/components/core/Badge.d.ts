export interface BadgeProps {
  /** success / warning are intentional additions for Published / Draft / refund states. */
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "success" | "warning";
  icon?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
