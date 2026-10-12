import "server-only";

// A simple in-memory rate limiter (S11): at most `limit` actions per key in
// a sliding window of `windowMs`. Used to stop a script from pulling the
// same files hundreds of times (bandwidth costs, scraping).
//
// Limits of "simple": the counts live in this server process's memory, so
// they reset on restart and aren't shared between several servers. In
// production with many instances the same idea moves to a shared store
// (e.g. Redis / Upstash) — the function signature can stay the same.

const hits = new Map<string, number[]>(); // key → timestamps of recent hits

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    // The oldest hit leaves the window first.
    return { ok: false, retryAfterSeconds: Math.ceil((recent[0] + windowMs - now) / 1000) };
  }

  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing forever: drop keys with no recent hits.
  if (hits.size > 10_000) {
    for (const [k, times] of hits) {
      if (times.every((time) => now - time >= windowMs)) hits.delete(k);
    }
  }
  return { ok: true };
}
