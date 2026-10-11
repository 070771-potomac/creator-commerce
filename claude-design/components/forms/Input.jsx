import * as React from "react";
export function Input({ invalid, disabled, style, ...rest }) {
  const [f, setF] = React.useState(false);
  return <input disabled={disabled} aria-invalid={invalid || undefined} {...rest} onFocus={() => setF(true)} onBlur={() => setF(false)}
    style={{ height: 32, width: "100%", minWidth: 0, borderRadius: "var(--radius-lg)", border: "1px solid " + (invalid ? "var(--destructive)" : f ? "var(--ring)" : "var(--input)"),
      background: "transparent", padding: "4px 10px", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--foreground)", outline: "none",
      boxShadow: f ? "0 0 0 3px " + (invalid ? "color-mix(in oklch, var(--destructive) 20%, transparent)" : "color-mix(in oklch, var(--ring) 50%, transparent)") : "none",
      transition: "border-color var(--duration-fast), box-shadow var(--duration-fast)", opacity: disabled ? 0.5 : 1, ...style }} />;
}
