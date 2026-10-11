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
};

export function ProductCard({ title, price, type, description, href }: ProductCardProps) {
  const card = (
    <Card className="h-full pt-0 transition-shadow hover:shadow-md">
      {/* Placeholder until cover images are uploaded (S8). */}
      <div className="flex aspect-4/3 items-center justify-center bg-muted text-xs text-muted-foreground">
        cover
      </div>
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
