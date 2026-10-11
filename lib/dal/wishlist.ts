import "server-only";

import { requireUser } from "@/lib/dal/auth";
import { products, users, wishlist } from "@/lib/sample-data";

export type WishlistCard = {
  id: string;
  title: string;
  creatorHandle: string;
  price: string;
  type: string;
  href: string;
};

// /wishlist — only the signed-in user's saved products (filtered by userId).
// Product details are joined in from `products`, so prices are always current.
// A product the creator has since unpublished (Draft) or deleted is skipped:
// the wishlist must never leak a product that isn't public anymore.
export async function getMyWishlist(): Promise<WishlistCard[]> {
  const user = await requireUser();

  return wishlist
    .filter((item) => item.userId === user.id)
    .flatMap((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product || product.status !== "Published") return [];
      const owner = users.find((u) => u.id === product.ownerId);
      if (!owner) return [];

      return [
        {
          id: item.id,
          title: product.title,
          creatorHandle: `@${owner.handle}`,
          price: product.price,
          type: product.type,
          href: `/@${owner.handle}/${product.slug}`,
        },
      ];
    });
}
