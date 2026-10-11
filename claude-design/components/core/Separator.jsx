import * as React from "react";
export function Separator({ orientation = "horizontal", style }) {
  const h = orientation === "horizontal";
  return <div role="separator" style={{ flexShrink: 0, background: "var(--border)", width: h ? "100%" : 1, height: h ? 1 : "auto", alignSelf: h ? undefined : "stretch", ...style }} />;
}
