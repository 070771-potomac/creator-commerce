"use server";

// Follow / Unfollow (storefront button and /following list).
import { z } from "zod";

import { setFollow } from "@/lib/dal/users";
import { HANDLE_PATTERN } from "@/lib/handle";
import { ActionError, authActionClient } from "@/lib/safe-action";

export const setFollowAction = authActionClient
  .inputSchema(
    z.object({
      handle: z.string().regex(HANDLE_PATTERN, "Invalid handle."),
      follow: z.boolean(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const result = await setFollow(parsedInput.handle, parsedInput.follow);
    if (!result.ok) {
      throw new ActionError(
        result.error === "self" ? "You can't follow yourself." : "This creator no longer exists.",
      );
    }
    // The confirmed state: the button keeps it once the server agrees.
    return { following: result.following };
  });
