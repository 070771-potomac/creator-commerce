import "server-only";
import { cache } from "react";

import { creator } from "@/lib/sample-data";

export type CurrentUser = {
  id: string;
  name: string;
  handle: string;
  email: string;
};

// Temporary until Better Auth (S6): always returns the sample creator.
// In S6 this reads the session and redirects to /login when there is none.
// cache() runs the lookup once per request, shared by every DAL function that calls it.
export const requireUser = cache(
  async (): Promise<CurrentUser> => ({
    id: creator.id,
    name: creator.name,
    handle: creator.handle,
    email: creator.email,
  }),
);
