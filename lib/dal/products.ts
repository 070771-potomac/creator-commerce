import "server-only";
import { and, asc, eq, ilike, sql } from "drizzle-orm";
import { cacheTag, updateTag } from "next/cache";

import { db } from "@/db";
import { products, purchases } from "@/db/schema";
import { requireUser } from "@/lib/dal/auth";
import { formatBytes, formatCents, isUuid } from "@/lib/dal/format";
import { tags } from "@/lib/dal/tags";
import { utapi } from "@/lib/utapi";
import type {
  CreateProductOutput,
  Currency,
  SetProductStatusInput,
  UpdateProductOutput,
} from "@/lib/validations/product";

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

// Raw values for the edit form (not display text): the form shows the price
// as "25.00" with the currency in its own field, then sends them back.
export type ProductForEdit = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceAmount: string; // 2500 cents → "25.00"
  currency: Currency;
  status: ProductStatus;
  // Public storefront URL, built here so the page doesn't need the user's handle.
  publicUrl: string;
  // The uploaded digital asset — name and size only, never its location
  // (that is for buyers, S11). null until a file is uploaded.
  file: { name: string; size: string } | null;
  coverUrl: string | null;
  seoTitle: string; // "" when not set (S13)
  seoDescription: string;
};

// /products — the signed-in user's own products, and nobody else's (S12:
// filtered, searched and paginated in the database, not in the page).
export const PRODUCTS_PAGE_SIZE = 5;

export type ProductListFilter = {
  status: ProductStatus | "all";
  q: string; // search in the title, "" = no search
  page: number; // 1-based
};

export type ProductListPage = {
  items: ProductListItem[];
  total: number; // products matching the filter (all pages)
  page: number; // the page actually shown (clamped to 1…pageCount)
  pageCount: number;
};

export async function getMyProducts(filter: ProductListFilter): Promise<ProductListPage> {
  const user = await requireUser();
  return productsOfOwner(user.id, filter.status, filter.q, filter.page);
}

