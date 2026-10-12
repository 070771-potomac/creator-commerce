import Link from "next/link";

import { FollowButton } from "@/components/follow-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMyFollowing } from "@/lib/dal/users";

export default async function FollowingPage() {
  // Only creators the signed-in user follows (filtered in the DAL).
  const following = await getMyFollowing();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Following
        </h1>
        <p className="text-sm text-muted-foreground">
          Creators you follow. Find more on the{" "}
          <Link href="/creators" className="underline underline-offset-4">
            Creators
          </Link>{" "}
          page.
        </p>
      </div>

      {following.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          You don&apos;t follow anyone yet.{" "}
          <Link href="/creators" className="underline underline-offset-4">
            Browse creators
          </Link>
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {following.map((person) => (
          <Card key={person.handle}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center bg-muted font-heading text-sm font-medium">
                  {person.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <div className="flex flex-col">
                  <CardTitle>{person.name}</CardTitle>
                  <span className="text-xs text-muted-foreground">@{person.handle}</span>
                </div>
              </div>
              <CardDescription className="mt-2 text-sm">{person.bio}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">
                {person.publishedProducts} products
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={<Link href={`/@${person.handle}`} />}
                >
                  View storefront
                </Button>
                {/* Unfollow here; the card leaves the list once saved. */}
                <FollowButton handle={person.handle} following size="sm" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
