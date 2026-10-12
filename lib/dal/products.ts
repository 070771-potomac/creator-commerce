import "server-only";
import { and, asc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { products, purchases } from "@/db/schema";
import { requireUser } from "@/lib/dal/auth";
import { formatCents, isUuid } from "@/lib/dal/format";

// DTOs (Data Transfer Objects): only the fields a page needs, never the whole
// row. Adding a column to the database later won't leak it to a page.

export type ProductStatus = "Draft" | "Published";

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
// `sales` = Paid purchases of each product, counted by the database in the
// same query (left join + count … filter), so products with 0 sales still appear.
export async function getMyProducts(): Promise<ProductListItem[]> {
  const user = await requireUser();

  const rows = await db
    .select({
      id: products.id,
      title: products.title,
      status: products.status,
      priceCents: products.priceCents,
      currency: products.currency,
      sales: sql<number>`count(${purchases.id}) filter (where ${purchases.status} = 'Paid')`.mapWith(
        Number,
      ),
    })
    .from(products)
    .leftJoin(purchases, eq(purchases.productId, products.id))
    .where(eq(products.ownerId, user.id))
    .groupBy(products.id)
    .orderBy(asc(products.title));

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    price: formatCents(row.priceCents, row.currency),
    sales: row.sales,
  }));
}

// /products/[id] — returns null when the id is malformed, the product doesn't
// exist, OR it belongs to someone else. The page shows 404 in every case, so
// a user can't even learn that another creator's product id exists.
export async function getProductForEdit(id: string): Promise<ProductForEdit | null> {
  if (!isUuid(id)) return null;
  const user = await requireUser();

  // The owner check is part of the WHERE clause: someone else's product is
  // never even read from the database.
  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, id), eq(products.ownerId, user.id)))
    .limit(1);
  if (!product) return null;

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: formatCents(product.priceCents, product.currency),
    status: product.status,
    publicUrl: `/@${user.handle}/${product.slug}`,
  };
}
