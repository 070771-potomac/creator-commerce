export interface AvatarProps {
  src?: string;
  /** Used for alt text and initials fallback. */
  name?: string;
  size?: number;
  style?: React.CSSProperties;
}
export declare function Avatar(props: AvatarProps): JSX.Element;
