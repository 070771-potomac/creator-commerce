// Sample data shared by the pages until it comes from the database (S4–S5).
// Values follow the HTML mockups in design-system/.
//
// It is shaped like the future tables: records point to each other by id
// (ownerId, buyerId, sellerId, productId). Pages never import this file
// directly for user data — they go through lib/dal/, which filters by those ids.

// ── users ────────────────────────────────────────────────────────────────

// Every account can sell and buy. In S5 this becomes the `users` table and
// `id` its primary key; other records point to a user through that id.
export type User = {
  id: string;
  name: string;
  handle: string;
  bio: string;
  email: string;
};

// The signed-in user until Better Auth (S6) — see lib/dal/auth.ts.
export const creator: User = {
  id: "user-1",
  name: "Alexandru Popovici",
  handle: "alexpopovici",
  bio: "Design resources, UI kits and templates for indie makers.",
  email: "alexandru.popovici0707@gmail.com",
};

export const users: User[] = [
  creator,
  // Creators the signed-in user buys from and follows.
  { id: "user-2", name: "Maria Ionescu", handle: "maria", bio: "Type and layout kits for editorial design.", email: "maria@example.com" },
  { id: "user-3", name: "Stefan Radu", handle: "stefan", bio: "Mockups and 3D assets for product shots.", email: "stefan@example.com" },
  { id: "user-4", name: "Ana Dumitru", handle: "dj_ana", bio: "Loops, samples and sound effects.", email: "ana@example.com" },
  // Buyers of the signed-in user's products (they appear in /sales).
  { id: "user-5", name: "Ada Lovelace", handle: "ada", bio: "", email: "ada@example.com" },
  { id: "user-6", name: "Alan Turing", handle: "alan", bio: "", email: "alan@example.com" },
  { id: "user-7", name: "Grace Hopper", handle: "grace", bio: "", email: "grace@example.com" },
  { id: "user-8", name: "Katherine J.", handle: "katherine", bio: "", email: "katherine@example.com" },
];

// ── products ─────────────────────────────────────────────────────────────

export type ProductStatus = "Published" | "Draft";

export type Product = {
  id: string;
  // Who sells this product (a users[].id). The DAL only lets the owner see
  // and edit it in the dashboard. Becomes the Product.ownerId column in S5.
  ownerId: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  price: string;
  status: ProductStatus;
  // The digital asset buyers download (uploaded with UploadThing in S8).
  file: string;
  size: string;
};

export const products: Product[] = [
  // The signed-in user's products (ownerId user-1) — what /products lists.
  {
    id: "1",
    ownerId: creator.id,
    slug: "notion-dashboard-kit",
    title: "Notion Dashboard Kit",
    description:
      "A 42-page Notion system to plan projects, track habits and manage a content calendar — ready to duplicate into your workspace.",
    type: "PDF",
    price: "$24.00",
    status: "Published",
    file: "notion-dashboard-kit.pdf",
    size: "18.2 MB",
  },
  {
    id: "2",
    ownerId: creator.id,
    slug: "icon-set-300-svg",
    title: "Icon Set — 300 SVG",
    description: "300 hand-drawn SVG icons on a 24px grid, in outline and filled styles.",
    type: "SVG",
    price: "$9.00",
    status: "Published",
    file: "icon-set-300.zip",
    size: "4.6 MB",
  },
  {
    id: "3",
    ownerId: creator.id,
    slug: "portfolio-template-v2",
    title: "Portfolio Template v2",
    description: "A one-page portfolio template for designers, with case-study layouts.",
    type: "ZIP",
    price: "$29.00",
    status: "Draft",
    file: "portfolio-template-v2.zip",
    size: "32.0 MB",
  },
  {
    id: "4",
    ownerId: creator.id,
    slug: "wallpaper-bundle",
    title: "Wallpaper Bundle",
    description: "24 desktop and phone wallpapers in 4K.",
    type: "IMG",
    price: "$6.00",
    status: "Published",
    file: "wallpaper-bundle.zip",
    size: "96.3 MB",
  },
  {
    id: "5",
    ownerId: creator.id,
    slug: "lofi-sample-pack",
    title: "Lo-fi Sample Pack",
    description: "120 loops, royalty-free.",
    type: "ZIP",
    price: "$18.00",
    status: "Published",
    file: "lofi-sample-pack.zip",
    size: "140 MB",
  },
  {
    id: "6",
    ownerId: creator.id,
    slug: "brand-guidelines",
    title: "Brand Guidelines",
    description: "A fill-in brand book template for small studios.",
    type: "PDF",
    price: "$15.00",
    status: "Published",
    file: "brand-guidelines.pdf",
    size: "9.8 MB",
  },
  // Other creators' products. They never appear in the signed-in user's
  // /products (the DAL filters by ownerId), but they have public storefronts
  // and can be bought, wishlisted and downloaded by the signed-in user.
  {
    id: "7",
    ownerId: "user-2",
    slug: "type-scale-kit",
    title: "Type Scale Kit",
    description: "Modular type scales and specimen layouts for editorial work.",
    type: "ZIP",
    price: "$19.00",
    status: "Published",
    file: "type-scale-kit.zip",
    size: "12.4 MB",
  },
  {
    id: "8",
    ownerId: "user-2",
    slug: "resume-templates",
    title: "Resume Templates",
    description: "Six clean resume layouts in Figma and InDesign.",
    type: "PDF",
    price: "$12.00",
    status: "Published",
    file: "resume-templates.zip",
    size: "6.1 MB",
  },
  {
    id: "9",
    ownerId: "user-3",
    slug: "mockup-bundle",
    title: "Mockup Bundle",
    description: "40 device and print mockups with smart objects.",
    type: "ZIP",
    price: "$32.00",
    status: "Published",
    file: "mockup-bundle.zip",
    size: "88.1 MB",
  },
  {
    id: "10",
    ownerId: "user-3",
    slug: "3d-icon-pack",
    title: "3D Icon Pack",
    description: "120 rendered 3D icons in PNG and Blender source.",
    type: "ZIP",
    price: "$22.00",
    status: "Published",
    file: "3d-icon-pack.zip",
    size: "54.0 MB",
  },
  {
    id: "11",
    ownerId: "user-4",
    slug: "sound-fx-pack",
    title: "Sound FX Pack",
    description: "300 UI and game sound effects, royalty-free.",
    type: "ZIP",
    price: "$14.00",
    status: "Published",
    file: "sound-fx-pack.zip",
    size: "210 MB",
  },
  {
    id: "12",
    ownerId: "user-4",
    slug: "ambient-loops",
    title: "Ambient Loops",
    description: "48 ambient loops for videos and streams.",
    type: "ZIP",
    price: "$16.00",
    status: "Published",
    file: "ambient-loops.zip",
    size: "160 MB",
  },
];

