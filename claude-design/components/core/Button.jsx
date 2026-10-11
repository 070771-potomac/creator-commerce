import * as React from "react";
import { Icon } from "./Icon.jsx";
const mix = (v, p) => "color-mix(in oklch, var(" + v + ") " + p + "%, transparent)";
const V = {
  default: { base: { background: "var(--primary)", color: "var(--primary-foreground)" }, hover: { background: mix("--primary", 80) } },
  outline: { base: { background: "var(--background)", color: "var(--foreground)", borderColor: "var(--border)" }, hover: { background: "var(--muted)" } },
  secondary: { base: { background: "var(--secondary)", color: "var(--secondary-foreground)" }, hover: { background: "color-mix(in oklch, var(--secondary), var(--foreground) 5%)" } },
  ghost: { base: { background: "transparent", color: "var(--foreground)" }, hover: { background: "var(--muted)" } },
  destructive: { base: { background: mix("--destructive", 10), color: "var(--destructive)" }, hover: { background: mix("--destructive", 20) } },
  link: { base: { background: "transparent", color: "var(--primary)", padding: 0, height: "auto" }, hover: { textDecoration: "underline" } },
};
const S = {
  xs: { height: 24, padding: "0 8px", gap: 4, fontSize: 12, radius: "min(var(--radius-md), 10px)", icon: 12 },
  sm: { height: 28, padding: "0 10px", gap: 4, fontSize: "0.8rem", radius: "min(var(--radius-md), 12px)", icon: 14 },
  default: { height: 32, padding: "0 10px", gap: 6, fontSize: 14, radius: "var(--radius-lg)", icon: 16 },
  lg: { height: 36, padding: "0 10px", gap: 6, fontSize: 14, radius: "var(--radius-lg)", icon: 16 },
  icon: { height: 32, width: 32, padding: 0, radius: "var(--radius-lg)", icon: 16 },
  "icon-sm": { height: 28, width: 28, padding: 0, radius: "min(var(--radius-md), 12px)", icon: 14 },
  "icon-lg": { height: 36, width: 36, padding: 0, radius: "var(--radius-lg)", icon: 16 },
};
export function Button({ variant = "default", size = "default", icon, iconEnd, disabled, children, style, href, ...rest }) {
  const [h, setH] = React.useState(false);
  const [a, setA] = React.useState(false);
  const v = V[variant] || V.default, s = S[size] || S.default;
  const Tag = href ? "a" : "button";
  return (
    <Tag href={href} disabled={disabled} {...rest}
      onMouseEnter={() => setH(true)} onMouseLeave={() => { setH(false); setA(false); }}
      onMouseDown={() => setA(true)} onMouseUp={() => setA(false)}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, gap: s.gap, height: s.height, width: s.width,
        padding: s.padding, borderRadius: s.radius, border: "1px solid transparent", fontFamily: "var(--font-sans)", fontSize: s.fontSize || 14,
        fontWeight: 500, lineHeight: 1, whiteSpace: "nowrap", cursor: disabled ? "default" : "pointer", textDecoration: "none",
        transition: "all var(--duration-fast) var(--ease-out)", opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? "none" : undefined,
        transform: a ? "translateY(1px)" : undefined, ...v.base, ...(h && !disabled ? v.hover : null), ...style }}>
      {icon ? <Icon name={icon} size={s.icon} /> : null}
      {children}
      {iconEnd ? <Icon name={iconEnd} size={s.icon} /> : null}
    </Tag>
  );
}
