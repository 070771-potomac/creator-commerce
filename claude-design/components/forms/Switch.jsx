import * as React from "react";
export function Switch({ checked, defaultChecked, onChange, label, disabled }) {
  const [c, setC] = React.useState(!!defaultChecked);
  const on = checked !== undefined ? checked : c;
  const toggle = () => { if (disabled) return; setC(!on); onChange && onChange(!on); };
  return (
    <span onClick={toggle} style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.5 : 1,
      fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--foreground)" }}>
      <span role="switch" aria-checked={on} style={{ width: 32, height: 18.4, borderRadius: 9999, flexShrink: 0, padding: 1, display: "inline-flex", alignItems: "center",
        background: on ? "var(--primary)" : "var(--input)", transition: "background var(--duration-base)" }}>
        <span style={{ width: 16, height: 16, borderRadius: 9999, background: "var(--background)", boxShadow: "var(--shadow-xs)",
          transform: on ? "translateX(14px)" : "translateX(0)", transition: "transform var(--duration-base) var(--ease-out)" }} /></span>
      {label}
    </span>
  );
}
