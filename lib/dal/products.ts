import "server-only";
import { and, asc, eq, sql } from "drizzle-orm";
import { cacheTag, updateTag } from "next/cache";

import { db } from "@/db";
import { products, purchases } from "@/db/schema";
import { requireUser } from "@/lib/dal/auth";
import { formatCents, isUuid } from "@/lib/dal/format";
import { tags } from "@/lib/dal/tags";
import type { CreateProductOutput } from "@/lib/validations/product";

// DTOs (Data Transfer Objects): only the fields a page needs, never the whole
// row. Adding a column to the database later won't leak it to a page.
//
// Caching pattern used in every DAL module:
//   exported function (NOT cached) → requireUser(): who is asking, every request
//   inner function ("use cache")   → the database query, cached per user id

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
export async function getMyProducts(): Promise<ProductListItem[]> {
  const user = await requireUser();
  return productsOfOwner(user.id);
}

// `sales` = Paid purchases of each product, counted by the database in the
// same query (left join + count … filter), so products with 0 sales still appear.
// Tagged with sales too: a new purchase changes the counts.
async function productsOfOwner(ownerId: string): Promise<ProductListItem[]> {
  "use cache";
  cacheTag(tags.products(ownerId), tags.sales(ownerId));

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
    .where(eq(products.ownerId, ownerId))
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
  return productForOwner(id, user.id, user.handle);
}

// The owner is part of the cache key AND of the WHERE clause: someone else's
// product is never read from the database, and never shared between users.
async function productForOwner(
  id: string,
  ownerId: string,
  ownerHandle: string,
): Promise<ProductForEdit | null> {
  "use cache";
  cacheTag(tags.products(ownerId));

  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, id), eq(products.ownerId, ownerId)))
    .limit(1);
  if (!product) return null;

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: formatCents(product.priceCents, product.currency),
    status: product.status,
    publicUrl: `/@${ownerHandle}/${product.slug}`,
  };
}

// ── writes ───────────────────────────────────────────────────────────────
// Called only from Server Actions (app/(master)/products/actions.ts), after
// zod has validated the input. Like the reads, each write decides the owner
// itself with requireUser(): no caller can create or edit products for
// someone else.

export type CreateProductResult = { ok: true; id: string } | { ok: false; error: "slug-taken" };

export async function createProduct(input: CreateProductOutput): Promise<CreateProductResult> {
  const user = await requireUser();

  // Friendly check first; the unique index (owner_id, slug) in the database
  // still guarantees it if two saves race each other.
  const [existing] = await db
    .select({ id: products.id })
    .from(products)
    .where(and(eq(products.ownerId, user.id), eq(products.slug, input.slug)))
    .limit(1);
  if (existing) return { ok: false, error: "slug-taken" };

  const [created] = await db
    .insert(products)
    .values({
      ownerId: user.id, // from the session, never from the form
      title: input.title,
      slug: input.slug,
      description: input.description,
      priceCents: input.price,
      currency: input.currency,
      type: "PDF", // placeholder until the file upload sets it (S8)
      status: "Draft", // new products are never public until published
    })
    .returning({ id: products.id });

  // Read-your-own-writes: the creator's product list, dashboard and
  // storefront show the new product on the very next render.
  updateTag(tags.products(user.id));
  return { ok: true, id: created.id };
}
