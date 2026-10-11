import Link from "next/link";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-4 px-4">
        <Link href="/" className="font-heading text-base font-medium">
          My-E-Commerce
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" nativeButton={false} render={<Link href="/login" />}>
            Log in
          </Button>
          <Button nativeButton={false} render={<Link href="/signup" />}>
            Sign up
          </Button>
        </div>
      </div>
    </header>
  );
}
