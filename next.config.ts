import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components (Next.js 16): enables the "use cache" directive with
  // cacheTag / revalidateTag. The DAL caches database reads per user and
  // refreshes them by tag when that user's data changes (S7 forms, S10 webhook).
  // Parts of a page that wait on request data must sit inside <Suspense>
  // (or a loading.tsx file).
  cacheComponents: true,
  images: {
    // Cover images are stored in UploadThing (S8) and served from
    // <app id>.ufs.sh/f/<file key>. next/image only optimizes images from
    // hosts listed here — any other external URL is refused.
    remotePatterns: [{ protocol: "https", hostname: "*.ufs.sh", pathname: "/f/**" }],
  },
};

export default nextConfig;
