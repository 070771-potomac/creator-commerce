import "server-only";
import { and, desc, eq, gt, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

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
  revenue: string; // in the currency it was sold in, e.g. "RON 31.00"
};

// One currency's money. Amounts in different currencies are never added
// together — $10 + RON 10 is not "20" of anything.
export type CurrencyRevenue = {
  currency: string; // "USD", "RON"…
  revenue: string; // "$75.00"
  units: number; // paid orders in this currency
  averageOrder: string;
};

// Daily revenue for the chart (S12): one series per currency, 30 days.
export type RevenueSeries = {
  currency: string;
  total: string; // over the 30 days
  days: { date: string; label: string; cents: number; amount: string; units: number }[];
};

export type DashboardMetrics = {
  revenue: string; // per currency, e.g. "$75.00 · RON 31.00"
  unitsSold: number; // Paid sales, all currencies
  orders: number; // all sales, any status
  pendingOrders: number;
  refundedOrders: number;
  averageOrder: string; // per currency, like revenue
  revenueByCurrency: CurrencyRevenue[];
  dailyRevenue: RevenueSeries[]; // last 30 days, one per currency sold in
  publishedProducts: number;
  draftProducts: number;
  topProducts: TopProduct[]; // up to 5, by units sold
};

export const REVENUE_DAYS = 30;

// Postgres returns sums and counts as strings/bigints; mapWith(Number) makes
// them plain numbers. Amounts are integer cents, so the sums are exact.
const countWhere = (condition: ReturnType<typeof sql>) =>
  sql<number>`count(*) filter (where ${condition})`.mapWith(Number);

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const user = await requireUser();
  return metricsOf(user.id);
}

// Cached per seller. Refreshed when their sales change (S10 webhook) or
// their products change (S7 forms) — and at least hourly (cacheLife), because
// "the last 30 days" moves on even when nothing is sold.
async function metricsOf(userId: string): Promise<DashboardMetrics> {
  "use cache";
  cacheLife("hours");
  cacheTag(tags.sales(userId), tags.products(userId));
  const isPaid = and(eq(purchases.sellerId, userId), eq(purchases.status, "Paid"));

  // The queries are independent, so they run in parallel.
  const [[orders], [catalog], byCurrency, topRows, dailyRows] = await Promise.all([
    // 1) Order counts over the user's sales (seller side of purchases).
    db
      .select({
        paid: countWhere(sql`${purchases.status} = 'Paid'`),
        all: sql<number>`count(*)`.mapWith(Number),
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

    // 3) Paid revenue per currency.
    db
      .select({
        currency: purchases.currency,
        cents: sql<number>`sum(${purchases.amountCents})`.mapWith(Number),
        units: sql<number>`count(*)`.mapWith(Number),
      })
      .from(purchases)
      .where(isPaid)
      .groupBy(purchases.currency)
      .orderBy(desc(sql`count(*)`)),

    // 4) Top products: ranked by units (comparable across currencies),
    //    revenue kept per currency.
    db
      .select({
        id: products.id,
        title: products.title,
        currency: purchases.currency,
        units: sql<number>`count(*)`.mapWith(Number),
        cents: sql<number>`sum(${purchases.amountCents})`.mapWith(Number),
      })
      .from(purchases)
      .innerJoin(products, eq(products.id, purchases.productId))
      .where(isPaid)
      .groupBy(products.id, products.title, purchases.currency),

    // 5) Paid revenue per day (UTC) and currency, last 30 days.
    db
      .select({
        day: sql<string>`to_char(date_trunc('day', ${purchases.createdAt} at time zone 'UTC'), 'YYYY-MM-DD')`,
        currency: purchases.currency,
        cents: sql<number>`sum(${purchases.amountCents})`.mapWith(Number),
        units: sql<number>`count(*)`.mapWith(Number),
      })
      .from(purchases)
      .where(and(isPaid, gt(purchases.createdAt, sql`now() - make_interval(days => ${REVENUE_DAYS})`)))
      .groupBy(sql`1`, purchases.currency),
  ]);

  const revenueByCurrency = byCurrency.map((row) => ({
    currency: row.currency,
    revenue: formatCents(row.cents, row.currency),
    units: row.units,
    averageOrder: formatCents(Math.round(row.cents / row.units), row.currency),
  }));
  const joined = (pick: (row: CurrencyRevenue) => string) =>
    revenueByCurrency.length ? revenueByCurrency.map(pick).join(" · ") : formatCents(0);

  return {
    revenue: joined((row) => row.revenue),
    unitsSold: orders.paid,
    orders: orders.all,
    pendingOrders: orders.pending,
    refundedOrders: orders.refunded,
    averageOrder: joined((row) => row.averageOrder),
    revenueByCurrency,
    dailyRevenue: buildDailySeries(dailyRows),
    publishedProducts: catalog.published,
    draftProducts: catalog.draft,
    topProducts: rankTopProducts(topRows),
  };
}

// Merges the per-currency rows of each product, then keeps the 5 best
// sellers by units.
function rankTopProducts(
  rows: { id: string; title: string; currency: string; units: number; cents: number }[],
): TopProduct[] {
  const byProduct = new Map<string, { title: string; units: number; parts: { currency: string; cents: number }[] }>();
  for (const row of rows) {
    const entry = byProduct.get(row.id) ?? { title: row.title, units: 0, parts: [] };
    entry.units += row.units;
    entry.parts.push({ currency: row.currency, cents: row.cents });
    byProduct.set(row.id, entry);
  }
  return [...byProduct.values()]
    .sort((a, b) => b.units - a.units || a.title.localeCompare(b.title))
    .slice(0, 5)
    .map((entry) => ({
      title: entry.title,
      units: entry.units,
      revenue: entry.parts.map((part) => formatCents(part.cents, part.currency)).join(" · "),
    }));
}

// The database only returns days WITH sales; the chart needs all 30 days,
// so the missing ones are filled with zero.
function buildDailySeries(
  rows: { day: string; currency: string; cents: number; units: number }[],
): RevenueSeries[] {
  const today = new Date();
  const days: string[] = [];
  for (let i = REVENUE_DAYS - 1; i >= 0; i--) {
    const day = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i));
    days.push(day.toISOString().slice(0, 10));
  }

  const currencies = [...new Set(rows.map((row) => row.currency))].sort();
  return currencies.map((currency) => {
    const byDay = new Map(rows.filter((row) => row.currency === currency).map((row) => [row.day, row]));
    const series = days.map((date) => {
      const row = byDay.get(date);
      const cents = row?.cents ?? 0;
      return {
        date,
        label: new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        }),
        cents,
        amount: formatCents(cents, currency),
        units: row?.units ?? 0,
      };
    });
    const total = series.reduce((sum, day) => sum + day.cents, 0);
    return { currency, total: formatCents(total, currency), days: series };
  });
}
