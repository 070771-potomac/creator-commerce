import Link from "next/link";
import { XIcon } from "@phosphor-icons/react/ssr";

import { CenteredCardShell } from "@/components/centered-card-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { creator, products } from "@/lib/sample-data";

// Stripe cancel URL (S9). The product will come from the checkout session.
export default function CheckoutCancelPage() {
  const product = products[0];

  return (
    <CenteredCardShell>
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-11 items-center justify-center bg-muted text-muted-foreground">
            <XIcon className="size-5" />
          </span>
          <h1 className="font-heading text-xl font-medium">Payment cancelled</h1>
          <p className="text-sm text-muted-foreground">
            No charge was made. You can pick up where you left off any time.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <Button
              nativeButton={false}
              render={<Link href={`/@${creator.handle}/${product.slug}`} />}
            >
              Back to product
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={`/@${creator.handle}`} />}
            >
              Browse storefront
            </Button>
          </div>
        </CardContent>
      </Card>
    </CenteredCardShell>
  );
}
