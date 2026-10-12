// Better Auth client (browser side): the functions the login, signup and
// logout buttons call. They talk to /api/auth/* (app/api/auth/[...all]).
"use client";

import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// `import type` only brings in TypeScript types — no server code reaches the
// browser. It teaches the client about our extra field `handle`, so
// signUp.email({ ..., handle }) is type-checked.
import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
