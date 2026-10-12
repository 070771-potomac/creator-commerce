import { Skeleton } from "@/components/ui/skeleton";

// Shown while a storefront or product page loads. The handle and slug come
// from the URL (request data), so Cache Components needs this <Suspense>
// fallback for /@handle and /@handle/{slug}.
export default function StorefrontLoading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12">
      <div className="flex items-center gap-4">
        <Skeleton className="size-16" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="aspect-4/3" />
        <Skeleton className="aspect-4/3" />
        <Skeleton className="aspect-4/3" />
      </div>
    </div>
  );
}
