import "server-only";
import { and, asc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { follows, products, users } from "@/db/schema";
import { requireUser } from "@/lib/dal/auth";

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

  const [record] = await db
    .select({ name: users.name, handle: users.handle, email: users.email })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);
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

// /following — creators the signed-in user follows (filtered by follower_id).
// The product count includes Published products only (left join, so a
// creator with none still appears with 0), matching what visitors see on
// that creator's storefront. Emails are never selected.
export async function getMyFollowing(): Promise<FollowedCreator[]> {
  const user = await requireUser();

  return db
    .select({
      name: users.name,
      handle: users.handle,
      bio: users.bio,
      publishedProducts: sql<number>`count(${products.id})`.mapWith(Number),
    })
    .from(follows)
    .innerJoin(users, eq(users.id, follows.followingId))
    .leftJoin(products, and(eq(products.ownerId, users.id), eq(products.status, "Published")))
    .where(eq(follows.followerId, user.id))
    .groupBy(users.id, users.name, users.handle, users.bio)
    .orderBy(asc(users.name));
}
