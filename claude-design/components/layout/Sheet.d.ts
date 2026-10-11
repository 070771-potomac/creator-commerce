export interface SheetProps {
  open: boolean;
  onClose?: () => void;
  side?: "left" | "right" | "top" | "bottom";
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  width?: number;
  /** Position absolute inside nearest positioned parent (for previews). */
  contained?: boolean;
}
export declare function Sheet(props: SheetProps): JSX.Element | null;
