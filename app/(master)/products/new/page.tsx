import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const currencies = ["USD", "EUR", "RON"];

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
          {/* Saved with a server action, validated with zod (S7). */}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="Notion Dashboard Kit" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" placeholder="notion-dashboard-kit" required />
              <p className="text-xs text-muted-foreground">
                Used in the product URL: /@handle/slug
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Short description</Label>
              <Textarea id="description" name="description" rows={3} />
            </div>
            <div className="grid grid-cols-[1fr_8rem] gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="24.00"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="currency">Currency</Label>
                <Select name="currency" defaultValue="USD">
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              <Button type="submit">Create product</Button>
              <Button variant="ghost" nativeButton={false} render={<Link href="/products" />}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
