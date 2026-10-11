export interface LabelProps {
  htmlFor?: string;
  /** Muted trailing text, e.g. "Optional". */
  hint?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Label(props: LabelProps): JSX.Element;
