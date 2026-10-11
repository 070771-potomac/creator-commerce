// Injects the shared dashboard shell (sidebar + topbar) around each page's
// #page-content. Keeps the 10 dashboard previews lean and consistent.
(function () {
  var NAV = [
    { section: null, items: [{ key: "overview", label: "Overview", href: "overview.html" }] },
    { section: "Selling", items: [
      { key: "products", label: "Products", href: "products.html" },
      { key: "sales", label: "Sales", href: "sales.html" },
    ] },
    { section: "Buying", items: [
      { key: "purchases", label: "Purchases", href: "purchases.html" },
      { key: "downloads", label: "Downloads", href: "downloads.html" },
      { key: "wishlist", label: "Wishlist", href: "wishlist.html" },
    ] },
    { section: null, items: [
      { key: "settings", label: "Settings", href: "settings.html" },
      { key: "help", label: "Help", href: "help-first-sale.html" },
    ] },
  ];

  function build() {
    var active = document.body.getAttribute("data-active") || "";
    var content = document.getElementById("page-content");

    var side = '<div class="side-brand"><span class="dot" style="width:1.35rem;height:1.35rem;border-radius:6px;background:var(--sidebar-primary);"></span> Creator Commerce</div>';
    NAV.forEach(function (grp) {
      if (grp.section) side += '<div class="side-section">' + grp.section + "</div>";
      grp.items.forEach(function (it) {
        side += '<a class="side-link' + (it.key === active ? " active" : "") + '" href="' + it.href + '">' + it.label + "</a>";
      });
    });

    var app = document.createElement("div");
    app.className = "app";
    app.innerHTML =
      '<aside class="app-sidebar">' + side + "</aside>" +
      '<div class="app-main">' +
        '<div class="app-topbar">' +
          '<a href="../index.html" class="muted" style="font-size:.8125rem;text-decoration:none;">← Design System</a>' +
          '<div class="row gap-3"><span class="muted" style="font-size:.8125rem;">alexandru.popovici0707@gmail.com</span>' +
          '<span class="avatar" style="width:1.75rem;height:1.75rem;border-radius:999px;background:var(--sidebar-primary);display:inline-block;"></span></div>' +
        "</div>" +
        '<div class="app-content" id="app-content"></div>' +
      "</div>";

    document.body.insertBefore(app, document.body.firstChild);
    document.getElementById("app-content").appendChild(content);
    content.style.display = "";
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
