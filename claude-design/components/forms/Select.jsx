import * as React from "react";
import { Icon } from "../core/Icon.jsx";
export function Select({ options = [], invalid, disabled, style, ...rest }) {
  const [f, setF] = React.useState(false);
  return (
    <span style={{ position: "relative", display: "flex", width: style && style.width ? style.width : "100%" }}>
      <select disabled={disabled} {...rest} onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ height: 32, width: "100%", minWidth: 0, borderRadius: "var(--radius-lg)", border: "1px solid " + (invalid ? "var(--destructive)" : f ? "var(--ring)" : "var(--input)"),
      background: "transparent", padding: "4px 10px", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--foreground)", outline: "none",
      boxShadow: f ? "0 0 0 3px " + (invalid ? "color-mix(in oklch, var(--destructive) 20%, transparent)" : "color-mix(in oklch, var(--ring) 50%, transparent)") : "none",
      transition: "border-color var(--duration-fast), box-shadow var(--duration-fast)", opacity: disabled ? 0.5 : 1, appearance: "none", WebkitAppearance: "none", paddingRight: 30, cursor: "pointer", ...style, width: "100%" }}>
        {options.map(o => typeof o === "string" ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <Icon name="chevron-down" size={16} color="var(--muted-foreground)" style={{ position: "absolute", right: 8, top: 8, pointerEvents: "none" }} />
    </span>
  );
}
