import Link from "next/link";
import { Suspense } from "react";
import { CheckIcon, ClockIcon, WarningIcon } from "@phosphor-icons/react/ssr";

import { CenteredCardShell } from "@/components/centered-card-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCheckoutResult } from "@/lib/dal/checkout";

// Stripe success URL (S9): Stripe sends the buyer here with
// ?session_id=cs_…. The page reads that session from Stripe to show what was
// paid. Recording the purchase (Downloads, Sales) is the webhook's job (S10):
// this page can be skipped (closed tab), the webhook can't.
export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string | string[] }>;
}) {
  return (
    <CenteredCardShell>
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-3 text-center">
          {/* The query string is request data → rendered per request,
              inside Suspense (Cache Components). */}
          <Suspense fallback={<ResultSkeleton />}>
            <CheckoutResultView searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </CenteredCardShell>
  );
}

async function CheckoutResultView({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string | string[] }>;
}) {
  const { session_id } = await searchParams;
  const result = typeof session_id === "string" ? await getCheckoutResult(session_id) : null;

  // Missing / unknown session, or someone else's: one neutral message.
  if (!result) {
    return (
      <>
        <StatusIcon tone="muted">
          <WarningIcon className="size-5" />
        </StatusIcon>
        <h1 className="font-heading text-xl font-medium">Payment not found</h1>
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t find this checkout for your account. If you paid, your
          purchase will still appear in your library.
        </p>
        <Actions />
      </>
    );
  }

  return (
    <>
      <StatusIcon tone={result.paid ? "primary" : "muted"}>
        {result.paid ? <CheckIcon className="size-5" /> : <ClockIcon className="size-5" />}
      </StatusIcon>
      <h1 className="font-heading text-xl font-medium">
        {result.paid ? "Payment confirmed" : "Payment processing"}
      </h1>
      <p className="text-sm text-muted-foreground">
        {result.paid
          ? `You paid ${result.amount} for ${result.productTitle}. It will appear in your downloads in a moment.`
          : `Your payment for ${result.productTitle} is still being processed. We'll add it to your downloads once it's confirmed.`}
      </p>
      <Actions sellerHandle={result.sellerHandle} />
    </>
  );
}

function StatusIcon({ tone, children }: { tone: "primary" | "muted"; children: React.ReactNode }) {
  return (
    <span
      className={
        tone === "primary"
          ? "flex size-11 items-center justify-center bg-primary text-primary-foreground"
          : "flex size-11 items-center justify-center bg-muted text-muted-foreground"
      }
    >
      {children}
    </span>
  );
}

function Actions({ sellerHandle }: { sellerHandle?: string }) {
  return (
    <div className="mt-2 flex flex-wrap justify-center gap-2">
      <Button nativeButton={false} render={<Link href="/downloads" />}>
        Go to downloads
      </Button>
      <Button
        variant="outline"
        nativeButton={false}
        render={<Link href={sellerHandle ? `/@${sellerHandle}` : "/"} />}
      >
        Continue browsing
      </Button>
    </div>
  );
}

function ResultSkeleton() {
  return (
    <>
      <Skeleton className="size-11" />
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-10 w-full" />
    </>
  );
}
