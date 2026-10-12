import "server-only";
import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { products, purchases, purchaseStatus, users } from "@/db/schema";
import { requireUser } from "@/lib/dal/auth";
import { formatBytes, formatCents, formatShortDate, shortId } from "@/lib/dal/format";

// ── DTOs ─────────────────────────────────────────────────────────────────

export type PurchaseStatus = (typeof purchaseStatus.enumValues)[number];

export type PurchaseListItem = {
  id: string;
  product: string;
  creatorHandle: string;
  date: string;
  amount: string;
};

export type DownloadItem = {
  id: string;
  product: string;
  file: string;
  type: string;
  size: string;
};

// Same shape as the Order type of components/sales-table.tsx.
export type SaleListItem = {
  id: string; // short order number shown as #ID
  buyer: string;
  product: string;
  date: string;
  status: PurchaseStatus;
  total: string;
};

// ── buyer side ───────────────────────────────────────────────────────────

// /purchases — orders where the signed-in user is the BUYER, newest first.
// Joins: purchases → products (title), purchases → users as seller (handle).
export async function getMyPurchases(): Promise<PurchaseListItem[]> {
  const user = await requireUser();

  const rows = await db
    .select({
      id: purchases.id,
      product: products.title,
      sellerHandle: users.handle,
      createdAt: purchases.createdAt,
      amountCents: purchases.amountCents,
      currency: purchases.currency,
    })
    .from(purchases)
    .innerJoin(products, eq(products.id, purchases.productId))
    .innerJoin(users, eq(users.id, purchases.sellerId))
    .where(eq(purchases.buyerId, user.id))
    .orderBy(desc(purchases.createdAt));

  return rows.map((row) => ({
    id: row.id,
    product: row.product,
    creatorHandle: `@${row.sellerHandle}`,
    date: formatShortDate(row.createdAt),
    amount: formatCents(row.amountCents, row.currency),
  }));
}

// /downloads — files the signed-in user may download: their own purchases,
// and only Paid ones (a refunded or pending order unlocks nothing).
// The download link itself is protected again on the server in S11.
export async function getMyDownloads(): Promise<DownloadItem[]> {
  const user = await requireUser();

  const rows = await db
    .select({
      id: purchases.id,
      product: products.title,
      fileName: products.fileName,
      type: products.type,
      fileSizeBytes: products.fileSizeBytes,
    })
    .from(purchases)
    .innerJoin(products, eq(products.id, purchases.productId))
    .where(and(eq(purchases.buyerId, user.id), eq(purchases.status, "Paid")))
    .orderBy(desc(purchases.createdAt));

  return rows.map((row) => ({
    id: row.id,
    product: row.product,
    file: row.fileName ?? "—",
    type: row.type,
    size: formatBytes(row.fileSizeBytes),
  }));
}

// ── seller side ──────────────────────────────────────────────────────────

// /sales — orders where the signed-in user is the SELLER, newest first.
// Joins users as the BUYER, but selects only the name: the buyer's email
// never leaves the DAL.
export async function getMySales(): Promise<SaleListItem[]> {
  const user = await requireUser();

  const rows = await db
    .select({
      id: purchases.id,
      buyer: users.name,
      product: products.title,
      createdAt: purchases.createdAt,
      status: purchases.status,
      amountCents: purchases.amountCents,
      currency: purchases.currency,
    })
    .from(purchases)
    .innerJoin(products, eq(products.id, purchases.productId))
    .innerJoin(users, eq(users.id, purchases.buyerId))
    .where(eq(purchases.sellerId, user.id))
    .orderBy(desc(purchases.createdAt));

  return rows.map((row) => ({
    id: shortId(row.id),
    buyer: row.buyer,
    product: row.product,
    date: formatShortDate(row.createdAt),
    status: row.status,
    total: formatCents(row.amountCents, row.currency),
  }));
}
