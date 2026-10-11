import Link from "next/link";
import {
  CurrencyDollarIcon,
  HeartIcon,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const stats = [
  { title: "Revenue", value: "$48,120", delta: "+12.4%", icon: CurrencyDollarIcon },
  { title: "Units sold", value: "1,284", delta: "+4.1%", icon: PackageIcon },
  { title: "Wishlist adds", value: "312", delta: "+8.7%", icon: HeartIcon },
];

const topProducts = [
  { name: "Notion Dashboard Kit", units: 420, revenue: "$10,080" },
  { name: "Icon Set — 300 SVG", units: 388, revenue: "$3,492" },
  { name: "Lo-fi Sample Pack", units: 210, revenue: "$3,780" },
  { name: "Portfolio Template", units: 96, revenue: "$2,784" },
  { name: "Brand Guidelines", units: 70, revenue: "$1,050" },
];

const checklist = [
  { id: "account", label: "Create your account", done: true },
  { id: "handle", label: "Pick your handle", done: true },
  { id: "publish", label: "Publish your first product", done: false },
  { id: "stripe", label: "Connect Stripe", done: false },
  { id: "share", label: "Share your storefront", done: false },
];

export default function DashboardPage() {
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
            <CardContent className="flex items-center gap-2">
              <Badge variant="secondary">{stat.delta}</Badge>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Top products</CardTitle>
            <CardDescription>Best sellers this month</CardDescription>
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
                {topProducts.map((product) => (
                  <TableRow key={product.name}>
                    <TableCell className="font-medium">{product.name}</TableCell>
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
