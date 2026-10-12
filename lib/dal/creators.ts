import "server-only";
import { and, asc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/db";
import { follows, products, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/dal/auth";
import { tags } from "@/lib/dal/tags";

// /creators — the public directory: every creator with at least one
// Published product. Public data only (no emails), the same for every
// visitor, so it's cached; who-follows-whom is read separately per visitor.

export type CreatorListItem = {
  name: string;
  handle: string;
  bio: string;
  publishedProducts: number;
};

export async function getCreators(): Promise<CreatorListItem[]> {
  "use cache";
  // Each listed creator's tags refresh it when they edit their profile or
  // products. A creator publishing their FIRST product isn't tagged here
  // yet, so the list also refreshes on its own every few minutes.
  cacheLife("minutes");

  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      handle: users.handle,
      bio: users.bio,
      publishedProducts: sql<number>`count(${products.id})`.mapWith(Number),
    })
    .from(users)
    .innerJoin(products, and(eq(products.ownerId, users.id), eq(products.status, "Published")))
    .groupBy(users.id, users.name, users.handle, users.bio)
    .orderBy(asc(users.name));

  for (const row of rows) cacheTag(tags.user(row.id), tags.products(row.id));
  return rows.map(({ name, handle, bio, publishedProducts }) => ({ name, handle, bio, publishedProducts }));
}

export type ViewerFollows =
  | { kind: "anonymous" }
  | { kind: "member"; handle: string; following: string[] }; // handles they follow

// Per visitor, not cached: shown inside <Suspense> on /creators.
export async function getViewerFollows(): Promise<ViewerFollows> {
  const user = await getCurrentUser();
  if (!user) return { kind: "anonymous" };

  const rows = await db
    .select({ handle: users.handle })
    .from(follows)
    .innerJoin(users, eq(users.id, follows.followingId))
    .where(eq(follows.followerId, user.id));
  return { kind: "member", handle: user.handle, following: rows.map((row) => row.handle) };
}
