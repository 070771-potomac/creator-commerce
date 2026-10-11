import * as React from "react";
export function Card({ size = "default", children, style, ...rest }) {
  const sp = size === "sm" ? 12 : 16;
  return <div {...rest} style={{ "--card-spacing": sp + "px", display: "flex", flexDirection: "column", gap: sp, overflow: "hidden", borderRadius: "var(--radius-xl)",
    background: "var(--card)", color: "var(--card-foreground)", padding: sp + "px 0", fontFamily: "var(--font-sans)", fontSize: 14,
    boxShadow: "0 0 0 1px color-mix(in oklch, var(--foreground) 10%, transparent)", ...style }}>{children}</div>;
}
export function CardHeader({ title, description, action, children, style }) {
  return <div style={{ display: "grid", gridTemplateColumns: action ? "1fr auto" : "1fr", gap: 4, alignItems: "start", padding: "0 var(--card-spacing)", ...style }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
      {title ? <CardTitle>{title}</CardTitle> : null}
      {description ? <CardDescription>{description}</CardDescription> : null}
      {children}
    </div>
    {action ? <div style={{ justifySelf: "end" }}>{action}</div> : null}
  </div>;
}
export function CardTitle({ children, style }) {
  return <div style={{ fontFamily: "var(--font-heading)", fontSize: 16, lineHeight: 1.375, fontWeight: 500, ...style }}>{children}</div>;
}
export function CardDescription({ children, style }) {
  return <div style={{ fontSize: 14, color: "var(--muted-foreground)", ...style }}>{children}</div>;
}
export function CardContent({ children, style }) {
  return <div style={{ padding: "0 var(--card-spacing)", ...style }}>{children}</div>;
}
export function CardFooter({ children, style }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid var(--border)", background: "color-mix(in oklch, var(--muted) 50%, transparent)",
    padding: "var(--card-spacing)", marginBottom: "calc(var(--card-spacing) * -1)", ...style }}>{children}</div>;
}
