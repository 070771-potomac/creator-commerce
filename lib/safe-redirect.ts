// Where to go after logging in: /login?next=/sales → /sales.
// Only paths inside this site are accepted. Anything else (another domain,
// "//evil.com", "javascript:…") falls back to /dashboard — otherwise a link
// like /login?next=https://evil.com could send users to a fake site right
// after they log in (an "open redirect").
export function safeNextPath(next: string | null | undefined): string {
  if (!next) return "/dashboard";
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return "/dashboard";
  }
  return next;
}
