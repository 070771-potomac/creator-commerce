import * as React from "react";
import { Icon } from "../core/Icon.jsx";
export function Checkbox({ checked, defaultChecked, onChange, label, disabled }) {
  const [c, setC] = React.useState(!!defaultChecked);
  const on = checked !== undefined ? checked : c;
  const toggle = () => { if (disabled) return; setC(!on); onChange && onChange(!on); };
  return (
    <span onClick={toggle} style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.5 : 1,
      fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--foreground)" }}>
      <span role="checkbox" aria-checked={on} style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center",
        border: "1px solid " + (on ? "var(--primary)" : "var(--input)"), background: on ? "var(--primary)" : "transparent", color: "var(--primary-foreground)", transition: "all var(--duration-fast)" }}>
        {on ? <Icon name="check" size={14} /> : null}</span>
      {label}
    </span>
  );
}
