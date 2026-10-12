// next-safe-action clients: every Server Action is built from these, so each
// one validates its input with zod and runs the same checks.
import "server-only";
import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action";

import { requireUser } from "@/lib/dal/auth";

// An error whose message is safe to show to the user ("This product no
// longer exists."). Any other error — a database error, a bug — can contain
// internal details, so the browser only gets a generic message.
export class ActionError extends Error {}

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    if (error instanceof ActionError) return error.message;
    console.error("Action failed:", error); // full details stay in the server log
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

// For actions that need a signed-in user. requireUser() redirects to /login
// when there is no valid session, so the action body never runs for a
// logged-out visitor. The user is passed on as ctx.user.
export const authActionClient = actionClient.use(async ({ next }) => {
  const user = await requireUser();
  return next({ ctx: { user } });
});
