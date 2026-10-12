import "server-only";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/db";
import { products, users } from "@/db/schema";
import { formatCents } from "@/lib/dal/format";
import { tags } from "@/lib/dal/tags";

// Public storefront data (/@handle and /@handle/{slug}).
// No requireUser() here: anyone may view a storefront, logged in or not.
// The rule that protects creators instead: ONLY Published products are
// returned — Drafts are invisible to the public, as if they didn't exist.
//
// Public data is the same for every visitor, so these functions are cached
// directly ("use cache" on the exported function), keyed by handle/slug.

export type StorefrontProduct = {
  title: string;
  slug: string;
  type: string;
  price: string;
  coverUrl: string | null; // shown on the storefront card (S8 upload)
};

export type Storefront = {
  name: string;
  handle: string;
  bio: string;
  products: StorefrontProduct[];
};

export type PublicProduct = {
  id: string; // sent by the Buy button (S9); the price is re-read on the server
  title: string;
  slug: string;
  description: string;
  type: string;
  price: string;
  creatorHandle: string;
  coverUrl: string | null; // public cover image (S8)
  seoTitle: string | null; // search-result overrides (S13)
  seoDescription: string | null;
};

// Only the public profile columns are selected — never the email.
async function findCreator(handle: string) {
  const [creator] = await db
    .select({ id: users.id, name: users.name, handle: users.handle, bio: users.bio })
    .from(users)
    .where(eq(users.handle, handle))
    .limit(1);
  return creator ?? null;
}

// Creator profile + their Published products. null → the page shows 404.
export async function getStorefront(handle: string): Promise<Storefront | null> {
  "use cache";
  // Tagged by handle first, so even a "no such handle" result can be refreshed.
  cacheTag(tags.storefront(handle));

  const creator = await findCreator(handle);
  if (!creator) return null;
  cacheTag(tags.user(creator.id), tags.products(creator.id));

  const rows = await db
    .select({
      title: products.title,
      slug: products.slug,
      type: products.type,
      priceCents: products.priceCents,
      currency: products.currency,
      coverUrl: products.coverUrl,
    })
    .from(products)
    .where(and(eq(products.ownerId, creator.id), eq(products.status, "Published")))
    .orderBy(asc(products.title));

  return {
    name: creator.name,
    handle: creator.handle,
    bio: creator.bio,
    products: rows.map((row) => ({
      title: row.title,
      slug: row.slug,
      type: row.type,
      price: formatCents(row.priceCents, row.currency),
      coverUrl: row.coverUrl,
    })),
  };
}

// One Published product of one creator. The slug must belong to THAT
// creator: /@maria/notion-dashboard-kit is a 404 even though the slug exists.
export async function getPublicProduct(
  handle: string,
  slug: string,
): Promise<PublicProduct | null> {
  "use cache";
  cacheTag(tags.storefront(handle));

  const creator = await findCreator(handle);
  if (!creator) return null;
  cacheTag(tags.user(creator.id), tags.products(creator.id));

  const [product] = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.ownerId, creator.id),
        eq(products.slug, slug),
        eq(products.status, "Published"),
      ),
    )
    .limit(1);
  if (!product) return null;

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    type: product.type,
    price: formatCents(product.priceCents, product.currency),
    creatorHandle: creator.handle,
    coverUrl: product.coverUrl,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
  };
}

// ── home page ────────────────────────────────────────────────────────────

export type FeaturedProduct = {
  title: string;
  price: string;
  type: string;
  coverUrl: string | null;
  href: string; // /@handle/slug
};

// "Featured" products next to the home page hero: real Published products,
// those with a cover first (they show best), then the most recently updated.
// Cached; each shown creator's tags refresh it, and it also renews itself
// every few minutes so newly published products get their turn.
export async function getFeaturedProducts(limit = 2): Promise<FeaturedProduct[]> {
  "use cache";
  cacheLife("minutes");

  const rows = await db
    .select({
      ownerId: products.ownerId,
      title: products.title,
      slug: products.slug,
      type: products.type,
      priceCents: products.priceCents,
      currency: products.currency,
      coverUrl: products.coverUrl,
      handle: users.handle,
    })
    .from(products)
    .innerJoin(users, eq(users.id, products.ownerId))
    .where(eq(products.status, "Published"))
    .orderBy(sql`${products.coverUrl} is null`, desc(products.updatedAt))
    .limit(limit);

  for (const row of rows) cacheTag(tags.products(row.ownerId), tags.user(row.ownerId));

  return rows.map((row) => ({
    title: row.title,
    price: formatCents(row.priceCents, row.currency),
    type: row.type,
    coverUrl: row.coverUrl,
    href: `/@${row.handle}/${row.slug}`,
  }));
}
