import * as React from "react";
export function Skeleton({ width = "100%", height = 16, radius = "var(--radius-md)", style }) {
  return <div style={{ width, height, borderRadius: radius, background: "var(--muted)", animation: "cc-pulse 2s cubic-bezier(.4,0,.6,1) infinite", ...style }}>
    <style>{"@keyframes cc-pulse{50%{opacity:.5}}"}</style></div>;
}
