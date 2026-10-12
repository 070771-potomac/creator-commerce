// /robots.txt (S13): what search engines may crawl. Public pages are open;
// the private app (dashboard, buyer pages, API, checkout, auth) is not.
// robots.txt is a polite request, not security — those pages are protected
// by login anyway (proxy.ts + requireUser in the DAL).
import type { MetadataRoute } from "next";

const SITE_URL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/checkout/",
        "/login",
        "/signup",
        "/dashboard",
        "/products",
        "/sales",
        "/purchases",
        "/downloads",
        "/wishlist",
        "/following",
        "/settings",
        "/help",
      ],
    },
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
  };
}
