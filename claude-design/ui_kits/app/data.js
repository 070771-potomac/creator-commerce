window.CC = {
  creator: { name: "Alexandru Popovici", handle: "alexpopovici", bio: "Photographer and designer in Cluj. Presets, guides and templates for working creatives." },
  products: [
    { id: "p1", slug: "warm-film-presets", title: "Warm Film — Lightroom presets", type: "ZIP", status: "Published", price: 19, sales: 42, revenue: 798, updated: "Oct 2" },
    { id: "p2", slug: "freelance-pricing-guide", title: "Freelance pricing guide", type: "PDF", status: "Published", price: 12, sales: 17, revenue: 204, updated: "Sep 28" },
    { id: "p3", slug: "notion-content-calendar", title: "Notion content calendar", type: "PDF", status: "Published", price: 9, sales: 88, revenue: 792, updated: "Sep 21" },
    { id: "p4", slug: "lofi-drum-kit-2", title: "Lo-fi drum kit vol. 2", type: "Audio", status: "Draft", price: 24, sales: 0, revenue: 0, updated: "Oct 6" },
    { id: "p5", slug: "portfolio-mockups", title: "Portfolio mockup set", type: "Image", status: "Published", price: 15, sales: 9, revenue: 135, updated: "Aug 30" },
  ],
  sales: [
    { id: "s1", buyer: "ana.m@example.com", product: "Notion content calendar", date: "Oct 7, 14:02", amount: 9 },
    { id: "s2", buyer: "radu@example.com", product: "Warm Film — Lightroom presets", date: "Oct 7, 09:41", amount: 19 },
    { id: "s3", buyer: "ioana.s@example.com", product: "Freelance pricing guide", date: "Oct 6, 21:17", amount: 12 },
    { id: "s4", buyer: "mihai@example.com", product: "Warm Film — Lightroom presets", date: "Oct 6, 18:55", amount: 19 },
  ],
  purchases: [
    { id: "o1", product: "Type specimen templates", creator: "@studio.lena", date: "Oct 1", amount: 14, file: "type-specimens.zip", size: "48 MB" },
    { id: "o2", product: "Cold email playbook", creator: "@andrei", date: "Sep 12", amount: 8, file: "cold-email-playbook.pdf", size: "2.1 MB" },
  ],
};
window.eur = n => "€" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
window.TYPE_ICON = { PDF: "file-text", ZIP: "file-archive", Audio: "music", Image: "image" };
