import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-start gap-3 p-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        Product not found
      </h1>
      <p className="text-sm text-muted-foreground">
        It may have been deleted, or the link is wrong.
      </p>
      <Button nativeButton={false} render={<Link href="/products" />}>
        Back to products
      </Button>
    </div>
  );
}
