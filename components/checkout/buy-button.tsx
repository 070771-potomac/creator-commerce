"use client";

// "Buy now" on the public product page (S9). It sends only the product id;
// buyProductAction checks everything on the server and redirects the browser
// to Stripe's payment page (or to /login, or to /downloads if already owned).
import { LockKeyIcon } from "@phosphor-icons/react";
import { useAction } from "next-safe-action/hooks";

import { buyProductAction } from "@/app/checkout/actions";
import { Button } from "@/components/ui/button";

export function BuyButton({ productId }: { productId: string }) {
  // isPending stays true while the browser navigates away to Stripe, so the
  // button can't be clicked twice (which would create two payment pages).
  const { execute, isPending, result } = useAction(buyProductAction);

  return (
    <div className="flex flex-col gap-2">
      <Button size="lg" disabled={isPending} onClick={() => execute({ productId })}>
        <LockKeyIcon />
        {isPending ? "Redirecting to checkout…" : "Buy now"}
      </Button>
      {result.serverError ? (
        <p role="alert" className="text-sm text-destructive">
          {result.serverError}
        </p>
      ) : null}
    </div>
  );
}
