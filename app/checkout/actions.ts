"use server";

// The Buy button's Server Action (S9). It only receives the product id; the
// DAL (lib/dal/checkout.ts) checks everything and asks Stripe for a payment
// page. redirect() then sends the browser there — or to /login, /downloads.
import { redirect } from "next/navigation";
import { z } from "zod";

import { startCheckout } from "@/lib/dal/checkout";
import { ActionError, actionClient } from "@/lib/safe-action";

export const buyProductAction = actionClient
  .inputSchema(z.object({ productId: z.uuid("Invalid product.") }))
  .action(async ({ parsedInput }) => {
    const result = await startCheckout(parsedInput.productId);

    switch (result.kind) {
      case "login":
        // After logging in, the buyer comes back to the product page.
        redirect(`/login?next=${encodeURIComponent(result.next)}`);
      case "owned":
        redirect("/downloads");
      case "error":
        throw new ActionError(result.message);
      case "checkout":
        redirect(result.url); // Stripe's hosted payment page
    }
  });
