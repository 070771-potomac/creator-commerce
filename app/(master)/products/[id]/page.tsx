import Link from "next/link";
import { notFound } from "next/navigation";
import { SparkleIcon } from "@phosphor-icons/react/ssr";

import { DeleteButton } from "@/components/products/delete-button";
import { DuplicateButton } from "@/components/products/duplicate-button";
import { EditProductForm } from "@/components/products/edit-product-form";
import { ProductFiles } from "@/components/products/product-files";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProductForEdit } from "@/lib/dal/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // null when the product is missing or belongs to another user → 404.
  const product = await getProductForEdit((await params).id);
  if (!product) notFound();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Edit product
          </h1>
          <p className="text-sm text-muted-foreground">{product.title}</p>
        </div>
        <div className="flex items-start gap-2">
          <Badge variant={product.status === "Published" ? "default" : "secondary"}>
            {product.status}
          </Badge>
          {product.status === "Published" ? (
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={product.publicUrl} />}
            >
              View page
            </Button>
          ) : null}
          <DuplicateButton productId={product.id} />
          <DeleteButton productId={product.id} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardAction>
                {/* Generates the description and teaser from the file (S14). */}
                <Button type="button" variant="outline" size="sm" disabled>
                  <SparkleIcon />
                  Generate with AI
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              {/* key: a fresh form if the product changes underneath. */}
              <EditProductForm key={product.id} product={product} />
            </CardContent>
          </Card>

        </div>

        <Card>
          <CardHeader>
            <CardTitle>Files</CardTitle>
            <CardDescription>The file buyers get, and the cover shown on your storefront.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Client component: upload zones with progress and error
                messages; the current file and cover come from the DAL. */}
            <ProductFiles
              productId={product.id}
              file={product.file}
              coverUrl={product.coverUrl}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
