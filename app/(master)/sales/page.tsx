import { SalesTable, type Order } from "@/components/sales-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Sample data until sales come from the database (S10, S12).
const summary = [
  { title: "This month", value: "$8,240" },
  { title: "Orders", value: "214" },
  { title: "Avg. order", value: "$38.50" },
];

const orders: Order[] = [
  { id: "1042", buyer: "Ada Lovelace", product: "Notion Dashboard Kit", date: "Jul 14", status: "Paid", total: "$24.00" },
  { id: "1041", buyer: "Alan Turing", product: "Icon Set — 300 SVG", date: "Jul 14", status: "Paid", total: "$9.00" },
  { id: "1040", buyer: "Grace Hopper", product: "Portfolio Template", date: "Jul 13", status: "Refunded", total: "$29.00" },
  { id: "1039", buyer: "Katherine J.", product: "Wallpaper Bundle", date: "Jul 13", status: "Pending", total: "$6.00" },
];

export default function SalesPage() {
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
