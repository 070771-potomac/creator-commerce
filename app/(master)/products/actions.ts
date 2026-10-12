"use server";

// Server Actions for products. "use server" turns every exported function
// into an endpoint the browser can call — so each one validates its input
// (zod schema) and checks the user (authActionClient) before doing anything.
import { returnValidationErrors } from "next-safe-action";

import { createProduct, setProductStatus, updateProduct } from "@/lib/dal/products";
import { ActionError, authActionClient } from "@/lib/safe-action";
import {
  createProductSchema,
  setProductStatusSchema,
  updateProductSchema,
} from "@/lib/validations/product";

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

export const updateProductAction = authActionClient
  .inputSchema(updateProductSchema)
  .action(async ({ parsedInput }) => {
    const result = await updateProduct(parsedInput);
    if (!result.ok) {
      // Deleted meanwhile, or not this user's product: same safe message,
      // so nobody learns whether someone else's product id exists.
      throw new ActionError("This product no longer exists.");
    }
    return { saved: true };
  });

export const setProductStatusAction = authActionClient
  .inputSchema(setProductStatusSchema)
  .action(async ({ parsedInput }) => {
    const result = await setProductStatus(parsedInput);
    if (!result.ok) throw new ActionError("This product no longer exists.");
    // The confirmed status: the switch keeps it once the server agrees.
    return { status: parsedInput.status };
  });
