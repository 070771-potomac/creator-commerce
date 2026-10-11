import * as React from "react";
import { Icon } from "../core/Icon.jsx";
function NavItem({ item, active, onSelect }) {
  const [o, setO] = React.useState(false);
  const [h, setH] = React.useState(false);
  const hasMenu = item.items && item.items.length;
  return (
    <li style={{ position: "relative" }} onMouseLeave={() => { setO(false); setH(false); }}>
      <button onMouseEnter={() => { setH(true); hasMenu && setO(true); }} onClick={() => hasMenu ? setO(!o) : onSelect && onSelect(item)}
        style={{ height: 36, display: "inline-flex", alignItems: "center", gap: 4, padding: "0 10px", border: 0, borderRadius: "var(--radius-lg)", cursor: "pointer",
          background: h || o ? "var(--muted)" : "transparent", color: "var(--foreground)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500 }}>
        {item.label}{hasMenu ? <Icon name="chevron-down" size={12} style={{ transform: o ? "rotate(180deg)" : "none", transition: "transform 300ms" }} /> : null}
      </button>
      {hasMenu && o ? <ul style={{ position: "absolute", top: "100%", right: item.align === "end" ? 0 : undefined, left: item.align === "end" ? undefined : 0, marginTop: 6, zIndex: 40,
        listStyle: "none", padding: 4, minWidth: 192, background: "var(--popover)", color: "var(--popover-foreground)", borderRadius: "var(--radius-lg)",
        boxShadow: "0 0 0 1px color-mix(in oklch, var(--foreground) 10%, transparent), var(--shadow-md)" }}>
        {item.items.map(s => <MenuLink key={s.label} s={s} onSelect={x => { setO(false); onSelect && onSelect(x); }} />)}
      </ul> : null}
    </li>
  );
}
function MenuLink({ s, onSelect }) {
  const [h, setH] = React.useState(false);
  return <li><button onClick={() => onSelect(s)} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", border: 0, borderRadius: "var(--radius-md)", cursor: "pointer", textAlign: "left",
      background: h ? "var(--accent)" : "transparent", color: s.destructive ? "var(--destructive)" : "var(--foreground)", fontFamily: "var(--font-sans)", fontSize: 14 }}>
    {s.icon ? <Icon name={s.icon} size={16} /> : null}{s.label}</button></li>;
}
export function NavigationMenu({ items = [], onSelect, style }) {
  return <nav style={style}><ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
    {items.map(it => <NavItem key={it.label} item={it} onSelect={onSelect} />)}
  </ul></nav>;
}
