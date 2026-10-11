import "server-only";

import { requireUser } from "@/lib/dal/auth";
import { products, purchases } from "@/lib/sample-data";

// Every number on /dashboard and /sales is computed here from the purchases
// table — the single source of truth. Nothing is typed by hand on the page.
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

// Amounts are strings like "$24.00" in the sample data. In S5 they are stored
// as integer cents, so this parsing disappears; summing cents avoids
// floating-point errors like 0.1 + 0.2 = 0.30000000000000004.
function toCents(amount: string): number {
  return Math.round(Number(amount.replace(/[$,]/g, "")) * 100);
}

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const user = await requireUser();

  // Only the signed-in user's side of the purchases table: their sales.
  const sales = purchases.filter((purchase) => purchase.sellerId === user.id);
  const paid = sales.filter((sale) => sale.status === "Paid");
  const revenueCents = paid.reduce((sum, sale) => sum + toCents(sale.amount), 0);

  const myProducts = products.filter((product) => product.ownerId === user.id);

  // Units and revenue per product, from Paid sales only.
  const topProducts = myProducts
    .map((product) => {
      const productSales = paid.filter((sale) => sale.productId === product.id);
      const cents = productSales.reduce((sum, sale) => sum + toCents(sale.amount), 0);
      return { title: product.title, units: productSales.length, cents };
    })
    .filter((row) => row.units > 0)
    .sort((a, b) => b.cents - a.cents)
    .slice(0, 5)
    .map(({ title, units, cents }) => ({ title, units, revenue: formatCents(cents) }));

  return {
    revenue: formatCents(revenueCents),
    unitsSold: paid.length,
    orders: sales.length,
    pendingOrders: sales.filter((sale) => sale.status === "Pending").length,
    refundedOrders: sales.filter((sale) => sale.status === "Refunded").length,
    averageOrder: formatCents(paid.length ? Math.round(revenueCents / paid.length) : 0),
    publishedProducts: myProducts.filter((product) => product.status === "Published").length,
    draftProducts: myProducts.filter((product) => product.status === "Draft").length,
    topProducts,
  };
}
