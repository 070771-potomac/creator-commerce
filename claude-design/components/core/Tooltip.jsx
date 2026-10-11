import * as React from "react";
export function Tooltip({ content, side = "top", children }) {
  const [o, setO] = React.useState(false);
  const pos = side === "bottom" ? { top: "calc(100% + 6px)" } : { bottom: "calc(100% + 6px)" };
  return (
    <span style={{ position: "relative", display: "inline-flex" }} onMouseEnter={() => setO(true)} onMouseLeave={() => setO(false)}>
      {children}
      {o ? <span role="tooltip" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", ...pos, zIndex: 50, whiteSpace: "nowrap",
        background: "var(--foreground)", color: "var(--background)", fontFamily: "var(--font-sans)", fontSize: 12, padding: "6px 12px", borderRadius: "var(--radius-md)" }}>{content}</span> : null}
    </span>
  );
}
