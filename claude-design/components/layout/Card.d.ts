export interface CardProps {
  /** default = 16px spacing, sm = 12px. */
  size?: "default" | "sm";
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export interface CardHeaderProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Top-right slot (button, menu). */
  action?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
export declare function CardHeader(props: CardHeaderProps): JSX.Element;
export declare function CardTitle(props: { children?: React.ReactNode; style?: React.CSSProperties }): JSX.Element;
export declare function CardDescription(props: { children?: React.ReactNode; style?: React.CSSProperties }): JSX.Element;
export declare function CardContent(props: { children?: React.ReactNode; style?: React.CSSProperties }): JSX.Element;
export declare function CardFooter(props: { children?: React.ReactNode; style?: React.CSSProperties }): JSX.Element;
