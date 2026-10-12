"use client";

// The "Edit product" form. Same pattern as NewProductForm: React Hook Form +
// the zod schema in the browser, next-safe-action → updateProductAction on
// the server (validated again, owner checked in the DAL).
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { updateProductAction } from "@/app/(master)/products/actions";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
// `import type` only: the DAL is server-only, but its types are erased at build.
import type { ProductForEdit } from "@/lib/dal/products";
import {
  CURRENCIES,
  SEO_DESCRIPTION_MAX,
  SEO_TITLE_MAX,
  updateProductSchema,
  type UpdateProductInput,
  type UpdateProductOutput,
} from "@/lib/validations/product";

export function EditProductForm({ product }: { product: ProductForEdit }) {
  const router = useRouter();
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const form = useForm<UpdateProductInput, unknown, UpdateProductOutput>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.priceAmount,
      currency: product.currency,
      status: product.status,
      seoTitle: product.seoTitle,
      seoDescription: product.seoDescription,
    },
    mode: "onTouched",
  });
  const { errors, isDirty } = form.formState;
  // Live values for the counters and the search preview.
  // useWatch (not form.watch) re-renders safely with the React Compiler.
  const [title, description, seoTitle, seoDescription] = useWatch({
    control: form.control,
    name: ["title", "description", "seoTitle", "seoDescription"],
  });

  const { execute, isExecuting, result } = useAction(updateProductAction, {
    onSuccess: () => {
      // The saved values become the new "original" → Save is disabled again
      // until something changes.
      form.reset(form.getValues());
      setSavedAt(new Date().toLocaleTimeString());
      // Re-render the server parts of the page (status badge, View page).
      router.refresh();
    },
    onError: ({ error }) => {
      const fieldErrors = error.validationErrors;
      if (fieldErrors) {
        for (const name of ["title", "description", "price", "currency", "status", "seoTitle", "seoDescription"] as const) {
          const message = fieldErrors[name]?._errors?.[0];
          if (message) form.setError(name, { message });
        }
      }
    },
  });

  const onSubmit = form.handleSubmit(() => {
    setSavedAt(null);
    execute(form.getValues());
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <Field data-invalid={Boolean(errors.title)}>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <Input id="title" aria-invalid={Boolean(errors.title)} {...form.register("title")} />
        <FieldError errors={[errors.title]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="slug">Slug</FieldLabel>
        <Input id="slug" value={product.slug} disabled readOnly />
        <FieldDescription>
          Fixed after creation, so links you already shared keep working.
        </FieldDescription>
      </Field>

      <Field data-invalid={Boolean(errors.description)}>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Textarea
          id="description"
          rows={4}
          aria-invalid={Boolean(errors.description)}
          {...form.register("description")}
        />
        <FieldError errors={[errors.description]} />
      </Field>

      <div className="grid grid-cols-[1fr_8rem] gap-4">
        <Field data-invalid={Boolean(errors.price)}>
          <FieldLabel htmlFor="price">Price</FieldLabel>
          <Input
            id="price"
            inputMode="decimal"
            aria-invalid={Boolean(errors.price)}
            {...form.register("price")}
          />
          <FieldError errors={[errors.price]} />
        </Field>

        <Controller
          control={form.control}
          name="currency"
          render={({ field }) => (
            <Field data-invalid={Boolean(errors.currency)}>
              <FieldLabel htmlFor="currency">Currency</FieldLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  if (form.getValues("price")) void form.trigger("price");
                }}
              >
                <SelectTrigger id="currency" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[errors.currency]} />
            </Field>
          )}
        />
      </div>

      {/* The status is a Draft/Published string in the schema; the switch
          maps it to on/off. */}
      <Controller
        control={form.control}
        name="status"
        render={({ field }) => (
          <Field orientation="horizontal">
            <Switch
              id="published"
              checked={field.value === "Published"}
              onCheckedChange={(checked) => field.onChange(checked ? "Published" : "Draft")}
            />
            <FieldLabel htmlFor="published">Published</FieldLabel>
            <FieldDescription>
              {field.value === "Published"
                ? "Visible on your public storefront."
                : "Draft — only you can see it."}
            </FieldDescription>
          </Field>
        )}
      />

      {/* Search engines (S13): optional; empty = use title / description. */}
      <FieldSeparator>Search engines</FieldSeparator>

      <Field data-invalid={Boolean(errors.seoTitle)}>
        <div className="flex items-baseline justify-between gap-2">
          <FieldLabel htmlFor="seoTitle">SEO title</FieldLabel>
          <CharCount value={seoTitle} max={SEO_TITLE_MAX} />
        </div>
        <Input
          id="seoTitle"
          placeholder={title}
          aria-invalid={Boolean(errors.seoTitle)}
          {...form.register("seoTitle")}
        />
        <FieldError errors={[errors.seoTitle]} />
      </Field>

      <Field data-invalid={Boolean(errors.seoDescription)}>
        <div className="flex items-baseline justify-between gap-2">
          <FieldLabel htmlFor="seoDescription">SEO description</FieldLabel>
          <CharCount value={seoDescription} max={SEO_DESCRIPTION_MAX} />
        </div>
        <Textarea
          id="seoDescription"
          rows={2}
          placeholder={description}
          aria-invalid={Boolean(errors.seoDescription)}
          {...form.register("seoDescription")}
        />
        <FieldDescription>Leave empty to use the title and description above.</FieldDescription>
        <FieldError errors={[errors.seoDescription]} />
      </Field>

      {/* How the product may look in Google's results (approximation). */}
      <div aria-label="Search result preview" className="flex flex-col gap-0.5 border p-3">
        <span className="truncate text-xs text-muted-foreground">
          localhost:3000 › {product.publicUrl.slice(1).split("/").join(" › ")}
        </span>
        <span className="truncate text-base text-primary">
          {(seoTitle.trim() || title).slice(0, SEO_TITLE_MAX)} · My-E-Commerce
        </span>
        <span className="line-clamp-2 text-xs text-muted-foreground">
          {(seoDescription.trim() || description || "No description yet.").slice(0, SEO_DESCRIPTION_MAX)}
        </span>
      </div>

      {result.serverError ? (
        <p role="alert" className="text-sm text-destructive">
          {result.serverError}
        </p>
      ) : null}

      <div className="mt-2 flex items-center gap-3">
        <Button type="submit" disabled={isExecuting || !isDirty}>
          {isExecuting ? "Saving…" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={isExecuting || !isDirty}
          onClick={() => form.reset()}
        >
          Discard
        </Button>
        {savedAt && !isDirty ? (
          <span role="status" className="text-sm text-muted-foreground">
            Saved at {savedAt}
          </span>
        ) : null}
      </div>
    </form>
  );
}

// "42 / 60", turning red past the limit.
function CharCount({ value, max }: { value: string; max: number }) {
  const length = value.trim().length;
  return (
    <span className={length > max ? "text-xs tabular-nums text-destructive" : "text-xs tabular-nums text-muted-foreground"}>
      {length} / {max}
    </span>
  );
}
