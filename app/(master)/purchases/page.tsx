import Link from "next/link";
import { ReceiptIcon, StarIcon } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { purchases } from "@/lib/sample-data";

export default function PurchasesPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Purchases
        </h1>
        <p className="text-sm text-muted-foreground">Your order history and receipts.</p>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.product}</TableCell>
                  <TableCell>{order.creator}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell className="text-right tabular-nums">{order.amount}</TableCell>
                  <TableCell>
                    {/* Receipts come from Stripe (S9); reviews and refunds are extensions. */}
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm">
                        <ReceiptIcon />
                        Receipt
                      </Button>
                      <Button variant="ghost" size="sm">
                        <StarIcon />
                        Review
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Need the files? Your library lives in{" "}
        <Link href="/downloads" className="font-medium text-foreground hover:underline">
          Downloads
        </Link>
        .
      </p>
    </div>
  );
}
