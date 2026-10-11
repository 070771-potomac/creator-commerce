import Link from "next/link";
import {
  CurrencyDollarIcon,
  ReceiptIcon,
  PackageIcon,
  PlusIcon,
} from "@phosphor-icons/react/ssr";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getDashboardMetrics } from "@/lib/dal/metrics";

export default async function DashboardPage() {
  // All numbers are computed in the DAL from the user's own sales.
  const metrics = await getDashboardMetrics();

  const stats = [
    {
      title: "Revenue",
      value: metrics.revenue,
      detail: `from ${metrics.unitsSold} paid orders`,
      icon: CurrencyDollarIcon,
    },
    {
      title: "Orders",
      value: String(metrics.orders),
      detail: `${metrics.pendingOrders} pending · ${metrics.refundedOrders} refunded`,
      icon: ReceiptIcon,
    },
    {
      title: "Published products",
      value: String(metrics.publishedProducts),
      detail: `${metrics.draftProducts} draft`,
      icon: PackageIcon,
    },
  ];

  // "Publish" is ticked from real data; the others become real in S6 (account)
  // and S9 (Stripe).
  const checklist = [
    { id: "account", label: "Create your account", done: true },
    { id: "handle", label: "Pick your handle", done: true },
    { id: "publish", label: "Publish your first product", done: metrics.publishedProducts > 0 },
    { id: "stripe", label: "Connect Stripe", done: false },
    { id: "share", label: "Share your storefront", done: false },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Your store performance at a glance.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/products/new" />}>
          <PlusIcon />
          New product
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader>
              <CardDescription>{stat.title}</CardDescription>
              <CardTitle className="text-2xl tabular-nums">{stat.value}</CardTitle>
              <CardAction>
                <stat.icon className="size-4 text-muted-foreground" />
              </CardAction>
            </CardHeader>
            <CardContent>
              <span className="text-xs text-muted-foreground">{stat.detail}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Top products</CardTitle>
            <CardDescription>By revenue from paid orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.topProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No paid orders yet.
                    </TableCell>
                  </TableRow>
                ) : null}
                {metrics.topProducts.map((product) => (
                  <TableRow key={product.title}>
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell className="tabular-nums">{product.units}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {product.revenue}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Get your first sale</CardTitle>
            <CardDescription>Onboarding checklist</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {checklist.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <Checkbox id={item.id} defaultChecked={item.done} />
                <Label htmlFor={item.id}>{item.label}</Label>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              nativeButton={false}
              render={<Link href="/help/first-sale" />}
            >
              How to sell your first product
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
