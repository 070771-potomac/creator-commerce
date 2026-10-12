import "server-only";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { tags } from "@/lib/dal/tags";

export type CurrentUser = {
  id: string;
  name: string;
  handle: string;
  email: string;
};

// The real security check for every dashboard page and every DAL function
// (Next.js auth guide: "Creating a Data Access Layer"). No valid session →
// the user is sent to /login and no data is ever read.
// cache() runs it once per request, shared by every DAL function that calls it.
export const requireUser = cache(async (): Promise<CurrentUser> => {
  // Better Auth reads the session cookie from the request headers, checks its
  // signature and looks the session up in the `session` table (expiry, logout).
  // headers() is request data, so pages using this render per request.
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = await userById(session.user.id);
  // Session for a user that was deleted meanwhile → treat as logged out.
  if (!user) redirect("/login");
  return user;
});

// Cached per user id. A "use cache" function can't read the request
// (cookies, headers), so the identity is decided above and passed in.
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
