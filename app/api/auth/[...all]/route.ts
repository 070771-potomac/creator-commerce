// One route handles every Better Auth request: /api/auth/sign-up/email,
// /api/auth/sign-in/email, /api/auth/sign-out, /api/auth/get-session…
// [...all] is a catch-all segment: it matches any path under /api/auth.
import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";

export const { GET, POST } = toNextJsHandler(auth);
