import * as React from "react";
export function Label({ children, hint, style, ...rest }) {
  return <label {...rest} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, lineHeight: 1, color: "var(--foreground)", userSelect: "none", ...style }}>
    {children}{hint ? <span style={{ fontWeight: 400, color: "var(--muted-foreground)" }}>{hint}</span> : null}</label>;
}
