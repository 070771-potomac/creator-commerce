import * as React from "react";
import { Button } from "../core/Button.jsx";
export function Dialog({ open, onClose, title, description, footer, children, width = 448, contained }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "oklch(0 0 0 / 0.1)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", position: contained ? "absolute" : "fixed", display: "grid", placeItems: "center", padding: 16 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: width, background: "var(--background)", color: "var(--foreground)", borderRadius: "var(--radius-xl)",
        boxShadow: "0 0 0 1px color-mix(in oklch, var(--foreground) 10%, transparent), var(--shadow-lg)", padding: 16, display: "flex", flexDirection: "column", gap: 16,
        fontFamily: "var(--font-sans)", fontSize: 14, position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingRight: 28 }}>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 500, lineHeight: 1.375 }}>{title}</div>
          {description ? <div style={{ color: "var(--muted-foreground)" }}>{description}</div> : null}
        </div>
        <Button variant="ghost" size="icon-sm" icon="x" onClick={onClose} style={{ position: "absolute", top: 8, right: 8 }} />
        {children}
        {footer ? <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, margin: "0 -16px -16px", padding: 16, borderTop: "1px solid var(--border)",
          background: "color-mix(in oklch, var(--muted) 50%, transparent)", borderRadius: "0 0 var(--radius-xl) var(--radius-xl)" }}>{footer}</div> : null}
      </div>
    </div>
  );
}
