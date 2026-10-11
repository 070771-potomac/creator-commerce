import "server-only";

import { requireUser } from "@/lib/dal/auth";
import {
  products,
  purchases,
  users,
  type Purchase,
  type PurchaseStatus,
} from "@/lib/sample-data";

// In S5 these lookups become SQL joins (purchases ⋈ products ⋈ users).
function productOf(purchase: Purchase) {
  return products.find((product) => product.id === purchase.productId);
}

function userById(id: string) {
  return users.find((user) => user.id === id);
}

// ── DTOs ─────────────────────────────────────────────────────────────────

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
  id: string;
  buyer: string;
  product: string;
  date: string;
  status: PurchaseStatus;
  total: string;
};

// ── buyer side ───────────────────────────────────────────────────────────

// /purchases — orders where the signed-in user is the BUYER.
export async function getMyPurchases(): Promise<PurchaseListItem[]> {
  const user = await requireUser();
  return purchases
    .filter((purchase) => purchase.buyerId === user.id)
    .map((purchase) => ({
      id: purchase.id,
      product: productOf(purchase)?.title ?? "Deleted product",
      creatorHandle: `@${userById(purchase.sellerId)?.handle ?? "unknown"}`,
      date: purchase.date,
      amount: purchase.amount,
    }));
}

// /downloads — files the signed-in user may download: their own purchases,
// and only Paid ones (a refunded or pending order unlocks nothing).
// The download link itself is protected again on the server in S11.
export async function getMyDownloads(): Promise<DownloadItem[]> {
  const user = await requireUser();
  return purchases
    .filter((purchase) => purchase.buyerId === user.id && purchase.status === "Paid")
    .flatMap((purchase) => {
      const product = productOf(purchase);
      if (!product) return [];
      return [
        {
          id: purchase.id,
          product: product.title,
          file: product.file,
          type: product.type,
          size: product.size,
        },
      ];
    });
}

// ── seller side ──────────────────────────────────────────────────────────

// /sales — orders where the signed-in user is the SELLER. The buyer's email
// stays out of the DTO: the seller only sees the name.
export async function getMySales(): Promise<SaleListItem[]> {
  const user = await requireUser();
  return purchases
    .filter((purchase) => purchase.sellerId === user.id)
    .map((purchase) => ({
      id: purchase.id,
      buyer: userById(purchase.buyerId)?.name ?? "Unknown buyer",
      product: productOf(purchase)?.title ?? "Deleted product",
      date: purchase.date,
      status: purchase.status,
      total: purchase.amount,
    }));
}
