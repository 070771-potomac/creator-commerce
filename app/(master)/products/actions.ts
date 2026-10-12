"use server";

// Server Actions for products. "use server" turns every exported function
// into an endpoint the browser can call — so each one validates its input
// (zod schema) and checks the user (authActionClient) before doing anything.
import { returnValidationErrors } from "next-safe-action";

import { createProduct } from "@/lib/dal/products";
import { authActionClient } from "@/lib/safe-action";
import { createProductSchema } from "@/lib/validations/product";

export const createProductAction = authActionClient
  .inputSchema(createProductSchema) // validated again here, on the server
  .action(async ({ parsedInput }) => {
    // parsedInput is the validated OUTPUT of the schema: trimmed text,
    // lowercase slug, price already converted to cents.
    const result = await createProduct(parsedInput);

    if (!result.ok) {
      // Shown under the slug field, like any other validation message.
      returnValidationErrors(createProductSchema, {
        slug: { _errors: ["You already have a product with this slug."] },
      });
    }
    return { id: result.id };
  });
