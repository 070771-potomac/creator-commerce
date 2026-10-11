export interface InputProps {
  type?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  onChange?: (e: any) => void;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
