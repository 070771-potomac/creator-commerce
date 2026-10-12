"use server";

// Server Actions for products. "use server" turns every exported function
// into an endpoint the browser can call — so each one validates its input
// (zod schema) and checks the user (authActionClient) before doing anything.
import { returnValidationErrors } from "next-safe-action";
import { z } from "zod";

import {
  createProduct,
  deleteProduct,
  duplicateProduct,
  setProductStatus,
  updateProduct,
} from "@/lib/dal/products";
import { refreshMyProducts } from "@/lib/dal/uploads";
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

// After an upload (S8): shows the new file / cover on the edit page.
// No input — it only refreshes the signed-in user's own products.
export const refreshAfterUploadAction = authActionClient.action(async () => {
  await refreshMyProducts();
});

// "Duplicate" on the edit page (S12): returns the copy's id; the browser
// then opens its edit page.
export const duplicateProductAction = authActionClient
  .inputSchema(z.object({ id: z.uuid("Invalid product.") }))
  .action(async ({ parsedInput }) => {
    const result = await duplicateProduct(parsedInput.id);
    if (!result.ok) throw new ActionError("This product no longer exists.");
    return { id: result.id };
  });

// "Delete" on the edit page (S12).
export const deleteProductAction = authActionClient
  .inputSchema(z.object({ id: z.uuid("Invalid product.") }))
  .action(async ({ parsedInput }) => {
    const result = await deleteProduct(parsedInput.id);
    if (!result.ok) {
      throw new ActionError(
        result.error === "has-sales"
          ? "This product has sales, so it can't be deleted. Switch it to Draft to hide it."
          : "This product no longer exists.",
      );
    }
    return { deleted: true };
  });
