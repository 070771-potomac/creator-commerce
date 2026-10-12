import "server-only";

// Cache tags, per owner. Reads label their cached results with these tags
// (cacheTag); writes refresh exactly the affected tags (revalidateTag/updateTag)
// so one creator's change never invalidates everyone else's cache.
//
//   who changes what                         → tags to refresh
//   creator edits a product (S7)             → products(ownerId)
//   creator edits their profile (S7)         → user(userId)
//   Stripe webhook records a purchase (S10)  → sales(sellerId), purchases(buyerId)
//   user saves / removes a wishlist item     → wishlist(userId)
//   user follows / unfollows a creator       → follows(userId)
export const tags = {
  user: (userId: string) => `user:${userId}`,
  products: (ownerId: string) => `products:${ownerId}`,
  sales: (sellerId: string) => `sales:${sellerId}`,
  purchases: (buyerId: string) => `purchases:${buyerId}`,
  wishlist: (userId: string) => `wishlist:${userId}`,
  follows: (userId: string) => `follows:${userId}`,
  // Storefront lookups by handle, including "no such handle" (cached as null):
  // refreshed when a user signs up or changes their handle (S6/S7).
  storefront: (handle: string) => `storefront:${handle}`,
};
