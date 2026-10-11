import * as React from "react";
import { Icon } from "./Icon.jsx";
const mix = (v, p) => "color-mix(in oklch, var(" + v + ") " + p + "%, transparent)";
const V = {
  default: { background: "var(--primary)", color: "var(--primary-foreground)" },
  secondary: { background: "var(--secondary)", color: "var(--secondary-foreground)" },
  destructive: { background: mix("--destructive", 10), color: "var(--destructive)" },
  outline: { borderColor: "var(--border)", color: "var(--foreground)" },
  ghost: { color: "var(--muted-foreground)" },
  success: { background: mix("--primary", 12), color: "var(--primary)" },
  warning: { background: mix("--warning", 18), color: "var(--warning-foreground)" },
};
export function Badge({ variant = "default", icon, children, style }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 4, height: 20, width: "fit-content",
      padding: icon ? "2px 8px 2px 6px" : "2px 8px", borderRadius: "var(--radius-4xl)", border: "1px solid transparent", fontFamily: "var(--font-sans)",
      fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0, ...(V[variant] || V.default), ...style }}>
      {icon ? <Icon name={icon} size={12} /> : null}{children}
    </span>
  );
}
