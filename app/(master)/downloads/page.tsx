import { DownloadSimpleIcon } from "@phosphor-icons/react/ssr";

import { Badge } from "@/components/ui/badge";
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
import { getMyDownloads } from "@/lib/dal/purchases";

export default async function DownloadsPage() {
  // Only the user's own Paid purchases unlock a file (filtered in the DAL).
  const downloads = await getMyDownloads();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Downloads
        </h1>
        <p className="text-sm text-muted-foreground">
          Protected files from everything you&apos;ve bought.
        </p>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Size</TableHead>
                <TableHead>
                  <span className="sr-only">Download</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {downloads.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.file}</TableCell>
                  <TableCell>{item.product}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{item.size}</TableCell>
                  <TableCell className="text-right">
                    {/* Protected, time-limited download route (S11). */}
                    <Button size="sm">
                      <DownloadSimpleIcon />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Download links are time-limited and tied to your account.
      </p>
    </div>
  );
}
