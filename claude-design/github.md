repo: 070771-potomac/creator-commerce
branch: main

## Last sync
date: 2026-10-11

### Updated in this project
- Tokens copied from app/globals.css after shadcn preset b3ZgkYk0ji (base-lyra, stone base, green primary)
- Radius scale set to 0: base-lyra components use rounded-none (switch stays pill-shaped)
- Fonts from app/layout.tsx (Oxanium sans, Geist heading, Geist Mono)
- Icons switched from Lucide to Phosphor (components.json iconLibrary: phosphor); Icon.jsx maps old names
- Avatar made square to match the app
- Brand renamed to My-E-Commerce (site title in app/layout.tsx)

### Previous sync
date: 2026-10-07T21:03:06Z — initial build from base-nova / olive / Nunito Sans + Roboto / Lucide

## Screen map
| Screen | Repo files |
|---|---|
| tokens/*.css | app/globals.css, app/layout.tsx |
| components/* | components/ui/*.tsx |
| ui_kits/app (Dashboard shell) | app/(master)/layout.tsx, app/(master)/*/page.tsx |
| ui_kits/app (Marketing, Storefront) | app/(public)/page.tsx, app/(public)/[handle]/**, components/site-header.tsx |
| ui_kits/app (Centered card) | app/(auth)/*, app/checkout/*, components/centered-card-shell.tsx |
