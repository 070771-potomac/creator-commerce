# My-E-Commerce — web app UI kit
Click-through of the four layouts in docs/site-tree.md. Open index.html; the dark pill at the bottom jumps between routes.
- Marketing.jsx — `/` landing (marketing layout)
- CenteredCard.jsx — `/login`, `/signup`, `/checkout/success`, `/checkout/cancel`
- Storefront.jsx — `/@handle` grid, `/@handle/{slug}` product page
- Dashboard.jsx — shell (sidebar + topbar) with Overview, Products, Edit product, Sales, Purchases, Downloads, Settings; Wishlist / Following shown as empty states; Help is a stub.
- data.js — sample creator, products, sales, purchases.
Every page in the site tree now exists in the repo with sample data (lib/sample-data.ts); this kit mirrors their layouts in the repo's base-lyra / stone / Phosphor style.
