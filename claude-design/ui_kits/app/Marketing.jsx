function Landing({ go }) {
  const { Button, Icon } = window.DS;
  const steps = [["upload", "Upload a file", "PDF, ZIP, image or audio. We store it privately."],
    ["sparkles", "Generate the page", "AI drafts the description and a public teaser from your file."],
    ["credit-card", "Get paid", "Buyers pay with Stripe and download from their library."]];
  return <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
    <header style={{ height: 56, display: "flex", alignItems: "center", gap: 16, padding: "0 24px", borderBottom: "1px solid var(--border)" }}>
      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: 16, flex: 1 }}>My-E-Commerce</div>
      <Button variant="ghost" onClick={() => go("login")}>Log in</Button>
      <Button onClick={() => go("signup")}>Start selling</Button>
    </header>
    <main style={{ flex: 1, maxWidth: 1040, width: "100%", margin: "0 auto", padding: "88px 24px 64px", display: "flex", flexDirection: "column", gap: 64 }}>
      <section style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 20, maxWidth: 640 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted-foreground)" }}>creator.app/@yourname</span>
        <h1 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: 48, lineHeight: 1.05, letterSpacing: "-0.025em", textWrap: "balance" }}>Sell your digital products from one simple storefront.</h1>
        <p style={{ margin: 0, fontSize: 18, lineHeight: 1.6, color: "var(--muted-foreground)", textWrap: "pretty" }}>Publish presets, guides, templates and sample packs. Buyers pay through Stripe and get a protected download link.</p>
        <div style={{ display: "flex", gap: 8 }}><Button size="lg" onClick={() => go("signup")} iconEnd="arrow-right">Create your store</Button><Button size="lg" variant="outline" onClick={() => go("storefront")}>See an example</Button></div>
      </section>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, borderTop: "1px solid var(--border)", paddingTop: 32 }}>
        {steps.map(([ic, t, d], i) => <div key={t} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--primary)" }}><Icon name={ic} size={16} /><span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>0{i + 1}</span></div>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: 16 }}>{t}</div>
          <div style={{ fontSize: 14, color: "var(--muted-foreground)" }}>{d}</div></div>)}
      </section>
    </main>
    <footer style={{ borderTop: "1px solid var(--border)", padding: "20px 24px", display: "flex", gap: 16, fontSize: 12, color: "var(--muted-foreground)" }}>
      <span style={{ flex: 1 }}>© 2026 My-E-Commerce</span><span>Terms</span><span>Privacy</span></footer>
  </div>;
}
window.Landing = Landing;
