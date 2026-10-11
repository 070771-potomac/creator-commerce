import * as React from "react";
import { Icon } from "../core/Icon.jsx";
export function Sidebar({ header, footer, children, style }) {
  return <aside style={{ width: "var(--sidebar-width)", flexShrink: 0, display: "flex", flexDirection: "column", background: "var(--sidebar)", color: "var(--sidebar-foreground)",
    borderRight: "1px solid var(--sidebar-border)", fontFamily: "var(--font-sans)", fontSize: 14, ...style }}>
    {header ? <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 8 }}>{header}</div> : null}
    <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>{children}</div>
    {footer ? <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 8 }}>{footer}</div> : null}
  </aside>;
}
export function SidebarGroup({ label, children }) {
  return <div style={{ padding: 8, display: "flex", flexDirection: "column" }}>
    {label ? <div style={{ height: 32, display: "flex", alignItems: "center", padding: "0 8px", fontSize: 12, fontWeight: 500,
      color: "color-mix(in oklch, var(--sidebar-foreground) 70%, transparent)" }}>{label}</div> : null}
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>{children}</ul>
  </div>;
}
export function SidebarItem({ icon, label, active, badge, onClick }) {
  const [h, setH] = React.useState(false);
  return <li><button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    style={{ width: "100%", height: 32, display: "flex", alignItems: "center", gap: 8, padding: "0 8px", border: 0, borderRadius: "var(--radius-md)", cursor: "pointer",
      background: active || h ? "var(--sidebar-accent)" : "transparent", color: active || h ? "var(--sidebar-accent-foreground)" : "var(--sidebar-foreground)",
      fontFamily: "inherit", fontSize: 14, fontWeight: active ? 500 : 400, textAlign: "left" }}>
    {icon ? <Icon name={icon} size={16} /> : null}
    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
    {badge != null ? <span style={{ fontSize: 12, fontWeight: 500, color: "var(--muted-foreground)", fontVariantNumeric: "tabular-nums" }}>{badge}</span> : null}
  </button></li>;
}
