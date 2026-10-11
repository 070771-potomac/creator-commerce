import Link from "next/link";
import { CheckIcon } from "@phosphor-icons/react/ssr";

import { CenteredCardShell } from "@/components/centered-card-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { creator } from "@/lib/sample-data";

// Stripe success URL (S9). The purchase itself is recorded by the webhook (S10).
export default function CheckoutSuccessPage() {
  return (
    <CenteredCardShell>
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-11 items-center justify-center bg-primary text-primary-foreground">
            <CheckIcon className="size-5" />
          </span>
          <h1 className="font-heading text-xl font-medium">Payment confirmed</h1>
          <p className="text-sm text-muted-foreground">
            Thanks for your purchase. Your download is ready in your library.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <Button nativeButton={false} render={<Link href="/downloads" />}>
              Go to downloads
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={`/@${creator.handle}`} />}
            >
              Continue browsing
            </Button>
          </div>
        </CardContent>
      </Card>
    </CenteredCardShell>
  );
}
