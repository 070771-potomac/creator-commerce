import Link from "next/link";
import { notFound } from "next/navigation";
import { SparkleIcon, UploadSimpleIcon } from "@phosphor-icons/react/ssr";

import { EditProductForm } from "@/components/products/edit-product-form";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
        <div className="flex items-center gap-2">
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

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
              <CardDescription>
                How this page appears in search results. Saved in S13 (Storefront &amp; SEO).
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="seoTitle">SEO title</Label>
                <Input id="seoTitle" defaultValue={product.title} disabled />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="seoDescription">SEO description</Label>
                <Textarea id="seoDescription" rows={2} disabled />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Files</CardTitle>
            <CardDescription>Uploads are handled by UploadThing (S8).</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Digital asset</Label>
              <div className="flex flex-col items-center gap-1 border border-dashed p-6 text-center text-sm text-muted-foreground">
                <UploadSimpleIcon className="size-5" />
                Drop file or click to upload
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Cover image</Label>
              <div className="flex aspect-16/10 flex-col items-center justify-center gap-1 border border-dashed text-sm text-muted-foreground">
                <UploadSimpleIcon className="size-5" />
                Drop image or click to upload
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
