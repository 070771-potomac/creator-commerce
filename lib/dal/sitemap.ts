import "server-only";
import { and, eq, max } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/db";
import { products, users } from "@/db/schema";

// Public data for sitemap.xml (S13): every storefront with at least one
// Published product, and every Published product. Drafts never appear.
// Cached for up to an hour — search engines don't need it to the second.

export type SitemapEntries = {
  storefronts: { handle: string; lastModified: Date }[];
  products: { handle: string; slug: string; lastModified: Date }[];
};

export async function getSitemapEntries(): Promise<SitemapEntries> {
  "use cache";
  cacheLife("hours");
  cacheTag("sitemap");

  const published = eq(products.status, "Published");

  const [storefronts, productRows] = await Promise.all([
    db
      .select({ handle: users.handle, lastModified: max(products.updatedAt) })
      .from(users)
      .innerJoin(products, and(eq(products.ownerId, users.id), published))
      .groupBy(users.handle),
    db
      .select({ handle: users.handle, slug: products.slug, lastModified: products.updatedAt })
      .from(products)
      .innerJoin(users, eq(users.id, products.ownerId))
      .where(published),
  ]);

  return {
    storefronts: storefronts.map((row) => ({ handle: row.handle, lastModified: row.lastModified ?? new Date(0) })),
    products: productRows,
  };
}
