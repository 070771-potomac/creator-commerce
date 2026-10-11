# My-E-Commerce — Design System

My-E-Commerce is the SaaS built in the 60-hour Romanian full-stack course "Creator Commerce Full-Stack" (Next.js 16, Drizzle, Stripe, AI). Every user has one account that can both **sell** and **buy**:
- creators publish digital products (PDF, ZIP, image, audio) to a public storefront at `/@handle` and `/@handle/{slug}`;
- buyers pay through Stripe Checkout and download from a protected library;
- AI generates the product page and a public teaser from the uploaded file.

## Sources
- GitHub: `070771-potomac/creator-commerce` (branch `main`) — `README.md`, `docs/site-tree.md`, `app/globals.css`, `app/layout.tsx`, `components/ui/*`, `components.json`.
- The style follows shadcn preset `b3ZgkYk0ji` applied in the repo: `base-lyra`, base color `stone`, Phosphor icons, Oxanium + Geist fonts.
- All pages in `docs/site-tree.md` exist in the repo with sample data (`lib/sample-data.ts`). The UI kit here is a click-through of those layouts.
- **No logo** exists in the repo. The wordmark is plain Geist 500 text "My-E-Commerce" until one is supplied.

## Products / surfaces (from docs/site-tree.md)
| Layout | Pages |
|---|---|
| Marketing | `/` |
| Storefront | `/@handle`, `/@handle/{slug}` |
| Centered card | `/login`, `/signup`, `/checkout/success`, `/checkout/cancel` |
| Dashboard | Overview, Products, Create/Edit product, Sales, Purchases, Downloads, Wishlist, Following, Settings, Help |

## CONTENT FUNDAMENTALS
- **Language:** UI copy in English (routes and nav in the repo are English); course material is Romanian. Confirm before localizing.
- **Voice:** plain, practical, second person ("Your store performance at a glance", "Files you've bought"). The product talks to creators as capable peers, not fans. No hype words, no exclamation marks.
- **Casing:** Sentence case everywhere — buttons ("New product", "Save to wishlist"), titles ("Top products"), menu items. Product names keep their own casing. "Log in" / "Log out" as verbs.
- **Buttons** are verb-first and short: "Buy now", "Generate with AI", "Save changes", "Delete account".
- **Descriptions** under page titles are one sentence that states a fact: "Manage what you sell."
- **Errors** say what to do: "Price must be at least $1.00", "Files must be under 256 MB."
- **Numbers:** $ with two decimals (`$24.00`), tabular figures, right-aligned in tables. Dates short ("Jul 14").
- **Handles/URLs** are shown as `/@alexpopovici`, `/@alexpopovici/notion-dashboard-kit`.
- **Emoji:** none. Unicode symbols: only "·" as a meta separator and "—" in product titles.

