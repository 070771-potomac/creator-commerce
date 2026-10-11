function Placeholder({ label, ratio = "4 / 3", radius = "var(--radius-lg)", style }) {
  return <div style={{ aspectRatio: ratio, borderRadius: radius, display: "grid", placeItems: "center", color: "var(--muted-foreground)",
    background: "repeating-linear-gradient(135deg, var(--muted) 0 10px, color-mix(in oklch, var(--muted), var(--foreground) 4%) 10px 20px)",
    fontFamily: "var(--font-mono)", fontSize: 11, ...style }}>{label}</div>;
}
window.Placeholder = Placeholder;