// `sales` = Paid purchases of each product, counted by the database in the
// same query (left join + count … filter), so products with 0 sales still appear.
// Tagged with sales too: a new purchase changes the counts.
// Every argument is part of the cache key: each filter / search / page is
// cached separately, and all of them are refreshed by the same tags.
async function productsOfOwner(
  ownerId: string,
  status: ProductStatus | "all",
  q: string,
  page: number,
): Promise<ProductListPage> {
  "use cache";
  cacheTag(tags.products(ownerId), tags.sales(ownerId));

  const where = and(
    eq(products.ownerId, ownerId),
    status === "all" ? undefined : eq(products.status, status),
    // ilike = case-insensitive LIKE. % and _ typed by the user are escaped,
    // so "50%" searches for the text "50%", not "50 followed by anything".
    q ? ilike(products.title, `%${q.replace(/[\\%_]/g, "\\$&")}%`) : undefined,
  );

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)`.mapWith(Number) })
    .from(products)
    .where(where);

  const pageCount = Math.max(1, Math.ceil(total / PRODUCTS_PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pageCount); // ?page=99 → last page

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
    .where(where)
    .groupBy(products.id)
    // id as a tie-breaker: two products with the same title can't swap
    // places between pages.
    .orderBy(asc(products.title), asc(products.id))
    .limit(PRODUCTS_PAGE_SIZE)
    .offset((current - 1) * PRODUCTS_PAGE_SIZE);

  return {
    items: rows.map((row) => ({
      id: row.id,
      title: row.title,
      status: row.status,
      price: formatCents(row.priceCents, row.currency),
      sales: row.sales,
    })),
    total,
    page: current,
    pageCount,
  };
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
    slug: product.slug,
    title: product.title,
    description: product.description,
    priceAmount: (product.priceCents / 100).toFixed(2),
    currency: product.currency as Currency,
    status: product.status,
    publicUrl: `/@${ownerHandle}/${product.slug}`,
    file:
      product.fileKey && product.fileName
        ? { name: product.fileName, size: formatBytes(product.fileSizeBytes ?? 0) }
        : null,
    coverUrl: product.coverUrl,
    seoTitle: product.seoTitle ?? "",
    seoDescription: product.seoDescription ?? "",
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

export type UpdateProductResult = { ok: true } | { ok: false; error: "not-found" };

// Saves the edit form. The owner check is part of the WHERE clause: a product
// that isn't the signed-in user's is never touched — the update matches 0 rows.
export async function updateProduct(input: UpdateProductOutput): Promise<UpdateProductResult> {
  const user = await requireUser();

  const updated = await db
    .update(products)
    .set({
      title: input.title,
      description: input.description,
      priceCents: input.price,
      currency: input.currency,
      status: input.status,
      // Empty → null: the public page then falls back to title / description.
      seoTitle: input.seoTitle || null,
      seoDescription: input.seoDescription || null,
      updatedAt: new Date(),
    })
    .where(and(eq(products.id, input.id), eq(products.ownerId, user.id)))
    .returning({ id: products.id });

  if (updated.length === 0) return { ok: false, error: "not-found" };

  // The list, dashboard, edit page and public storefront all carry this tag.
  updateTag(tags.products(user.id));
  return { ok: true };
}

// One-click publish / unpublish from the products list. Same owner rule as
// updateProduct: someone else's id matches 0 rows and nothing changes.
export async function setProductStatus(input: SetProductStatusInput): Promise<UpdateProductResult> {
  const user = await requireUser();

  const updated = await db
    .update(products)
    .set({ status: input.status, updatedAt: new Date() })
    .where(and(eq(products.id, input.id), eq(products.ownerId, user.id)))
    .returning({ id: products.id });

  if (updated.length === 0) return { ok: false, error: "not-found" };

  updateTag(tags.products(user.id));
  return { ok: true };
}

export type DuplicateProductResult = { ok: true; id: string } | { ok: false; error: "not-found" };

// "Duplicate" on the edit page (S12): a new Draft with the same details.
// The file and cover are NOT copied: both products would point at the same
// UploadThing file, and replacing it on one would delete it for the other.
export async function duplicateProduct(id: string): Promise<DuplicateProductResult> {
  const user = await requireUser();
  if (!isUuid(id)) return { ok: false, error: "not-found" };

  const [source] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, id), eq(products.ownerId, user.id)))
    .limit(1);
  if (!source) return { ok: false, error: "not-found" };

  // my-kit → my-kit-copy → my-kit-copy-2 … (the first one still free).
  const base = `${source.slug.slice(0, 75)}-copy`;
  const taken = new Set(
    (
      await db
        .select({ slug: products.slug })
        .from(products)
        .where(and(eq(products.ownerId, user.id), sql`${products.slug} like ${base + "%"}`))
    ).map((row) => row.slug),
  );
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;

  const [copy] = await db
    .insert(products)
    .values({
      ownerId: user.id,
      slug,
      title: `${source.title.slice(0, 113)} (copy)`, // stays within the 120-char limit
      description: source.description,
      type: source.type,
      priceCents: source.priceCents,
      currency: source.currency,
      status: "Draft", // never public until the creator publishes it
    })
    .returning({ id: products.id });

  updateTag(tags.products(user.id));
  return { ok: true, id: copy.id };
}

export type DeleteProductResult = { ok: true } | { ok: false; error: "not-found" | "has-sales" };

// "Delete" on the edit page (S12). A product with any purchase can't be
// deleted — order history must survive (the database enforces this too:
// purchases.productId is onDelete "restrict"). Its UploadThing files are
// removed after the row, so a failed delete never leaves a product without
// its file.
export async function deleteProduct(id: string): Promise<DeleteProductResult> {
  const user = await requireUser();
  if (!isUuid(id)) return { ok: false, error: "not-found" };

  const [product] = await db
    .select({ fileKey: products.fileKey, coverKey: products.coverKey })
    .from(products)
    .where(and(eq(products.id, id), eq(products.ownerId, user.id)))
    .limit(1);
  if (!product) return { ok: false, error: "not-found" };

  const [{ sold }] = await db
    .select({ sold: sql<number>`count(*)`.mapWith(Number) })
    .from(purchases)
    .where(eq(purchases.productId, id));
  if (sold > 0) return { ok: false, error: "has-sales" };

  await db.delete(products).where(and(eq(products.id, id), eq(products.ownerId, user.id)));

  const keys = [product.fileKey, product.coverKey].filter((key): key is string => Boolean(key));
  if (keys.length > 0) {
    try {
      await utapi.deleteFiles(keys);
    } catch (error) {
      // Cleanup only: the product is already gone, so don't fail the action.
      console.error("Couldn't delete files of deleted product", id, error);
    }
  }

  updateTag(tags.products(user.id));
  return { ok: true };
}
