import "server-only";
import { and, desc, eq, sql } from "drizzle-orm";
import { cacheTag } from "next/cache";

import { db } from "@/db";
import { products, purchases } from "@/db/schema";
import { requireUser } from "@/lib/dal/auth";
import { formatCents } from "@/lib/dal/format";
import { tags } from "@/lib/dal/tags";

// Every number on /dashboard and /sales is computed here by the database
// from the purchases table — the single source of truth.
//
// The README names this getDashboardMetrics(userId). Here the userId comes
// from requireUser() instead of a parameter, so no caller can ask for
// another creator's numbers by passing a different id.

export type TopProduct = {
  title: string;
  units: number;
  revenue: string;
};

export type DashboardMetrics = {
  revenue: string; // sum of Paid sales
  unitsSold: number; // Paid sales
  orders: number; // all sales, any status
  pendingOrders: number;
  refundedOrders: number;
  averageOrder: string; // revenue / units sold
  publishedProducts: number;
  draftProducts: number;
  topProducts: TopProduct[]; // up to 5, by revenue
};

// Postgres returns sums and counts as strings/bigints; mapWith(Number) makes
// them plain numbers. Amounts are integer cents, so the sums are exact.
const countWhere = (condition: ReturnType<typeof sql>) =>
  sql<number>`count(*) filter (where ${condition})`.mapWith(Number);

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const user = await requireUser();
  return metricsOf(user.id);
}

// Cached per seller. Refreshed when their sales change (S10 webhook) or
// their products change (S7 forms).
async function metricsOf(userId: string): Promise<DashboardMetrics> {
  "use cache";
  cacheTag(tags.sales(userId), tags.products(userId));
  const isPaid = sql`${purchases.status} = 'Paid'`;

  // The three queries are independent, so they run in parallel.
  const [[sales], [catalog], top] = await Promise.all([
    // 1) Totals over the user's sales (seller side of purchases).
    db
      .select({
        revenueCents: sql<number>`coalesce(sum(${purchases.amountCents}) filter (where ${isPaid}), 0)`.mapWith(Number),
        paid: countWhere(isPaid),
        orders: sql<number>`count(*)`.mapWith(Number),
        pending: countWhere(sql`${purchases.status} = 'Pending'`),
        refunded: countWhere(sql`${purchases.status} = 'Refunded'`),
      })
      .from(purchases)
      .where(eq(purchases.sellerId, userId)),

    // 2) The user's products by status.
    db
      .select({
        published: countWhere(sql`${products.status} = 'Published'`),
        draft: countWhere(sql`${products.status} = 'Draft'`),
      })
      .from(products)
      .where(eq(products.ownerId, userId)),

    // 3) Top 5 products by paid revenue.
    db
      .select({
        title: products.title,
        units: sql<number>`count(*)`.mapWith(Number),
        cents: sql<number>`sum(${purchases.amountCents})`.mapWith(Number),
      })
      .from(purchases)
      .innerJoin(products, eq(products.id, purchases.productId))
      .where(and(eq(purchases.sellerId, userId), eq(purchases.status, "Paid")))
      .groupBy(products.id, products.title)
      .orderBy(desc(sql`sum(${purchases.amountCents})`))
      .limit(5),
  ]);

  return {
    revenue: formatCents(sales.revenueCents),
    unitsSold: sales.paid,
    orders: sales.orders,
    pendingOrders: sales.pending,
    refundedOrders: sales.refunded,
    averageOrder: formatCents(sales.paid ? Math.round(sales.revenueCents / sales.paid) : 0),
    publishedProducts: catalog.published,
    draftProducts: catalog.draft,
    topProducts: top.map((row) => ({
      title: row.title,
      units: row.units,
      revenue: formatCents(row.cents),
    })),
  };
}
