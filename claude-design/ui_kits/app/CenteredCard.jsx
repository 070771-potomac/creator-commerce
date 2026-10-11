function CenteredShell({ children }) {
  return <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 24, background: "var(--sidebar)" }}>
    <div style={{ width: "100%", maxWidth: 384, display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: 16 }}>My-E-Commerce</div>{children}</div></div>;
}
function AuthPage({ mode, go }) {
  const { Card, CardHeader, CardContent, CardFooter, Button, Input, Label } = window.DS;
  const signup = mode === "signup";
  const [handle, setHandle] = React.useState("alexpopovici");
  const F = ({ id, label, children }) => <div style={{ display: "flex", flexDirection: "column", gap: 8 }}><Label htmlFor={id}>{label}</Label>{children}</div>;
  return <CenteredShell><Card style={{ width: "100%" }}>
    <CardHeader title={signup ? "Create your account" : "Log in"} description={signup ? "One account to sell and to buy." : "Welcome back."} />
    <CardContent style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {signup ? <F id="n" label="Name"><Input id="n" defaultValue="Alexandru Popovici" /></F> : null}
      <F id="e" label="Email"><Input id="e" type="email" defaultValue="alexandru.popovici0707@gmail.com" /></F>
      {signup ? <div style={{ display: "flex", flexDirection: "column", gap: 8 }}><Label htmlFor="h">Handle</Label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--muted-foreground)" }}>creator.app/@</span>
          <Input id="h" value={handle} onChange={e => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9.]/g, ""))} /></div>
        <span style={{ fontSize: 12, color: "var(--primary)" }}>@{handle || "…"} is available</span></div> : null}
      <F id="p" label="Password"><Input id="p" type="password" defaultValue="••••••••••" /></F>
      <Button size="lg" style={{ width: "100%" }} onClick={() => go("dashboard")}>{signup ? "Create account" : "Log in"}</Button>
    </CardContent>
    <CardFooter style={{ justifyContent: "center", fontSize: 14, color: "var(--muted-foreground)" }}>
      {signup ? "Already have an account?" : "New here?"}<Button variant="link" onClick={() => go(signup ? "login" : "signup")}>{signup ? "Log in" : "Create an account"}</Button></CardFooter>
  </Card></CenteredShell>;
}
function CheckoutPage({ ok, go }) {
  const { Card, CardContent, Button, Icon } = window.DS;
  return <CenteredShell><Card style={{ width: "100%" }}><CardContent style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12, padding: "16px 24px" }}>
    <span style={{ width: 44, height: 44, borderRadius: 9999, display: "grid", placeItems: "center", background: ok ? "color-mix(in oklch, var(--primary) 12%, transparent)" : "var(--muted)" }}>
      <Icon name={ok ? "check" : "x"} size={20} color={ok ? "var(--primary)" : "var(--muted-foreground)"} /></span>
    <div style={{ fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: 20 }}>{ok ? "Payment confirmed" : "Payment cancelled"}</div>
    <div style={{ fontSize: 14, color: "var(--muted-foreground)", textWrap: "pretty" }}>{ok ? "Warm Film — Lightroom presets is in your library. A receipt was sent to alexandru.popovici0707@gmail.com." : "You weren't charged. The product is still available whenever you're ready."}</div>
    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
      {ok ? <Button icon="download" onClick={() => go("dashboard", "Downloads")}>Go to downloads</Button> : <Button onClick={() => go("product")}>Back to product</Button>}
      <Button variant="outline" onClick={() => go("storefront")}>Keep browsing</Button></div>
  </CardContent></Card></CenteredShell>;
}
Object.assign(window, { AuthPage, CheckoutPage });
