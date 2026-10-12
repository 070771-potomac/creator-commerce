import Link from "next/link";
import { CaretLeftIcon, CaretRightIcon, MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react/ssr";

import { ProductStatusToggle } from "@/components/products/product-status-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMyProducts, type ProductListFilter } from "@/lib/dal/products";

type SearchParams = { status?: string | string[]; q?: string | string[]; page?: string | string[] };

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "Published", label: "Published" },
  { value: "Draft", label: "Draft" },
] as const;

// The URL is the state (S12): ?status=Draft&q=ghid&page=2. Shareable,
// bookmarkable, and the browser's Back button just works. Anything
// malformed falls back to a sensible default instead of failing.
function parseFilter(params: SearchParams): ProductListFilter {
  const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";
  const status = one(params.status);
  const page = Number.parseInt(one(params.page), 10);
  return {
    status: status === "Draft" || status === "Published" ? status : "all",
    q: one(params.q).trim().slice(0, 100),
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

// Builds a /products link that keeps the other filters.
function productsHref(filter: ProductListFilter, change: Partial<ProductListFilter>) {
  const next = { ...filter, ...change };
  const params = new URLSearchParams();
  if (next.status !== "all") params.set("status", next.status);
  if (next.q) params.set("q", next.q);
  if (next.page > 1) params.set("page", String(next.page));
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const filter = parseFilter(await searchParams);
  // Only the signed-in user's products, filtered/paged in the database (DAL).
  const { items, total, page, pageCount } = await getMyProducts(filter);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Products
          </h1>
          <p className="text-sm text-muted-foreground">Manage what you sell.</p>
        </div>
        <Button nativeButton={false} render={<Link href="/products/new" />}>
          <PlusIcon />
          New product
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Status filter: plain links, the current one highlighted. A new
            filter starts again at page 1. */}
        <nav aria-label="Filter by status" className="flex gap-1">
          {STATUS_TABS.map((tab) => (
            <Button
              key={tab.value}
              size="sm"
              variant={filter.status === tab.value ? "secondary" : "ghost"}
              nativeButton={false}
              render={
                <Link
                  href={productsHref(filter, { status: tab.value, page: 1 })}
                  aria-current={filter.status === tab.value ? "page" : undefined}
                />
              }
            >
              {tab.label}
            </Button>
          ))}
        </nav>

        {/* Search: a plain GET form → /products?q=…, rendered on the server.
            The status filter rides along in a hidden field. */}
        <form action="/products" method="get" role="search" className="flex gap-2">
          {filter.status !== "all" ? <input type="hidden" name="status" value={filter.status} /> : null}
          <Input
            type="search"
            name="q"
            defaultValue={filter.q}
            placeholder="Search titles…"
            aria-label="Search products by title"
            className="w-full sm:w-56"
          />
          <Button type="submit" size="sm" variant="outline">
            <MagnifyingGlassIcon />
            Search
          </Button>
        </form>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Sales</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    {filter.q || filter.status !== "all" ? (
                      <>
                        No products match these filters.{" "}
                        <Link href="/products" className="underline underline-offset-4">
                          Clear filters
                        </Link>
                      </>
                    ) : (
                      "No products yet — create your first one."
                    )}
                  </TableCell>
                </TableRow>
              ) : null}
              {items.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>
                    {/* Client island: flips instantly (optimistic), saves in
                        the background, rolls back if the save fails. */}
                    <ProductStatusToggle
                      id={product.id}
                      title={product.title}
                      status={product.status}
                    />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {product.price}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {product.sales}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      nativeButton={false}
                      render={<Link href={`/products/${product.id}`} />}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination: Previous / Next links, disabled at the ends. */}
      <nav aria-label="Pagination" className="flex items-center justify-between gap-4 text-sm">
        <span className="text-muted-foreground">
          {total} {total === 1 ? "product" : "products"} · page {page} of {pageCount}
        </span>
        <div className="flex gap-2">
          <PageLink href={productsHref(filter, { page: page - 1 })} disabled={page <= 1}>
            <CaretLeftIcon />
            Previous
          </PageLink>
          <PageLink href={productsHref(filter, { page: page + 1 })} disabled={page >= pageCount}>
            Next
            <CaretRightIcon />
          </PageLink>
        </div>
      </nav>
    </div>
  );
}

function PageLink({ href, disabled, children }: { href: string; disabled: boolean; children: React.ReactNode }) {
  if (disabled) {
    return (
      <Button size="sm" variant="outline" disabled className="pointer-events-none">
        {children}
      </Button>
    );
  }
  return (
    <Button size="sm" variant="outline" nativeButton={false} render={<Link href={href} />}>
      {children}
    </Button>
  );
}
