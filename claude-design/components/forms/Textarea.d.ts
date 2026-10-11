export interface TextareaProps {
  rows?: number;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  onChange?: (e: any) => void;
  style?: React.CSSProperties;
}
export declare function Textarea(props: TextareaProps): JSX.Element;
