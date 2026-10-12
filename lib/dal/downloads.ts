import "server-only";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { products, purchases } from "@/db/schema";
import { getCurrentUser } from "@/lib/dal/auth";
import { isUuid } from "@/lib/dal/format";

// Access check for one download (S11), used by /api/downloads/[purchaseId].
// Deliberately NOT cached: a refund or a change of the file must take effect
// on the very next click, so every download reads the database.

export type DownloadAccess =
  | { kind: "login" } // not signed in
  | { kind: "not-found" } // no such purchase, someone else's, or not Paid
  | { kind: "no-file" } // the seller hasn't uploaded the file yet
  | { kind: "ok"; userId: string; fileKey: string; fileName: string; sizeBytes: number | null };

export async function getDownloadAccess(purchaseId: string): Promise<DownloadAccess> {
  const user = await getCurrentUser();
  if (!user) return { kind: "login" };
  if (!isUuid(purchaseId)) return { kind: "not-found" };

  const [row] = await db
    .select({
      fileKey: products.fileKey,
      fileName: products.fileName,
      sizeBytes: products.fileSizeBytes,
    })
    .from(purchases)
    .innerJoin(products, eq(products.id, purchases.productId))
    .where(
      and(
        eq(purchases.id, purchaseId),
        // The buyer check is part of the query: someone else's purchase id
        // finds nothing, exactly like an id that doesn't exist.
        eq(purchases.buyerId, user.id),
        // Refunded (or Pending) purchases don't unlock the file.
        eq(purchases.status, "Paid"),
      ),
    )
    .limit(1);

  if (!row) return { kind: "not-found" };
  if (!row.fileKey || !row.fileName) return { kind: "no-file" };
  return { kind: "ok", userId: user.id, fileKey: row.fileKey, fileName: row.fileName, sizeBytes: row.sizeBytes };
}
