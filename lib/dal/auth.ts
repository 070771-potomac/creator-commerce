import "server-only";
import { eq } from "drizzle-orm";
import { connection } from "next/server";
import { cache } from "react";

import { db } from "@/db";
import { users } from "@/db/schema";

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
  // Data is per user and changes over time, so pages using it must render at
  // request time, not once at build time. connection() tells Next.js that
  // (see the Next.js docs: functions/connection). In S6, reading cookies()
  // has the same effect.
  await connection();

  const [user] = await db
    .select({ id: users.id, name: users.name, handle: users.handle, email: users.email })
    .from(users)
    .where(eq(users.id, TEMPORARY_USER_ID))
    .limit(1);

  if (!user) {
    throw new Error(`User ${TEMPORARY_USER_ID} not found. Run "npm run db:seed".`);
  }
  return user;
});
