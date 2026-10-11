import * as React from "react";
import { Icon } from "../core/Icon.jsx";
export function EmptyState({ icon = "inbox", title, description, action, style }) {
  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 8, padding: "48px 24px", fontFamily: "var(--font-sans)",
    border: "1px dashed var(--border)", borderRadius: "var(--radius-xl)", ...style }}>
    <span style={{ width: 40, height: 40, borderRadius: "var(--radius-lg)", background: "var(--muted)", display: "grid", placeItems: "center", marginBottom: 4 }}>
      <Icon name={icon} size={20} color="var(--muted-foreground)" /></span>
    <div style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 500 }}>{title}</div>
    {description ? <div style={{ fontSize: 14, color: "var(--muted-foreground)", maxWidth: 360, textWrap: "pretty" }}>{description}</div> : null}
    {action ? <div style={{ marginTop: 8 }}>{action}</div> : null}
  </div>;
}
