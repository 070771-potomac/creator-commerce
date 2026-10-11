import * as React from "react";
// Square, like the rest of base-lyra (the app renders creator initials in a square block).
export function Avatar({ src, name = "", size = 32, style }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return <span style={{ width: size, height: size, borderRadius: "var(--radius-lg)", background: "var(--muted)", color: "var(--muted-foreground)", display: "inline-flex",
    alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0, fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: Math.round(size * 0.38), ...style }}>
    {src ? <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}</span>;
}
