// Storefront URLs look like /@handle. The [handle] segment receives the raw
// segment ("@alexpopovici", possibly percent-encoded), so strip the "@" here.
// Returns null when the segment is not a handle (no "@" prefix).
export function parseHandleSegment(segment: string): string | null {
  const decoded = decodeURIComponent(segment);
  return decoded.startsWith("@") ? decoded.slice(1) : null;
}

// Handle rules, shared by the signup form (browser) and Better Auth (server),
// so both validate the same way: 3–30 characters, lowercase letters, digits
// and underscores (e.g. "alexpopovici", "dj_ana").
export const HANDLE_PATTERN = /^[a-z0-9_]{3,30}$/;

// "  @Alex_Pop " → "alex_pop"
export function normalizeHandle(input: string): string {
  return input.trim().replace(/^@/, "").toLowerCase();
}

export function isValidHandle(handle: string): boolean {
  return HANDLE_PATTERN.test(handle);
}
