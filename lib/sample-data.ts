// Sample data shared by the pages until it comes from the database (S4–S5).
// Values follow the HTML mockups in design-system/.

export type ProductStatus = "Published" | "Draft";

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  price: string;
  status: ProductStatus;
  sales: number;
};

export const creator = {
  name: "Alexandru Popovici",
  handle: "alexpopovici",
  bio: "Design resources, UI kits and templates for indie makers.",
  email: "alexandru.popovici0707@gmail.com",
};

export const products: Product[] = [
  {
    id: "1",
    slug: "notion-dashboard-kit",
    title: "Notion Dashboard Kit",
    description:
      "A 42-page Notion system to plan projects, track habits and manage a content calendar — ready to duplicate into your workspace.",
    type: "PDF",
    price: "$24.00",
    status: "Published",
    sales: 420,
  },
  {
    id: "2",
    slug: "icon-set-300-svg",
    title: "Icon Set — 300 SVG",
    description: "300 hand-drawn SVG icons on a 24px grid, in outline and filled styles.",
    type: "SVG",
    price: "$9.00",
    status: "Published",
    sales: 388,
  },
  {
    id: "3",
    slug: "portfolio-template-v2",
    title: "Portfolio Template v2",
    description: "A one-page portfolio template for designers, with case-study layouts.",
    type: "ZIP",
    price: "$29.00",
    status: "Draft",
    sales: 0,
  },
  {
    id: "4",
    slug: "wallpaper-bundle",
    title: "Wallpaper Bundle",
    description: "24 desktop and phone wallpapers in 4K.",
    type: "IMG",
    price: "$6.00",
    status: "Published",
    sales: 150,
  },
  {
    id: "5",
    slug: "lofi-sample-pack",
    title: "Lo-fi Sample Pack",
    description: "120 loops, royalty-free.",
    type: "ZIP",
    price: "$18.00",
    status: "Published",
    sales: 64,
  },
  {
    id: "6",
    slug: "brand-guidelines",
    title: "Brand Guidelines",
    description: "A fill-in brand book template for small studios.",
    type: "PDF",
    price: "$15.00",
    status: "Published",
    sales: 37,
  },
];

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getPublishedProductBySlug(slug: string) {
  return products.find(
    (product) => product.slug === slug && product.status === "Published",
  );
}

// Purchases made by the signed-in user from other creators.
export const purchases = [
  { id: "o-301", product: "Type Scale Kit", creator: "@maria", date: "Jul 10", amount: "$19.00", file: "type-scale-kit.zip", type: "ZIP", size: "12.4 MB" },
  { id: "o-288", product: "Mockup Bundle", creator: "@stefan", date: "Jul 02", amount: "$32.00", file: "mockup-bundle.zip", type: "ZIP", size: "88.1 MB" },
  { id: "o-270", product: "Sound FX Pack", creator: "@dj_ana", date: "Jun 28", amount: "$14.00", file: "sound-fx-pack.zip", type: "ZIP", size: "210 MB" },
];

export const wishlist = [
  { id: "w-1", title: "3D Icon Pack", creator: "@stefan", price: "$22.00", type: "ZIP", href: "/@stefan/3d-icon-pack" },
  { id: "w-2", title: "Resume Templates", creator: "@maria", price: "$12.00", type: "PDF", href: "/@maria/resume-templates" },
  { id: "w-3", title: "Ambient Loops", creator: "@dj_ana", price: "$16.00", type: "ZIP", href: "/@dj_ana/ambient-loops" },
];

export const following = [
  { handle: "maria", name: "Maria Ionescu", bio: "Type and layout kits for editorial design.", products: 8 },
  { handle: "stefan", name: "Stefan Radu", bio: "Mockups and 3D assets for product shots.", products: 14 },
  { handle: "dj_ana", name: "Ana Dumitru", bio: "Loops, samples and sound effects.", products: 22 },
];
