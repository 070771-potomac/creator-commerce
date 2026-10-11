function StoreHeader({ go }) {
  const { Avatar, Button } = window.DS; const c = window.CC.creator;
  return <header style={{ height: 56, display: "flex", alignItems: "center", gap: 10, padding: "0 24px", borderBottom: "1px solid var(--border)" }}>
    <button onClick={() => go("storefront")} style={{ display: "flex", alignItems: "center", gap: 10, border: 0, background: "none", padding: 0, cursor: "pointer", flex: 1, fontFamily: "inherit", color: "inherit" }}>
      <Avatar name={c.name} size={28} /><span style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</span><span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted-foreground)" }}>@{c.handle}</span></button>
    <Button variant="outline" size="sm" icon="user-plus">Follow</Button>
  </header>;
}
function ProductTile({ p, go }) {
  const { Badge } = window.DS; const [h, setH] = React.useState(false);
  return <button onClick={() => go("product")} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    style={{ border: 0, background: "none", padding: 0, textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 10, fontFamily: "inherit", color: "inherit" }}>
    <Placeholder label="cover image" style={{ opacity: h ? 0.85 : 1, transition: "opacity 150ms" }} />
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}><div style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{p.title}</div><div style={{ fontSize: 14, fontVariantNumeric: "tabular-nums" }}>{eur(p.price)}</div></div>
    <Badge variant="secondary" icon={TYPE_ICON[p.type]}>{p.type}</Badge>
  </button>;
}
function Storefront({ go }) {
  const c = window.CC.creator; const items = window.CC.products.filter(p => p.status === "Published");
  return <div style={{ minHeight: "100%" }}><StoreHeader go={go} />
    <main style={{ maxWidth: 1040, margin: "0 auto", padding: "48px 24px", display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 560 }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: 30, lineHeight: "36px" }}>{c.name}</h1>
        <p style={{ margin: 0, color: "var(--muted-foreground)", fontSize: 16, lineHeight: 1.5 }}>{c.bio}</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "32px 24px" }}>{items.map(p => <ProductTile key={p.id} p={p} go={go} />)}</div>
    </main></div>;
}
function ProductPage({ go }) {
  const { Button, Badge, Separator, Icon } = window.DS; const p = window.CC.products[0];
  const [saved, setSaved] = React.useState(false);
  return <div style={{ minHeight: "100%" }}><StoreHeader go={go} />
    <main style={{ maxWidth: 1040, margin: "0 auto", padding: "32px 24px 64px", display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 40 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <Placeholder label="cover image" ratio="16 / 10" radius="var(--radius-xl)" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: 16 }}>Preview</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>{["before / after 1", "before / after 2", "before / after 3"].map(l => <Placeholder key={l} label={l} ratio="1" />)}</div>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Teaser generated from the ZIP: 3 of 24 presets shown.</div></div>
        <Separator />
        <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 16, lineHeight: 1.6 }}>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: 16 }}>About this product</div>
          <p style={{ margin: 0 }}>24 Lightroom presets built from scans of Portra 400 and Gold 200. Warm highlights, soft greens, and grain that holds up in print.</p>
          <ul style={{ margin: 0, paddingLeft: 20, color: "var(--muted-foreground)" }}><li>24 .xmp presets for Lightroom Classic and mobile</li><li>PDF install guide</li><li>Free updates</li></ul></div>
      </div>
      <aside style={{ position: "sticky", top: 24, alignSelf: "start", display: "flex", flexDirection: "column", gap: 16 }}>
        <Badge variant="secondary" icon="file-archive">ZIP · 64 MB</Badge>
        <h1 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: 30, lineHeight: "36px" }}>{p.title}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--muted-foreground)" }}>
          <Icon name="star" size={14} color="var(--foreground)" /><span style={{ color: "var(--foreground)", fontWeight: 600 }}>4.8</span>· 31 reviews · {p.sales} sold</div>
        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: 24 }}>{eur(p.price)}</div>
        <Button size="lg" icon="lock" onClick={() => go("success")} style={{ width: "100%" }}>Buy now</Button>
        <Button size="lg" variant="outline" icon="heart" onClick={() => setSaved(!saved)} style={{ width: "100%" }}>{saved ? "Saved to wishlist" : "Save to wishlist"}</Button>
        <div style={{ fontSize: 12, color: "var(--muted-foreground)", textAlign: "center" }}>Secure checkout with Stripe. <button onClick={() => go("cancel")} style={{ border: 0, background: "none", padding: 0, color: "inherit", textDecoration: "underline", cursor: "pointer", font: "inherit" }}>Preview cancel page</button></div>
      </aside>
    </main></div>;
}
Object.assign(window, { Storefront, ProductPage });
