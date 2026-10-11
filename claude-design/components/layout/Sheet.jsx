import * as React from "react";
import { Button } from "../core/Button.jsx";
export function Sheet({ open, onClose, side = "right", title, description, footer, children, width = 384, contained }) {
  if (!open) return null;
  const pos = contained ? "absolute" : "fixed";
  const isX = side === "left" || side === "right";
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "oklch(0 0 0 / 0.1)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", position: pos }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ position: "absolute", [side]: 0, top: isX ? 0 : undefined, bottom: isX ? 0 : (side === "bottom" ? 0 : undefined),
        left: isX ? undefined : 0, right: isX ? (side === "right" ? 0 : undefined) : 0, width: isX ? width : "auto", maxWidth: "100%",
        background: "var(--background)", color: "var(--foreground)", boxShadow: "var(--shadow-lg)", display: "flex", flexDirection: "column", fontFamily: "var(--font-sans)", fontSize: 14,
        borderLeft: side === "right" ? "1px solid var(--border)" : undefined, borderRight: side === "left" ? "1px solid var(--border)" : undefined }}>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 2, position: "relative" }}>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 500 }}>{title}</div>
          {description ? <div style={{ color: "var(--muted-foreground)" }}>{description}</div> : null}
          <Button variant="ghost" size="icon-sm" icon="x" onClick={onClose} style={{ position: "absolute", top: 12, right: 12 }} />
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "0 16px" }}>{children}</div>
        {footer ? <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, marginTop: "auto" }}>{footer}</div> : null}
      </div>
    </div>
  );
}
