// Storefront URLs look like /@handle. The [handle] segment receives the raw
// segment ("@alexpopovici", possibly percent-encoded), so strip the "@" here.
// Returns null when the segment is not a handle (no "@" prefix).
export function parseHandleSegment(segment: string): string | null {
  const decoded = decodeURIComponent(segment);
  return decoded.startsWith("@") ? decoded.slice(1) : null;
}
