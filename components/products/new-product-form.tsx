"use client";

// The "New product" form. React Hook Form holds the values and errors, the
// zod schema validates them as you type, and next-safe-action sends them to
// the server action (which validates again and saves).
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { Controller, useForm } from "react-hook-form";

import { createProductAction } from "@/app/(master)/products/actions";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CURRENCIES,
  createProductSchema,
  slugify,
  type CreateProductInput,
  type CreateProductOutput,
} from "@/lib/validations/product";

export function NewProductForm() {
  const router = useRouter();

  const form = useForm<CreateProductInput, unknown, CreateProductOutput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: { title: "", slug: "", description: "", price: "", currency: "USD" },
    mode: "onTouched", // show a field's error once you leave it, then live
  });
  const { errors } = form.formState;

  const { execute, isExecuting, result } = useAction(createProductAction, {
    onSuccess: ({ data }) => {
      if (data) router.push(`/products/${data.id}`); // continue on the edit page
    },
    onError: ({ error }) => {
      // Errors found by the server (e.g. slug already used) go under the
      // matching field, exactly like browser-side validation errors.
      const fieldErrors = error.validationErrors;
      if (fieldErrors) {
        for (const name of ["title", "slug", "description", "price", "currency"] as const) {
          const message = fieldErrors[name]?._errors?.[0];
          if (message) form.setError(name, { message });
        }
      }
    },
  });

  // Suggest a slug from the title until the user edits the slug themselves.
  function onTitleChange(title: string) {
    if (!form.getFieldState("slug").isDirty) {
      form.setValue("slug", slugify(title), { shouldValidate: form.formState.isSubmitted });
    }
  }

  // handleSubmit validates in the browser first; only valid data is sent.
  // We send the raw values (price as text): the server parses them itself.
  const onSubmit = form.handleSubmit(() => execute(form.getValues()));

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <Field data-invalid={Boolean(errors.title)}>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <Input
          id="title"
          placeholder="Notion Dashboard Kit"
          aria-invalid={Boolean(errors.title)}
          {...form.register("title", { onChange: (e) => onTitleChange(e.target.value) })}
        />
        <FieldError errors={[errors.title]} />
      </Field>

      <Field data-invalid={Boolean(errors.slug)}>
        <FieldLabel htmlFor="slug">Slug</FieldLabel>
        <Input
          id="slug"
          placeholder="notion-dashboard-kit"
          aria-invalid={Boolean(errors.slug)}
          {...form.register("slug")}
        />
        <FieldDescription>Used in the product URL: /@handle/slug. Can&apos;t be changed later.</FieldDescription>
        <FieldError errors={[errors.slug]} />
      </Field>

      <Field data-invalid={Boolean(errors.description)}>
        <FieldLabel htmlFor="description">Short description</FieldLabel>
        <Textarea
          id="description"
          rows={3}
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
            placeholder="24.00"
            aria-invalid={Boolean(errors.price)}
            {...form.register("price")}
          />
          <FieldError errors={[errors.price]} />
        </Field>

        {/* Select isn't a plain <input>, so React Hook Form drives it
            through a Controller (value + onChange). */}
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
                  // The minimum price depends on the currency: re-check it.
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

      {result.serverError ? (
        <p role="alert" className="text-sm text-destructive">
          {result.serverError}
        </p>
      ) : null}

      <div className="mt-2 flex gap-2">
        <Button type="submit" disabled={isExecuting}>
          {isExecuting ? "Creating…" : "Create product"}
        </Button>
        <Button variant="ghost" nativeButton={false} render={<Link href="/products" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
