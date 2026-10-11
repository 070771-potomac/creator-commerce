import Link from "next/link";

import { CenteredCardShell } from "@/components/centered-card-shell";
import { Button } from "@/components/ui/button";

// Global 404: unknown URLs and notFound() calls without a closer not-found file.
export default function NotFound() {
  return (
    <CenteredCardShell>
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="font-heading text-5xl font-medium">404</span>
        <h1 className="font-heading text-xl font-medium">Page not found</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          The page you are looking for does not exist or is not public.
        </p>
        <Button nativeButton={false} render={<Link href="/" />}>
          Back to home
        </Button>
      </div>
    </CenteredCardShell>
  );
}
