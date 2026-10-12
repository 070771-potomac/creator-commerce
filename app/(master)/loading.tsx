import { Skeleton } from "@/components/ui/skeleton";

// Shown while a dashboard page loads its data. Next.js wraps every page in
// (master) in <Suspense> with this as the fallback — required by Cache
// Components, because these pages read the signed-in user at request time.
// The sidebar (layout.tsx) stays visible; only the content area shows this.
export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}
