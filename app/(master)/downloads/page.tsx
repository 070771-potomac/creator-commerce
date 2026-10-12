import Link from "next/link";
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
              {downloads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    Nothing here yet — files you buy appear in this list.{" "}
                    <Link href="/" className="underline underline-offset-4">
                      Browse creators
                    </Link>
                  </TableCell>
                </TableRow>
              ) : null}
              {downloads.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.file}</TableCell>
                  <TableCell>{item.product}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{item.size}</TableCell>
                  <TableCell className="text-right">
                    {item.available ? (
                      // A plain <a>, not <Link>: this is a file from an API
                      // route, not a page. The route checks the purchase,
                      // then streams the file (S11).
                      <Button
                        size="sm"
                        nativeButton={false}
                        render={<a href={`/api/downloads/${item.id}`} download />}
                      >
                        <DownloadSimpleIcon />
                        Download
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">File not available yet</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Downloads are tied to your account: each file is checked against your
        purchase and sent through this site — there is no public link to share.
      </p>
    </div>
  );
}