// ── purchases ────────────────────────────────────────────────────────────

export type PurchaseStatus = "Paid" | "Pending" | "Refunded";

// One table for every order. The same record is a *purchase* for its buyer
// and a *sale* for its seller. buyerId / sellerId / productId are the ids
// Stripe Checkout carries in its metadata (S9); the webhook (S10) creates
// the row. The DAL shows a row in /purchases and /downloads only to its
// buyer, and in /sales only to its seller.
export type Purchase = {
  id: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  date: string;
  amount: string;
  status: PurchaseStatus;
};

export const purchases: Purchase[] = [
  // Bought by the signed-in user (buyerId user-1) → /purchases, /downloads.
  { id: "301", buyerId: "user-1", sellerId: "user-2", productId: "7", date: "Jul 10", amount: "$19.00", status: "Paid" },
  { id: "288", buyerId: "user-1", sellerId: "user-3", productId: "9", date: "Jul 02", amount: "$32.00", status: "Paid" },
  { id: "270", buyerId: "user-1", sellerId: "user-4", productId: "11", date: "Jun 28", amount: "$14.00", status: "Paid" },
  // Sold by the signed-in user (sellerId user-1) → /sales.
  { id: "1042", buyerId: "user-5", sellerId: "user-1", productId: "1", date: "Jul 14", amount: "$24.00", status: "Paid" },
  { id: "1041", buyerId: "user-6", sellerId: "user-1", productId: "2", date: "Jul 14", amount: "$9.00", status: "Paid" },
  { id: "1040", buyerId: "user-7", sellerId: "user-1", productId: "3", date: "Jul 13", amount: "$29.00", status: "Refunded" },
  { id: "1039", buyerId: "user-8", sellerId: "user-1", productId: "4", date: "Jul 13", amount: "$6.00", status: "Pending" },
];

// ── wishlist ─────────────────────────────────────────────────────────────

// One row per "user X saved product Y". Title, price and creator are NOT
// copied here: the DAL reads them from products/users, so a price change
// shows up in every wishlist at once. Becomes the `wishlist_items` table in S5.
export type WishlistItem = {
  id: string;
  userId: string;
  productId: string;
};

export const wishlist: WishlistItem[] = [
  { id: "w-1", userId: "user-1", productId: "10" }, // 3D Icon Pack (@stefan)
  { id: "w-2", userId: "user-1", productId: "8" }, // Resume Templates (@maria)
  { id: "w-3", userId: "user-1", productId: "12" }, // Ambient Loops (@dj_ana)
];

// ── following (moved behind the DAL in a later step) ─────────────────────

export const following = [
  { handle: "maria", name: "Maria Ionescu", bio: "Type and layout kits for editorial design.", products: 8 },
  { handle: "stefan", name: "Stefan Radu", bio: "Mockups and 3D assets for product shots.", products: 14 },
  { handle: "dj_ana", name: "Ana Dumitru", bio: "Loops, samples and sound effects.", products: 22 },
];
