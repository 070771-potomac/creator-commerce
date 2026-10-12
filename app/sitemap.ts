// /sitemap.xml (S13): the list of public pages, so search engines find every
// storefront and Published product without crawling link by link.
import type { MetadataRoute } from "next";

import { getSitemapEntries } from "@/lib/dal/sitemap";

const SITE_URL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
const absolute = (path: string) => new URL(path, SITE_URL).toString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { storefronts, products } = await getSitemapEntries();

  return [
    { url: absolute("/"), changeFrequency: "weekly", priority: 1 },
    ...storefronts.map((store) => ({
      url: absolute(`/@${store.handle}`),
      lastModified: store.lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: absolute(`/@${product.handle}/${product.slug}`),
      lastModified: product.lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
