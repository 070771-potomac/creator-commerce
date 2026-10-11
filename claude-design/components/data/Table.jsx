import * as React from "react";
function Row({ row, columns, onRowClick }) {
  const [h, setH] = React.useState(false);
  return <tr onClick={onRowClick ? () => onRowClick(row) : undefined} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    style={{ borderBottom: "1px solid var(--border)", background: h ? "color-mix(in oklch, var(--muted) 50%, transparent)" : "transparent", cursor: onRowClick ? "pointer" : "default", transition: "background var(--duration-fast)" }}>
    {columns.map(c => <td key={c.key} style={{ padding: 8, verticalAlign: "middle", textAlign: c.align || "left", whiteSpace: c.wrap ? "normal" : "nowrap",
      fontVariantNumeric: c.align === "right" ? "tabular-nums" : undefined }}>{c.render ? c.render(row) : row[c.key]}</td>)}
  </tr>;
}
export function Table({ columns = [], rows = [], onRowClick, empty, style }) {
  return <div style={{ width: "100%", overflowX: "auto", overflowY: "hidden", ...style }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--foreground)", captionSide: "bottom" }}>
      <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
        {columns.map(c => <th key={c.key} style={{ height: 40, padding: "0 8px", textAlign: c.align || "left", fontWeight: 500, whiteSpace: "nowrap", width: c.width }}>{c.label}</th>)}
      </tr></thead>
      <tbody>
        {rows.length ? rows.map((r, i) => <Row key={r.id || i} row={r} columns={columns} onRowClick={onRowClick} />)
          : <tr><td colSpan={columns.length} style={{ padding: "48px 8px", textAlign: "center", color: "var(--muted-foreground)" }}>{empty || "No results."}</td></tr>}
      </tbody>
    </table>
  </div>;
}
