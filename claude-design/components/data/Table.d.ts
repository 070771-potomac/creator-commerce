export interface TableColumn {
  key: string;
  label: React.ReactNode;
  align?: "left" | "right" | "center";
  width?: number | string;
  wrap?: boolean;
  render?: (row: any) => React.ReactNode;
}
export interface TableProps {
  columns: TableColumn[];
  rows: any[];
  onRowClick?: (row: any) => void;
  /** Shown when rows is empty. */
  empty?: React.ReactNode;
  style?: React.CSSProperties;
}
/** @startingPoint section="Data" subtitle="Products / Sales / Downloads table" viewport="700x320" */
export declare function Table(props: TableProps): JSX.Element;
