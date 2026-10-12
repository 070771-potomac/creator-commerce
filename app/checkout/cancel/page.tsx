import Link from "next/link";
import { Suspense } from "react";
import { XIcon } from "@phosphor-icons/react/ssr";

import { CenteredCardShell } from "@/components/centered-card-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Stripe cancel URL (S9): the buyer left Stripe's payment page without
// paying. lib/dal/checkout.ts puts the product page in ?product=/@handle/slug
// so we can offer a way back. Nothing was charged and nothing is recorded.
export default function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string | string[] }>;
}) {
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
          {/* The query string is request data → inside Suspense. */}
          <Suspense fallback={<BackLinks productPath={null} />}>
            <BackLinksFromQuery searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </CenteredCardShell>
  );
}

// Only a real product path (/@handle/slug) is turned into a link — never an
// arbitrary URL from the query string (that would be an open redirect).
const PRODUCT_PATH = /^\/@[a-z0-9_]{3,30}\/[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function BackLinksFromQuery({
  searchParams,
}: {
  searchParams: Promise<{ product?: string | string[] }>;
}) {
  const { product } = await searchParams;
  const productPath = typeof product === "string" && PRODUCT_PATH.test(product) ? product : null;
  return <BackLinks productPath={productPath} />;
}

function BackLinks({ productPath }: { productPath: string | null }) {
  // "/@maria/type-scale-kit" → "/@maria"
  const storefront = productPath ? productPath.slice(0, productPath.lastIndexOf("/")) : null;

  return (
    <div className="mt-2 flex flex-wrap justify-center gap-2">
      {productPath ? (
        <Button nativeButton={false} render={<Link href={productPath} />}>
          Back to product
        </Button>
      ) : null}
      <Button
        variant={productPath ? "outline" : "default"}
        nativeButton={false}
        render={<Link href={storefront ?? "/"} />}
      >
        {storefront ? "Browse storefront" : "Back to home"}
      </Button>
    </div>
  );
}
