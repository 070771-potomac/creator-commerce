import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { parseHandleSegment } from "@/lib/handle";
import { creator, products } from "@/lib/sample-data";

export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const handle = parseHandleSegment((await params).handle);
  // Only the sample creator exists until creators come from the database (S13).
  if (handle !== creator.handle) notFound();

  const published = products.filter((product) => product.status === "Published");

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-12">
        <div className="flex items-center gap-4">
          <span className="flex size-16 items-center justify-center bg-primary font-heading text-xl font-medium text-primary-foreground">
            {creator.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </span>
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-3xl font-medium">{creator.name}</h1>
            <span className="text-sm text-muted-foreground">@{creator.handle}</span>
          </div>
        </div>
        <p className="max-w-xl text-muted-foreground">{creator.bio}</p>

        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-heading text-lg font-medium">
            {published.length} products
          </h2>
          <span className="text-xs text-muted-foreground">
            Only published items are public
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {published.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              price={product.price}
              type={product.type}
              href={`/@${creator.handle}/${product.slug}`}
            />
          ))}
        </div>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-6 text-sm text-muted-foreground">
          <span>Powered by My-E-Commerce</span>
          <Link href="/signup" className="hover:text-foreground">
            Open your own store →
          </Link>
        </div>
      </footer>
    </div>
  );
}
