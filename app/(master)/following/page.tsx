import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { following } from "@/lib/sample-data";

export default function FollowingPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Following
        </h1>
        <p className="text-sm text-muted-foreground">
          Creators you follow. You get an email when they publish.
        </p>
      </div>

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
            <CardContent className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {person.products} products
              </span>
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link href={`/@${person.handle}`} />}
              >
                View storefront
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
