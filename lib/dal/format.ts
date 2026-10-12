import "server-only";

// The database stores raw values (integer cents, bytes, timestamps).
// DTOs turn them into display strings here, in one place, so every page
// formats money, sizes and dates the same way.

// 2400 → "$24.00"
export function formatCents(cents: number, currency = "USD"): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency });
}

// 19084083 → "18.2 MB"
export function formatBytes(bytes: number | null): string {
  if (bytes === null) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${unit === 0 ? value : value.toFixed(1)} ${units[unit]}`;
}

// 2026-07-14T12:00Z → "Jul 14"
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", timeZone: "UTC" });
}

// Order numbers shown to people: the first 8 characters of the UUID.
export function shortId(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

// Product ids are UUIDs. Postgres throws an error (→ 500 page) if asked to
// compare a uuid column with a value like "3", so URLs are checked first.
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}
