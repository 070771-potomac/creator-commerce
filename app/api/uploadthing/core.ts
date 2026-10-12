// The UploadThing "file router": which kinds of upload exist, their limits,
// who may upload, and what happens when a file has arrived.
//
// Flow of one upload:
//   browser → POST /api/uploadthing   (middleware below: auth + owner check)
//   browser → UploadThing storage     (the file itself, never via our server)
//   UploadThing → /api/uploadthing    (onUploadComplete: save to the product)
import { randomBytes } from "node:crypto";
import { createUploadthing, UTFiles, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";

import { attachCoverImage, attachProductFile, authorizeProductUpload } from "@/lib/dal/uploads";
import { utapi } from "@/lib/utapi";

const f = createUploadthing();

// Every upload names the product it belongs to.
const productInput = z.object({ productId: z.uuid() });

// Shared "before the upload" step for both routes.
async function authorize(productId: string, files: readonly { name: string }[], kind: string) {
  const owner = await authorizeProductUpload(productId);
  // Same answer for "not signed in", "no such product" and "not yours", so
  // nobody learns whether another creator's product id exists.
  if (!owner) throw new UploadThingError({ code: "FORBIDDEN", message: "You can't upload to this product." });

  return {
    ...owner, // passed to onUploadComplete as `metadata`
    // Prefix per owner: every file's customId starts with the owner's user id
    // and the product id, so in the UploadThing dashboard (and in any later
    // cleanup) it's clear whose file it is.
    [UTFiles]: files.map((file) => ({
      ...file,
      customId: `${owner.ownerId}_${owner.productId}_${kind}_${randomBytes(6).toString("hex")}`,
    })),
  };
}

// Deleting the replaced file is cleanup: if it fails, the new file is already
// saved, so log it instead of failing the upload.
async function deleteReplaced(key: string | null) {
  if (!key) return;
  try {
    await utapi.deleteFiles(key);
  } catch (error) {
    console.error("Couldn't delete replaced upload", key, error);
  }
}

// MIME type → the product type shown on the storefront (PDF, ZIP).
function productTypeOf(mime: string) {
  return mime === "application/pdf" ? "PDF" : "ZIP";
}

export const uploadRouter = {
  // The digital asset buyers get after paying: one PDF or ZIP, up to 64 MB.
  productAsset: f({
    pdf: { maxFileSize: "64MB", maxFileCount: 1 },
    "application/zip": { maxFileSize: "64MB", maxFileCount: 1 },
  })
    .input(productInput)
    .middleware(({ input, files }) => authorize(input.productId, files, "asset"))
    .onUploadComplete(async ({ metadata, file }) => {
      const { replacedKey } = await attachProductFile(metadata, {
        key: file.key,
        name: file.name,
        size: file.size,
        type: productTypeOf(file.type),
      });
      if (replacedKey !== file.key) await deleteReplaced(replacedKey);
      // Sent back to the browser: no URL — the asset's location stays private.
      return { name: file.name, size: file.size };
    }),

  // The public cover image: one image, up to 4 MB.
  coverImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .input(productInput)
    .middleware(({ input, files }) => authorize(input.productId, files, "cover"))
    .onUploadComplete(async ({ metadata, file }) => {
      const { replacedKey } = await attachCoverImage(metadata, {
        key: file.key,
        name: file.name,
        size: file.size,
        url: file.ufsUrl,
      });
      if (replacedKey !== file.key) await deleteReplaced(replacedKey);
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
