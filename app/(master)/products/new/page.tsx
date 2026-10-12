import { NewProductForm } from "@/components/products/new-product-form";
import { Card, CardContent } from "@/components/ui/card";

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          New product
        </h1>
        <p className="text-sm text-muted-foreground">
          Start with the basics — you can add the file and cover next.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardContent>
          {/* Client component: validates as you type and saves through the
              createProductAction Server Action. New products start as Draft. */}
          <NewProductForm />
        </CardContent>
      </Card>
    </div>
  );
}