## VISUAL FOUNDATIONS
- **Base:** shadcn `base-lyra` style, base color **stone** — warm grey neutrals (hue ~50). Primary is an emerald **green** (`oklch(0.508 0.118 165.6)`), used for the main action, active values, success and status badges.
- **Type:** Geist for headings and card titles (`--font-heading`), Oxanium for all UI and body (`--font-sans`), Geist Mono for IDs and code. base-lyra is compact: buttons, inputs, labels, table cells and card text are 12px (`text-xs`); page descriptions 14px; page titles 24px semibold; storefront titles 30px; landing display 48px with -0.025em tracking.
- **Color use:** mostly white and stone grey. Green appears sparingly — one primary button per view, active states, status badges, step numbers, the landing call-to-action band. Destructive is a 10% red tint with red text. Charts use the cyan-to-blue ramp `--chart-1…5`.
- **Backgrounds:** flat. White content, off-white `--sidebar` for the dashboard sidebar, `muted/40` behind centered-card pages, `muted` for alternating landing sections. No gradients or textures. Imagery lives only inside product covers (4:3 cards, 16:10 product hero).
- **Corners:** **square.** base-lyra renders cards, buttons, inputs, badges, checkboxes, menus and avatars with `rounded-none`; the radius tokens are 0. Only the switch track and thumb are pill-shaped.
- **Borders & elevation:** surfaces are separated by **1px rings at 10% foreground** rather than shadows. Hairline `--border` for dividers and table rows. Shadows appear on floating layers and on product-card hover (`shadow-md`).
- **Cards:** white, ring-1 foreground/10, square, 16px internal spacing (12px for `sm`). No colored left borders.
- **Density:** compact. Controls 32px tall (24/28/36 alternates), table header 40px, sidebar items 32px.
- **Hover:** primary → 80% opacity; outline/ghost → `--muted` fill; table rows → muted/50; links underline.
- **Press:** 1px downward translate on buttons; no scale.
- **Focus:** border switches to `--ring` plus a 1px ring at 50%; invalid uses destructive border + 20% ring.
- **Motion:** minimal. 150–200ms `ease-out` color/transform transitions; overlays fade; skeletons pulse.
- **Layout:** dashboard = 16rem sidebar + 56px topbar + content at 24px padding. Public pages max 64rem (`max-w-5xl`). Storefront and landing share one header (wordmark, Log in, Sign up).
- **Dark mode:** full `.dark` token set exists in the repo (`tokens/colors.css`).

## ICONOGRAPHY
- The repo declares **Phosphor** (`components.json → iconLibrary: "phosphor"`, `@phosphor-icons/react`), regular weight, 16px default (`size-4`), 12px in xs buttons, 14px in sm.
- In this system, icons render through `<Icon name="…" />`, which masks SVGs from the `@phosphor-icons/core@2.1.1` CDN so they inherit `currentColor`. Older Lucide names (`layout-dashboard`, `settings`, `download`…) are mapped to their Phosphor equivalents inside `Icon.jsx`.
- Core set: squares-four (overview), package, receipt, shopping-bag, download-simple, heart, users, gear, question, plus, upload-simple, sparkle (AI), copy, dots-three, magnifying-glass, star, lock-key, storefront, file-text / file-zip / image / music-note (file types).
- No icon font, PNG icons or emoji. Placeholder imagery uses grey `muted` blocks labelled "cover".

## Index
- `styles.css` — entry point (imports only) → `tokens/fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `base.css`
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand)
- `components/` — React primitives, each with `.jsx`, `.d.ts`, `.prompt.md`; one `*.card.html` per folder; `_preview.js` loader for previews
  - core: Button, Badge, Avatar, Tooltip, Separator, Skeleton, Icon
  - forms: Input, Textarea, Select, Label, Checkbox, Switch
  - layout: Card (+ CardHeader/Title/Description/Content/Footer), Dialog, Sheet
  - navigation: Sidebar (+ SidebarGroup, SidebarItem), NavigationMenu
  - data: Table
  - feedback: Toast, EmptyState
- `ui_kits/app/` — click-through web app (all four layouts)
- `github.md` — source repo link and sync record
- `SKILL.md` — agent skill entry

### Repo inventory vs. additions
From `components/ui`: Badge, Button, Card, Checkbox, Input, Label, NavigationMenu, Select, Separator, Sheet, Sidebar, Skeleton, Switch, Table, Textarea, Tooltip.
App components in the repo: `ProductCard`, `SalesTable`, `SiteHeader`, `CenteredCardShell`.
**Intentional additions** here (standard shadcn equivalents, not yet in the repo):
- Icon — wrapper for the Phosphor set.
- Avatar — storefront header, sidebar user, Following cards (the repo draws initials in a square block).
- Dialog — delete product, leave a review, delete account.
- Toast — S18 "toasts".
- EmptyState — S18 "empty states".
- Badge `success`/`warning` variants and `--warning` token — Published/Draft and refund statuses.
