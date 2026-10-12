import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PlusIcon } from "@phosphor-icons/react/ssr";

import { FollowButton } from "@/components/follow-button";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCreators, getViewerFollows, type CreatorListItem, type ViewerFollows } from "@/lib/dal/creators";

export const metadata: Metadata = {
  title: "Creators",
  description: "Discover independent creators and their digital products.",
  alternates: { canonical: "/creators" },
};

// /creators — every creator with at least one Published product. The list
// is cached (same for everyone); the Follow buttons depend on the visitor,
// so the grid is rendered once more inside Suspense with their state.
export default async function CreatorsPage() {
  const creators = await getCreators();

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-12">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-medium">Creators</h1>
          <p className="text-muted-foreground">
            {creators.length} creators selling templates, guides, sounds and more.
          </p>
        </div>

        {/* Fallback: the same cards without buttons, shown instantly. */}
        <Suspense fallback={<CreatorGrid creators={creators} viewer={null} />}>
          <CreatorGridForViewer creators={creators} />
        </Suspense>
      </main>
    </div>
  );
}

async function CreatorGridForViewer({ creators }: { creators: CreatorListItem[] }) {
  const viewer = await getViewerFollows();
  return <CreatorGrid creators={creators} viewer={viewer} />;
}

function CreatorGrid({ creators, viewer }: { creators: CreatorListItem[]; viewer: ViewerFollows | null }) {
  if (creators.length === 0) {
    return <p className="text-muted-foreground">No creators have published anything yet.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {creators.map((creator) => (
        <Card key={creator.handle}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center bg-primary font-heading text-sm font-medium text-primary-foreground">
                {creator.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </span>
              <div className="flex flex-col">
                <CardTitle>
                  <Link href={`/@${creator.handle}`} className="hover:underline">
                    {creator.name}
                  </Link>
                </CardTitle>
                <span className="text-xs text-muted-foreground">@{creator.handle}</span>
              </div>
            </div>
            <CardDescription className="mt-2 text-sm">{creator.bio}</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">
              {creator.publishedProducts} {creator.publishedProducts === 1 ? "product" : "products"}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link href={`/@${creator.handle}`} />}
              >
                View storefront
              </Button>
              <FollowSlot creator={creator} viewer={viewer} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FollowSlot({ creator, viewer }: { creator: CreatorListItem; viewer: ViewerFollows | null }) {
  if (!viewer) return null; // still loading the visitor's state
  if (viewer.kind === "anonymous") {
    return (
      <Button
        size="sm"
        nativeButton={false}
        render={<Link href={`/login?next=${encodeURIComponent("/creators")}`} />}
      >
        <PlusIcon />
        Follow
      </Button>
    );
  }
  if (viewer.handle === creator.handle) return null; // yourself
  return <FollowButton handle={creator.handle} following={viewer.following.includes(creator.handle)} size="sm" />;
}
