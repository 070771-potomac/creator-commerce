import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export type ProductCardProps = {
  title: string;
  price: string;
  type: string;
  description?: string;
  // When set, the whole card links to the product page.
  href?: string;
  // The uploaded cover (S8); without one the card shows the product type.
  coverUrl?: string | null;
};

export function ProductCard({ title, price, type, description, href, coverUrl }: ProductCardProps) {
  const card = (
    <Card className="h-full pt-0 transition-shadow hover:shadow-md">
      {coverUrl ? (
        <div className="relative aspect-4/3 overflow-hidden bg-muted">
          <Image
            src={coverUrl}
            alt=""
            fill
            // Card widths: 1 column on phones, up to 3 on wide screens.
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-4/3 items-center justify-center bg-muted text-xs text-muted-foreground">
          {type}
        </div>
      )}
      <CardContent className="flex flex-1 flex-col gap-2">
        <span className="font-medium">{title}</span>
        {description ? (
          <span className="text-muted-foreground">{description}</span>
        ) : null}
        <div className="mt-auto flex items-center justify-between">
          <span className="tabular-nums">{price}</span>
          <Badge variant="secondary">{type}</Badge>
        </div>
      </CardContent>
    </Card>
  );

  return href ? <Link href={href}>{card}</Link> : card;
}
