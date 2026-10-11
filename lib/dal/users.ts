import "server-only";

import { requireUser } from "@/lib/dal/auth";
import { users } from "@/lib/sample-data";

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
  const record = users.find((u) => u.id === user.id);
  if (!record) throw new Error("Signed-in user has no profile record.");

  return {
    displayName: record.name,
    handle: record.handle,
    deliveryEmail: record.email,
  };
}
