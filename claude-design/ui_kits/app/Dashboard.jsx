const NAV = [[null, [["layout-dashboard", "Overview"]]], ["Selling", [["package", "Products"], ["receipt", "Sales"]]],
  ["Buying", [["shopping-bag", "Purchases"], ["download", "Downloads"], ["heart", "Wishlist"], ["users", "Following"]]], [null, [["settings", "Settings"], ["circle-help", "Help"]]]];
function PageHead({ title, description, actions }) {
  return <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
    <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 4 }}>
      <h1 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: 24, lineHeight: "32px" }}>{title}</h1>
      {description ? <div style={{ fontSize: 14, color: "var(--muted-foreground)" }}>{description}</div> : null}</div>
    {actions ? <div style={{ display: "flex", gap: 8 }}>{actions}</div> : null}</div>;
}
function Kpi({ label, value, delta }) {
  const { Card, CardContent } = window.DS;
  return <Card><CardContent style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <div style={{ fontSize: 14, color: "var(--muted-foreground)" }}>{label}</div>
    <div style={{ fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: 30, lineHeight: "36px", fontVariantNumeric: "tabular-nums" }}>{value}</div>
    <div style={{ fontSize: 12, color: "var(--primary)" }}>{delta}</div></CardContent></Card>;
}
function Overview({ nav, toast }) {
  const { Card, CardHeader, CardContent, Checkbox, Button, Table, Badge } = window.DS; const P = window.CC.products;
  const top = [...P].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  return <>
    <PageHead title="Overview" description="Last 30 days" actions={<Button icon="plus" onClick={() => nav("Edit product")}>New product</Button>} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
      <Kpi label="Revenue" value="€1,929.00" delta="+18% vs previous 30 days" /><Kpi label="Units sold" value="156" delta="+22 this week" /><Kpi label="Published products" value="4" delta="1 draft" /></div>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(260px, 1fr)", gap: 16, alignItems: "start" }}>
      <Card><CardHeader title="Top 5 products" description="By revenue" action={<Button variant="outline" size="sm" onClick={() => nav("Products")}>All products</Button>} />
        <CardContent style={{ padding: "0 8px" }}><Table rows={top} onRowClick={() => nav("Edit product")} columns={[
          { key: "title", label: "Product", render: r => <span style={{ fontWeight: 500 }}>{r.title}</span> },
          { key: "sales", label: "Units", align: "right" }, { key: "revenue", label: "Revenue", align: "right", render: r => eur(r.revenue) }]} /></CardContent></Card>
      <Card><CardHeader title="Get to your first sale" description="3 of 5 done" />
        <CardContent style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Checkbox defaultChecked label="Choose your handle" /><Checkbox defaultChecked label="Upload a product" /><Checkbox defaultChecked label="Publish it" />
          <Checkbox label="Connect Stripe" /><Checkbox label="Share your storefront link" />
          <Button variant="link" iconEnd="arrow-right" onClick={() => nav("Help")} style={{ alignSelf: "flex-start" }}>How to sell your first product</Button></CardContent></Card>
    </div></>;
}
function Products({ nav, toast }) {
  const { Card, CardContent, Input, Select, Button, Table, Badge, Icon, Tooltip } = window.DS;
  const [q, setQ] = React.useState(""); const [st, setSt] = React.useState("All statuses");
  const rows = window.CC.products.filter(p => p.title.toLowerCase().includes(q.toLowerCase()) && (st === "All statuses" || p.status === st));
  return <>
    <PageHead title="Products" description="Everything you sell. Drafts are hidden from your storefront." actions={<Button icon="plus" onClick={() => nav("Edit product")}>New product</Button>} />
    <div style={{ display: "flex", gap: 8 }}><div style={{ position: "relative", flex: 1, maxWidth: 320 }}><Icon name="search" size={16} color="var(--muted-foreground)" style={{ position: "absolute", left: 10, top: 8 }} />
      <Input placeholder="Search products" value={q} onChange={e => setQ(e.target.value)} style={{ paddingLeft: 32 }} /></div>
      <Select options={["All statuses", "Published", "Draft"]} value={st} onChange={e => setSt(e.target.value)} style={{ width: 160 }} /></div>
    <Card style={{ padding: 0, gap: 0 }}><CardContent style={{ padding: "0 8px" }}><Table rows={rows} onRowClick={() => nav("Edit product")} empty="No products match your search." columns={[
      { key: "title", label: "Product", render: r => <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Placeholder label="" ratio="1" style={{ width: 32 }} radius="var(--radius-md)" /><span style={{ fontWeight: 500 }}>{r.title}</span></div> },
      { key: "type", label: "Type", render: r => <Badge variant="secondary" icon={TYPE_ICON[r.type]}>{r.type}</Badge> },
      { key: "status", label: "Status", render: r => <Badge variant={r.status === "Published" ? "success" : "outline"}>{r.status}</Badge> },
      { key: "price", label: "Price", align: "right", render: r => eur(r.price) }, { key: "sales", label: "Sales", align: "right" },
      { key: "updated", label: "Updated", render: r => <span style={{ color: "var(--muted-foreground)" }}>{r.updated}</span> },
      { key: "a", label: "", align: "right", render: () => <span onClick={e => e.stopPropagation()}><Tooltip content="Duplicate"><Button variant="ghost" size="icon-sm" icon="copy" onClick={() => toast("Product duplicated", "Saved as a draft.")} /></Tooltip></span> }]} />
      <div style={{ display: "flex", alignItems: "center", padding: "10px 8px", fontSize: 14, color: "var(--muted-foreground)" }}><span style={{ flex: 1 }}>{rows.length} of {window.CC.products.length} products</span>
        <div style={{ display: "flex", gap: 8 }}><Button variant="outline" size="sm" disabled>Previous</Button><Button variant="outline" size="sm" disabled>Next</Button></div></div>
    </CardContent></Card></>;
}
function EditProduct({ nav, toast }) {
  const { Card, CardHeader, CardContent, CardFooter, Input, Textarea, Select, Label, Switch, Button, Badge, Icon } = window.DS;
  const [gen, setGen] = React.useState(false); const [desc, setDesc] = React.useState("");
  const generate = () => { setGen(true); setDesc(""); const t = "24 Lightroom presets built from scans of Portra 400 and Gold 200. Warm highlights, soft greens, and grain that holds up in print."; let i = 0;
    const id = setInterval(() => { i += 4; setDesc(t.slice(0, i)); if (i >= t.length) { clearInterval(id); setGen(false); } }, 30); };
  const Field = ({ label, hint, children }) => <div style={{ display: "flex", flexDirection: "column", gap: 8 }}><Label hint={hint}>{label}</Label>{children}</div>;
  return <>
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--muted-foreground)" }}><Button variant="ghost" size="sm" icon="arrow-left" onClick={() => nav("Products")}>Products</Button></div>
    <PageHead title="Warm Film — Lightroom presets" actions={<><Button variant="outline" icon="external-link" onClick={() => nav("__product")}>View page</Button><Button onClick={() => toast("Changes saved", "Your storefront is updated.")}>Save</Button></>} />
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(260px, 1fr)", gap: 16, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card><CardHeader title="Details" /><CardContent style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Title"><Input defaultValue="Warm Film — Lightroom presets" /></Field>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}><div style={{ display: "flex", alignItems: "center" }}><Label style={{ flex: 1 }}>Description</Label>
            <Button variant="outline" size="sm" icon="sparkles" onClick={generate} disabled={gen}>{gen ? "Generating…" : "Generate from file"}</Button></div>
            <Textarea rows={5} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe what buyers get, or generate it from your uploaded file." /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 12 }}><Field label="Price"><Input defaultValue="19.00" /></Field><Field label="Currency"><Select options={["EUR", "RON", "USD"]} /></Field></div>
        </CardContent></Card>
        <Card><CardHeader title="SEO" description="How this page appears in search results" /><CardContent style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="URL slug"><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>/@alexpopovici/</span><Input defaultValue="warm-film-presets" /></div></Field>
          <Field label="Meta description" hint="Optional"><Textarea rows={2} defaultValue="Warm film-look Lightroom presets from real Portra and Gold scans." /></Field></CardContent></Card>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card><CardHeader title="Status" /><CardContent style={{ display: "flex", flexDirection: "column", gap: 12 }}><Switch defaultChecked label="Published" />
          <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Visible on your storefront at /@alexpopovici.</div></CardContent></Card>
        <Card><CardHeader title="Files" /><CardContent style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
            <Icon name="file-archive" size={16} color="var(--muted-foreground)" /><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 500 }}>warm-film-v3.zip</div><div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>64 MB · private</div></div>
            <Button variant="ghost" size="icon-sm" icon="refresh-cw" /></div>
          <Label>Cover image</Label><Placeholder label="cover image · 1600×1000" ratio="16 / 10" />
          <Button variant="outline" size="sm" icon="upload">Replace cover</Button></CardContent></Card>
      </div>
    </div></>;
}
function Sales() {
  const { Card, CardContent, Table, Button } = window.DS;
  return <><PageHead title="Sales" description="Payments confirmed by Stripe" actions={<Button variant="outline" icon="download">Export CSV</Button>} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}><Kpi label="Revenue" value="€1,929.00" delta="+18%" /><Kpi label="Orders" value="156" delta="+22 this week" /><Kpi label="Avg. order" value="€12.37" delta="+€0.80" /></div>
    <Card style={{ padding: 0 }}><CardContent style={{ padding: "0 8px" }}><Table rows={window.CC.sales} columns={[
      { key: "product", label: "Product", render: r => <span style={{ fontWeight: 500 }}>{r.product}</span> }, { key: "buyer", label: "Buyer", render: r => <span style={{ color: "var(--muted-foreground)" }}>{r.buyer}</span> },
      { key: "date", label: "Date" }, { key: "amount", label: "Amount", align: "right", render: r => eur(r.amount) }]} /></CardContent></Card></>;
}
function Purchases({ toast }) {
  const { Card, CardContent, Table, Button } = window.DS;
  return <><PageHead title="Purchases" description="Your orders and receipts" />
    <Card style={{ padding: 0 }}><CardContent style={{ padding: "0 8px" }}><Table rows={window.CC.purchases} columns={[
      { key: "product", label: "Product", render: r => <span style={{ fontWeight: 500 }}>{r.product}</span> }, { key: "creator", label: "Creator", render: r => <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>{r.creator}</span> },
      { key: "date", label: "Date" }, { key: "amount", label: "Amount", align: "right", render: r => eur(r.amount) },
      { key: "a", label: "", align: "right", render: () => <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}><Button variant="ghost" size="sm" icon="receipt">Receipt</Button><Button variant="ghost" size="sm" icon="star" onClick={() => toast("Thanks for the review")}>Review</Button></div> }]} /></CardContent></Card></>;
}
function Downloads({ toast }) {
  const { Card, CardContent, Table, Button, Icon } = window.DS;
  const rows = [{ id: "d0", product: "Warm Film — Lightroom presets", file: "warm-film-v3.zip", size: "64 MB", date: "Today" }, ...window.CC.purchases];
  return <><PageHead title="Downloads" description="Files you've bought. Links are private to your account." />
    <Card style={{ padding: 0 }}><CardContent style={{ padding: "0 8px" }}><Table rows={rows} columns={[
      { key: "product", label: "Product", render: r => <span style={{ fontWeight: 500 }}>{r.product}</span> },
      { key: "file", label: "File", render: r => <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted-foreground)" }}><Icon name="file" size={14} />{r.file} · {r.size}</span> },
      { key: "date", label: "Purchased" },
      { key: "a", label: "", align: "right", render: () => <Button size="sm" icon="download" onClick={() => toast("Download started")}>Download</Button> }]} /></CardContent></Card></>;
}
function Settings({ toast }) {
  const { Card, CardHeader, CardContent, CardFooter, Input, Label, Select, Switch, Button } = window.DS;
  const Field = ({ label, hint, children }) => <div style={{ display: "flex", flexDirection: "column", gap: 8 }}><Label hint={hint}>{label}</Label>{children}</div>;
  return <><PageHead title="Settings" />
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 640 }}>
      <Card><CardHeader title="Profile" description="Shown on your storefront" /><CardContent style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Name"><Input defaultValue="Alexandru Popovici" /></Field><Field label="Handle"><Input defaultValue="alexpopovici" /></Field>
        <Field label="Delivery email" hint="Receipts and files"><Input defaultValue="alexandru.popovici0707@gmail.com" /></Field></CardContent>
        <CardFooter style={{ justifyContent: "flex-end" }}><Button onClick={() => toast("Profile saved")}>Save</Button></CardFooter></Card>
      <Card><CardHeader title="Notifications" /><CardContent style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Switch defaultChecked label="Email me for each new sale" /><Switch defaultChecked label="Email me when a followed creator publishes" /><Switch label="Product tips and updates" /></CardContent></Card>
      <Card><CardHeader title="Billing" description="Used on receipts and passed to Stripe" /><CardContent style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Country"><Select options={["Romania", "Germany", "France"]} /></Field><Field label="VAT ID" hint="Optional"><Input placeholder="RO12345678" /></Field></CardContent></Card>
      <Card><CardHeader title="Privacy" /><CardContent style={{ display: "flex", gap: 8 }}><Button variant="outline" icon="file-json">Export my data</Button><Button variant="destructive">Delete account</Button></CardContent></Card>
    </div></>;
}
function EmptyPage({ title, icon, empty, desc, action }) {
  const { EmptyState } = window.DS;
  return <><PageHead title={title} /><EmptyState icon={icon} title={empty} description={desc} action={action} /></>;
}
function DashboardShell({ go, initial = "Overview" }) {
  const { Sidebar, SidebarGroup, SidebarItem, NavigationMenu, Button, Avatar, Toast } = window.DS;
  const [page, setPage] = React.useState(initial); const [t, setT] = React.useState(null);
  React.useEffect(() => setPage(initial), [initial]);
  const toast = (title, description) => { setT({ title, description, k: Date.now() }); setTimeout(() => setT(x => x && Date.now() - x.k > 2400 ? null : x), 2600); };
  const nav = p => p === "__product" ? go("product") : setPage(p);
  const active = page === "Edit product" ? "Products" : page;
  const pages = { Overview, Products, "Edit product": EditProduct, Sales, Purchases, Downloads, Settings };
  const Page = pages[page];
  return <div style={{ display: "flex", height: "100%" }}>
    <Sidebar header={<div style={{ padding: "6px 8px", fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: 15 }}>My-E-Commerce</div>}
      footer={<button onClick={() => go("storefront")} style={{ display: "flex", alignItems: "center", gap: 8, padding: 8, border: 0, background: "none", cursor: "pointer", borderRadius: "var(--radius-md)", fontFamily: "inherit", textAlign: "left", color: "inherit" }}>
        <Avatar name="Alexandru Popovici" size={32} /><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 600 }}>Alexandru Popovici</div><div style={{ fontSize: 12, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>/@alexpopovici</div></div></button>}>
      {NAV.map(([label, items], i) => <SidebarGroup key={i} label={label}>{items.map(([ic, l]) => <SidebarItem key={l} icon={ic} label={l} active={active === l} onClick={() => setPage(l)} badge={l === "Products" ? 5 : null} />)}</SidebarGroup>)}
    </Sidebar>
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
      <header style={{ height: 56, flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", borderBottom: "1px solid var(--border)" }}>
        <Button variant="ghost" size="icon-sm" icon="panel-left" /><span style={{ fontSize: 14, color: "var(--muted-foreground)" }}>{active === page ? page : active + " / Edit"}</span><div style={{ flex: 1 }} />
        <Button variant="outline" size="sm" icon="store" onClick={() => go("storefront")}>View storefront</Button>
        <NavigationMenu onSelect={s => s.label === "Log out" ? go("landing") : setPage("Settings")} items={[{ label: "Account", align: "end", items: [{ label: "Profile", icon: "user" }, { label: "Log out", icon: "log-out" }] }]} />
      </header>
      <main style={{ flex: 1, overflow: "auto" }}><div style={{ maxWidth: 1120, margin: "0 auto", padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
        {Page ? <Page nav={nav} toast={toast} /> :
          page === "Wishlist" ? <EmptyPage title="Wishlist" icon="heart" empty="Nothing saved yet" desc="Save products from any storefront to find them here." /> :
          page === "Following" ? <EmptyPage title="Following" icon="users" empty="You're not following anyone" desc="Follow creators to get an email when they publish." /> :
          <EmptyPage title="How to sell your first product" icon="circle-help" empty="Guide content goes here" desc="Onboarding guide (S18). Content not defined yet." action={<Button onClick={() => setPage("Overview")}>Back to overview</Button>} />}
      </div></main>
    </div>
    {t ? <div style={{ position: "fixed", right: 24, bottom: 24, zIndex: 60 }}><Toast variant="success" title={t.title} description={t.description} onClose={() => setT(null)} /></div> : null}
  </div>;
}
window.DashboardShell = DashboardShell;
