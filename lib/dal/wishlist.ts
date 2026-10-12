import "server-only";
import { desc, eq } from "drizzle-orm";
import { cacheTag } from "next/cache";

import { db } from "@/db";
import { products, users, wishlistItems } from "@/db/schema";
import { requireUser } from "@/lib/dal/auth";
import { formatCents } from "@/lib/dal/format";
import { tags } from "@/lib/dal/tags";

export type WishlistCard = {
  id: string;
  title: string;
  creatorHandle: string;
  price: string;
  type: string;
  href: string;
  coverUrl: string | null;
};

// /wishlist — only the signed-in user's saved products (filtered by user_id).
export async function getMyWishlist(): Promise<WishlistCard[]> {
  const user = await requireUser();
  return wishlistOf(user.id);
}

// Product details are joined in from `products`, so prices are always current.
// Products the creator has unpublished (Draft) are dropped: a wishlist must
// never leak a product that isn't public. (Deleted products disappear on
// their own: wishlist rows cascade-delete.)
async function wishlistOf(userId: string): Promise<WishlistCard[]> {
  "use cache";
  cacheTag(tags.wishlist(userId));

  // Drafts are read too and filtered below, so every creator in the list is
  // tagged — re-publishing a hidden product then refreshes this wishlist.
  const rows = await db
    .select({
      id: wishlistItems.id,
      title: products.title,
      slug: products.slug,
      type: products.type,
      status: products.status,
      priceCents: products.priceCents,
      currency: products.currency,
      ownerId: products.ownerId,
      ownerHandle: users.handle,
      coverUrl: products.coverUrl,
    })
    .from(wishlistItems)
    .innerJoin(products, eq(products.id, wishlistItems.productId))
    .innerJoin(users, eq(users.id, products.ownerId))
    .where(eq(wishlistItems.userId, userId))
    .orderBy(desc(wishlistItems.createdAt));

  for (const ownerId of new Set(rows.map((row) => row.ownerId))) {
    cacheTag(tags.products(ownerId), tags.user(ownerId));
  }

  return rows
    .filter((row) => row.status === "Published")
    .map((row) => ({
      id: row.id,
      title: row.title,
      creatorHandle: `@${row.ownerHandle}`,
      price: formatCents(row.priceCents, row.currency),
      type: row.type,
      href: `/@${row.ownerHandle}/${row.slug}`,
      coverUrl: row.coverUrl,
    }));
}
