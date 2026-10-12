import "server-only";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { connection } from "next/server";
import { cache } from "react";

import { db } from "@/db";
import { users } from "@/db/schema";
import { tags } from "@/lib/dal/tags";

export type CurrentUser = {
  id: string;
  name: string;
  handle: string;
  email: string;
};

// Temporary until Better Auth (S6): the signed-in user is always the seeded
// creator "user-1". In S6 this reads the session cookie instead and
// redirects to /login when there is none.
const TEMPORARY_USER_ID = "user-1";

// cache() runs the lookup once per request, shared by every DAL function that calls it.
export const requireUser = cache(async (): Promise<CurrentUser> => {
  // Who is asking is decided per request, never cached. connection() marks
  // this as request-time work (Next.js docs: functions/connection); in S6,
  // reading cookies() does the same.
  await connection();

  const user = await userById(TEMPORARY_USER_ID);
  if (!user) {
    throw new Error(`User ${TEMPORARY_USER_ID} not found. Run "npm run db:seed".`);
  }
  return user;
});

// Cached per user id. A "use cache" function can't read the request
// (cookies, connection), so the identity is decided above and passed in.
async function userById(userId: string): Promise<CurrentUser | null> {
  "use cache";
  cacheTag(tags.user(userId));

  const [user] = await db
    .select({ id: users.id, name: users.name, handle: users.handle, email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return user ?? null;
}
