import "server-only";
import { and, eq } from "drizzle-orm";
import { revalidateTag, updateTag } from "next/cache";

import { db } from "@/db";
import { products } from "@/db/schema";
import { getCurrentUser, requireUser } from "@/lib/dal/auth";
import { tags } from "@/lib/dal/tags";

// Data access for the upload route (app/api/uploadthing). Two moments:
//   1. before the upload: may this user upload to this product?
//   2. after the upload:  record the file on the product (UploadThing's
//      callback — a server-to-server request with NO user session, so the
//      owner comes from step 1, carried along as upload metadata).

// Step 1. null when nobody is signed in, or the product doesn't exist, or it
// belongs to someone else — the route answers with an error in every case.
export async function authorizeProductUpload(
  productId: string,
): Promise<{ ownerId: string; productId: string } | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const [product] = await db
    .select({ id: products.id })
    .from(products)
    .where(and(eq(products.id, productId), eq(products.ownerId, user.id)))
    .limit(1);
  return product ? { ownerId: user.id, productId: product.id } : null;
}

type UploadedFile = { key: string; name: string; size: number };

// Step 2 for the digital asset. Returns the key of the file it replaced (to
// be deleted from UploadThing), or null if there was none.
export async function attachProductFile(
  owner: { ownerId: string; productId: string },
  file: UploadedFile & { type: string },
): Promise<{ replacedKey: string | null }> {
  const [before] = await db
    .select({ fileKey: products.fileKey })
    .from(products)
    .where(and(eq(products.id, owner.productId), eq(products.ownerId, owner.ownerId)))
    .limit(1);

  await db
    .update(products)
    .set({
      fileKey: file.key,
      fileName: file.name,
      fileSizeBytes: file.size,
      type: file.type,
      updatedAt: new Date(),
    })
    .where(and(eq(products.id, owner.productId), eq(products.ownerId, owner.ownerId)));

  refreshProducts(owner.ownerId);
  return { replacedKey: before?.fileKey ?? null };
}

// Step 2 for the cover image (public, so its URL is stored).
export async function attachCoverImage(
  owner: { ownerId: string; productId: string },
  file: UploadedFile & { url: string },
): Promise<{ replacedKey: string | null }> {
  const [before] = await db
    .select({ coverKey: products.coverKey })
    .from(products)
    .where(and(eq(products.id, owner.productId), eq(products.ownerId, owner.ownerId)))
    .limit(1);

  await db
    .update(products)
    .set({ coverKey: file.key, coverUrl: file.url, updatedAt: new Date() })
    .where(and(eq(products.id, owner.productId), eq(products.ownerId, owner.ownerId)));

  refreshProducts(owner.ownerId);
  return { replacedKey: before?.coverKey ?? null };
}

// The callback is a Route Handler, where updateTag isn't available.
// revalidateTag with { expire: 0 } expires the tag right away (Next.js docs:
// the pattern for webhooks), so the edit page shows the file on its refresh.
function refreshProducts(ownerId: string) {
  revalidateTag(tags.products(ownerId), { expire: 0 });
}

// Called by the browser (Server Action) once an upload has finished — the
// callback above has already written the database by then. The callback's
// revalidateTag can run after its request has ended, which Next.js may
// ignore; this updateTag runs inside a normal Server Action, so the edit
// page reliably shows the new file / cover (read-your-own-writes).
export async function refreshMyProducts(): Promise<void> {
  const user = await requireUser();
  updateTag(tags.products(user.id));
}
