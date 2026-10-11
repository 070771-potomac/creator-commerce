import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type OrderStatus = "Paid" | "Pending" | "Refunded";

export type Order = {
  id: string;
  buyer: string;
  product: string;
  date: string;
  status: OrderStatus;
  total: string;
};

const statusVariant = {
  Paid: "default",
  Pending: "secondary",
  Refunded: "destructive",
} as const satisfies Record<OrderStatus, string>;

export function SalesTable({ orders }: { orders: Order[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Buyer</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="tabular-nums">#{order.id}</TableCell>
            <TableCell>{order.buyer}</TableCell>
            <TableCell className="font-medium">{order.product}</TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
            </TableCell>
            <TableCell className="text-right tabular-nums">{order.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
