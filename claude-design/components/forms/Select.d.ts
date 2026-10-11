export interface SelectProps {
  options: Array<string | { value: string; label: string }>;
  value?: string;
  defaultValue?: string;
  invalid?: boolean;
  disabled?: boolean;
  onChange?: (e: any) => void;
  style?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;
