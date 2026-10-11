export interface ToastProps {
  variant?: "default" | "success" | "error" | "info";
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Optional trailing Button (size xs/sm). */
  action?: React.ReactNode;
  onClose?: () => void;
  style?: React.CSSProperties;
}
export declare function Toast(props: ToastProps): JSX.Element;
