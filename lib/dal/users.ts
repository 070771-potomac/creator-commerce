import "server-only";
import { and, asc, eq, sql } from "drizzle-orm";
import { cacheTag } from "next/cache";

import { db } from "@/db";
import { follows, products, users } from "@/db/schema";
import { requireUser } from "@/lib/dal/auth";
import { tags } from "@/lib/dal/tags";

export type MyProfile = {
  displayName: string;
  handle: string;
  deliveryEmail: string;
};

// /settings — the signed-in user's own profile, read from `users`.
// Saving goes through a server action that re-checks the user (S7) and
// refreshes tags.user(userId), so the form shows the saved values.
export async function getMyProfile(): Promise<MyProfile> {
  const user = await requireUser();
  return profileOf(user.id);
}

async function profileOf(userId: string): Promise<MyProfile> {
  "use cache";
  cacheTag(tags.user(userId));

  const [record] = await db
    .select({ name: users.name, handle: users.handle, email: users.email })
    .from(users)
    .where(eq(users.id, userId))
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
export async function getMyFollowing(): Promise<FollowedCreator[]> {
  const user = await requireUser();
  return followingOf(user.id);
}

// The product count includes Published products only (left join, so a
// creator with none still appears with 0), matching what visitors see on
// that creator's storefront. Emails are never selected. Each followed
// creator's tags are added, so their profile or product changes refresh this.
async function followingOf(userId: string): Promise<FollowedCreator[]> {
  "use cache";
  cacheTag(tags.follows(userId));

  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      handle: users.handle,
      bio: users.bio,
      publishedProducts: sql<number>`count(${products.id})`.mapWith(Number),
    })
    .from(follows)
    .innerJoin(users, eq(users.id, follows.followingId))
    .leftJoin(products, and(eq(products.ownerId, users.id), eq(products.status, "Published")))
    .where(eq(follows.followerId, userId))
    .groupBy(users.id, users.name, users.handle, users.bio)
    .orderBy(asc(users.name));

  for (const row of rows) {
    cacheTag(tags.user(row.id), tags.products(row.id));
  }

  return rows.map(({ name, handle, bio, publishedProducts }) => ({
    name,
    handle,
    bio,
    publishedProducts,
  }));
}
