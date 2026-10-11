import "server-only";

import { requireUser } from "@/lib/dal/auth";
import { follows, products, users } from "@/lib/sample-data";

export type MyProfile = {
  displayName: string;
  handle: string;
  deliveryEmail: string;
};

// /settings — the signed-in user's own profile, read fresh from `users`
// (not from the session), so the form always shows the saved values.
// Saving goes through a server action that re-checks the user (S7).
export async function getMyProfile(): Promise<MyProfile> {
  const user = await requireUser();
  const record = users.find((u) => u.id === user.id);
  if (!record) throw new Error("Signed-in user has no profile record.");

  return {
    displayName: record.name,
    handle: record.handle,
    deliveryEmail: record.email,
  };
}

export type FollowedCreator = {
  name: string;
  handle: string;
  bio: string;
  publishedProducts: number;
};

// /following — creators the signed-in user follows (filtered by followerId).
// The product count is computed from Published products only, so it matches
// what visitors actually see on that creator's storefront. Emails stay out.
export async function getMyFollowing(): Promise<FollowedCreator[]> {
  const user = await requireUser();

  return follows
    .filter((follow) => follow.followerId === user.id)
    .flatMap((follow) => {
      const followed = users.find((u) => u.id === follow.followingId);
      if (!followed) return [];

      return [
        {
          name: followed.name,
          handle: followed.handle,
          bio: followed.bio,
          publishedProducts: products.filter(
            (p) => p.ownerId === followed.id && p.status === "Published",
          ).length,
        },
      ];
    });
}
