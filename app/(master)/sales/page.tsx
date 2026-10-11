import { SalesTable } from "@/components/sales-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardMetrics } from "@/lib/dal/metrics";
import { getMySales } from "@/lib/dal/purchases";

export default async function SalesPage() {
  // Only orders where the signed-in user is the seller (filtered in the DAL).
  const orders = await getMySales();
  // Same numbers as /dashboard, computed from the same sales.
  const metrics = await getDashboardMetrics();
  const summary = [
    { title: "Revenue", value: metrics.revenue },
    { title: "Orders", value: String(metrics.orders) },
    { title: "Avg. order", value: metrics.averageOrder },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Sales
        </h1>
        <p className="text-sm text-muted-foreground">
          Every order across your products.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {summary.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardDescription>{item.title}</CardDescription>
              <CardTitle className="text-2xl tabular-nums">{item.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent>
          <SalesTable orders={orders} />
        </CardContent>
      </Card>
    </div>
  );
}
