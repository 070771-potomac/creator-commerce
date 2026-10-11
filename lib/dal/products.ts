import "server-only";

import { requireUser } from "@/lib/dal/auth";
import { products, purchases, type ProductStatus } from "@/lib/sample-data";

// DTOs (Data Transfer Objects): only the fields a page needs, never the whole
// record. Adding a column to the database later won't leak it to a page.

export type ProductListItem = {
  id: string;
  title: string;
  status: ProductStatus;
  price: string;
  sales: number;
};

export type ProductForEdit = {
  id: string;
  title: string;
  description: string;
  price: string;
  status: ProductStatus;
  // Public storefront URL, built here so the page doesn't need the user's handle.
  publicUrl: string;
};

// /products — the signed-in user's own products, and nobody else's.
// `sales` is counted from Paid purchases (the same source as the dashboard),
// not stored on the product, so the two pages can never disagree.
export async function getMyProducts(): Promise<ProductListItem[]> {
  const user = await requireUser();
  return products
    .filter((product) => product.ownerId === user.id)
    .map(({ id, title, status, price }) => ({
      id,
      title,
      status,
      price,
      sales: purchases.filter((p) => p.productId === id && p.status === "Paid").length,
    }));
}

// /products/[id] — returns null when the product doesn't exist OR belongs to
// someone else. The page shows 404 in both cases, so a user can't even learn
// that another creator's product id exists.
export async function getProductForEdit(id: string): Promise<ProductForEdit | null> {
  const user = await requireUser();
  const product = products.find((p) => p.id === id);
  if (!product || product.ownerId !== user.id) return null;

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    status: product.status,
    publicUrl: `/@${user.handle}/${product.slug}`,
  };
}
