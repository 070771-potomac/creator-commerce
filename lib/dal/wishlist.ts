import "server-only";
import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { products, users, wishlistItems } from "@/db/schema";
import { requireUser } from "@/lib/dal/auth";
import { formatCents } from "@/lib/dal/format";

export type WishlistCard = {
  id: string;
  title: string;
  creatorHandle: string;
  price: string;
  type: string;
  href: string;
};

// /wishlist — only the signed-in user's saved products (filtered by user_id).
// Product details are joined in from `products`, so prices are always current.
// The status condition in the WHERE clause drops products the creator has
// since unpublished: a wishlist must never leak a product that isn't public.
// (Deleted products disappear on their own: wishlist rows cascade-delete.)
export async function getMyWishlist(): Promise<WishlistCard[]> {
  const user = await requireUser();

  const rows = await db
    .select({
      id: wishlistItems.id,
      title: products.title,
      slug: products.slug,
      type: products.type,
      priceCents: products.priceCents,
      currency: products.currency,
      ownerHandle: users.handle,
    })
    .from(wishlistItems)
    .innerJoin(products, eq(products.id, wishlistItems.productId))
    .innerJoin(users, eq(users.id, products.ownerId))
    .where(and(eq(wishlistItems.userId, user.id), eq(products.status, "Published")))
    .orderBy(desc(wishlistItems.createdAt));

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    creatorHandle: `@${row.ownerHandle}`,
    price: formatCents(row.priceCents, row.currency),
    type: row.type,
    href: `/@${row.ownerHandle}/${row.slug}`,
  }));
}
