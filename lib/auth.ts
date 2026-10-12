// Better Auth configuration (server side). Handles sign-up, sign-in,
// sign-out and sessions; data lives in our Neon database via Drizzle.
// BETTER_AUTH_SECRET and BETTER_AUTH_URL are read from .env.local automatically.
import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

import { db } from "@/db";
import { accounts, sessions, users, verifications } from "@/db/schema";
import { tags } from "@/lib/dal/tags";
import { isValidHandle, normalizeHandle } from "@/lib/handle";

export const auth = betterAuth({
  // Better Auth's 4 models mapped onto our Drizzle tables. Our `users`
  // table is its "user" model, so products/purchases keep pointing at it.
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user: users, session: sessions, account: accounts, verification: verifications },
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // Signing up logs the user in right away (no email confirmation in S6).
    autoSignIn: true,
  },

  user: {
    // Our own columns on the user. `handle` is sent by the signup form;
    // `bio` is edited later in /settings (S7), so the form can't set it.
    additionalFields: {
      handle: { type: "string", required: true, input: true },
      bio: { type: "string", required: false, defaultValue: "", input: false },
    },
  },

  databaseHooks: {
    user: {
      create: {
        // Runs before a new user row is inserted: clean up and check the
        // handle, so users get a clear message instead of a database error.
        before: async (user) => {
          const handle = normalizeHandle(String(user.handle ?? ""));
          if (!isValidHandle(handle)) {
            throw new APIError("BAD_REQUEST", {
              message: "Handle must be 3–30 characters: lowercase letters, digits or _.",
            });
          }
          const [taken] = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.handle, handle))
            .limit(1);
          if (taken) {
            throw new APIError("BAD_REQUEST", { message: `@${handle} is already taken.` });
          }
          return { data: { ...user, handle } };
        },
        // A new storefront now exists at /@handle: refresh the cached
        // "no such handle" result for it (see lib/dal/tags.ts).
        after: async (user) => {
          revalidateTag(tags.storefront(String(user.handle)), "max");
        },
      },
    },
  },

  // nextCookies() lets Server Actions set the session cookie. Must be last.
  plugins: [nextCookies()],
});
