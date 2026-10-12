import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components (Next.js 16): enables the "use cache" directive with
  // cacheTag / revalidateTag. The DAL caches database reads per user and
  // refreshes them by tag when that user's data changes (S7 forms, S10 webhook).
  // Parts of a page that wait on request data must sit inside <Suspense>
  // (or a loading.tsx file).
  cacheComponents: true,
};

export default nextConfig;
