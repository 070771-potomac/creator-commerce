import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PlusIcon } from "@phosphor-icons/react/ssr";
import { notFound } from "next/navigation";

import { FollowButton } from "@/components/follow-button";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { parseHandleSegment } from "@/lib/handle";
import { getStorefront } from "@/lib/dal/storefront";
import { getFollowState } from "@/lib/dal/users";

// Storefront metadata (S13): "Maria Ionescu (@maria) · My-E-Commerce".
export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const handle = parseHandleSegment((await params).handle);
  const creator = handle ? await getStorefront(handle) : null; // cached, shared with the page
  if (!creator) return { title: "Creator not found", robots: { index: false } };

  const title = `${creator.name} (@${creator.handle})`;
  const description = (creator.bio || `Digital products by ${creator.name}.`).slice(0, 160);
  return {
    title,
    description,
    alternates: { canonical: `/@${creator.handle}` },
    openGraph: { siteName: "My-E-Commerce", type: "profile", title, description, url: `/@${creator.handle}` },
  };
}

export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const handle = parseHandleSegment((await params).handle);
  // Unknown handle → null → 404. The DAL returns only Published products.
  const creator = handle ? await getStorefront(handle) : null;
  if (!creator) notFound();
  const published = creator.products;

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
          {/* Per visitor → read on each request, inside Suspense, while the
              rest of the storefront stays cached. */}
          <div className="ml-auto">
            <Suspense fallback={null}>
              <FollowControl handle={creator.handle} />
            </Suspense>
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
              key={product.slug}
              title={product.title}
              price={product.price}
              type={product.type}
              coverUrl={product.coverUrl}
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

// Follow button for this visitor: a login link when signed out, nothing on
// your own storefront, Follow / Following otherwise.
async function FollowControl({ handle }: { handle: string }) {
  const state = await getFollowState(handle);
  if (state.kind === "self") return null;
  if (state.kind === "anonymous") {
    return (
      <Button nativeButton={false} render={<Link href={`/login?next=${encodeURIComponent(`/@${handle}`)}`} />}>
        <PlusIcon />
        Follow
      </Button>
    );
  }
  return <FollowButton handle={handle} following={state.following} />;
}
