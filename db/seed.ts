// Seed script: loads the sample data from lib/sample-data.ts into Neon.
// Run with: npm run db:seed
//
// It EMPTIES the tables first, then inserts everything, so it can be run
// again at any time and always produces the same data.

import { randomUUID } from "node:crypto";

import { loadEnvConfig } from "@next/env";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import {
  follows as sampleFollows,
  products as sampleProducts,
  purchases as samplePurchases,
  users as sampleUsers,
  wishlist as sampleWishlist,
} from "../lib/sample-data";
import * as schema from "./schema";

// A command-line script runs outside Next.js, so load .env.local ourselves.
// (It can't import db/index.ts: that file is "server-only", which only works
// inside Next.js.)
loadEnvConfig(process.cwd());

if (process.env.NODE_ENV === "production") {
  throw new Error("Refusing to seed: this script deletes all data.");
}
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Add it to .env.local.");
}

const db = drizzle({ client: neon(process.env.DATABASE_URL), schema });

// ── conversions from the sample format to the database format ───────────

// "$24.00" → 2400
function toCents(amount: string): number {
  return Math.round(Number(amount.replace(/[$,]/g, "")) * 100);
}

// "18.2 MB" → 19084083 (bytes)
function toBytes(size: string): number {
  const [value, unit] = size.split(" ");
  const factor = unit === "GB" ? 1024 ** 3 : unit === "MB" ? 1024 ** 2 : 1024;
  return Math.round(Number(value) * factor);
}

// "Jul 10" → 2026-07-10 12:00 UTC (the sample dates have no year).
function toDate(label: string): Date {
  return new Date(`${label} 2026 12:00:00 UTC`);
}

// Sample product ids are "1".."12"; the database uses UUIDs.
// Map each old id to a new UUID so purchases/wishlist keep pointing right.
const productIds = new Map(sampleProducts.map((p) => [p.id, randomUUID()]));
function productUuid(sampleId: string): string {
  const id = productIds.get(sampleId);
  if (!id) throw new Error(`Unknown sample product id: ${sampleId}`);
  return id;
}

async function main() {
  const users = sampleUsers.map((u) => ({
    id: u.id,
    name: u.name,
    handle: u.handle,
    bio: u.bio,
    email: u.email,
  }));

  const products = sampleProducts.map((p) => ({
    id: productUuid(p.id),
    ownerId: p.ownerId,
    slug: p.slug,
    title: p.title,
    description: p.description,
    type: p.type,
    priceCents: toCents(p.price),
    status: p.status,
    fileName: p.file,
    fileSizeBytes: toBytes(p.size),
  }));

  const purchases = samplePurchases.map((p) => ({
    buyerId: p.buyerId,
    sellerId: p.sellerId,
    productId: productUuid(p.productId),
    amountCents: toCents(p.amount),
    status: p.status,
    createdAt: toDate(p.date),
  }));

  const wishlist = sampleWishlist.map((w) => ({
    userId: w.userId,
    productId: productUuid(w.productId),
  }));

  const follows = sampleFollows.map((f) => ({
    followerId: f.followerId,
    followingId: f.followingId,
  }));

  // One batch = one transaction: if any statement fails, nothing changes.
  // Delete children before parents (foreign keys), insert parents first.
  await db.batch([
    db.delete(schema.wishlistItems),
    db.delete(schema.follows),
    db.delete(schema.purchases),
    db.delete(schema.products),
    db.delete(schema.users),
    db.insert(schema.users).values(users),
    db.insert(schema.products).values(products),
    db.insert(schema.purchases).values(purchases),
    db.insert(schema.wishlistItems).values(wishlist),
    db.insert(schema.follows).values(follows),
  ]);

  console.log(
    `Seeded: ${users.length} users, ${products.length} products, ` +
      `${purchases.length} purchases, ${wishlist.length} wishlist items, ${follows.length} follows.`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  // Never print the connection string if it appears in an error.
  console.error("Seed failed:", message.replace(/postgres(ql)?:\/\/\S+/g, "[hidden]"));
  process.exit(1);
});
