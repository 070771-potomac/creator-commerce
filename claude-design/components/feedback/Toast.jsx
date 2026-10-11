import * as React from "react";
import { Icon } from "../core/Icon.jsx";
const IC = { default: null, success: ["circle-check", "var(--primary)"], error: ["circle-alert", "var(--destructive)"], info: ["info", "var(--muted-foreground)"] };
export function Toast({ variant = "default", title, description, action, onClose, style }) {
  const ic = IC[variant];
  return <div role="status" style={{ width: 356, maxWidth: "100%", display: "flex", alignItems: "flex-start", gap: 10, padding: 16, borderRadius: "var(--radius-xl)",
    background: "var(--popover)", color: "var(--popover-foreground)", fontFamily: "var(--font-sans)", fontSize: 14,
    boxShadow: "0 0 0 1px color-mix(in oklch, var(--foreground) 10%, transparent), var(--shadow-lg)", ...style }}>
    {ic ? <Icon name={ic[0]} size={16} color={ic[1]} style={{ marginTop: 2 }} /> : null}
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
      <div style={{ fontWeight: 600 }}>{title}</div>
      {description ? <div style={{ color: "var(--muted-foreground)" }}>{description}</div> : null}
    </div>
    {action}
    {onClose ? <button onClick={onClose} style={{ border: 0, background: "transparent", padding: 2, cursor: "pointer", color: "var(--muted-foreground)" }}><Icon name="x" size={14} /></button> : null}
  </div>;
}
