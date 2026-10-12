// GET /api/downloads/<purchaseId> — the protected download (S11).
//
// The file lives in UploadThing, but its address never reaches the browser:
// this route checks who is asking, then fetches the file server-side and
// streams it through as an attachment. Without a Paid purchase of your own
// there is no way to the file.
import { getDownloadAccess } from "@/lib/dal/downloads";
import { rateLimit } from "@/lib/rate-limit";
import { utapi } from "@/lib/utapi";

// 10 downloads per minute per user: plenty for a person, a wall for a script.
const DOWNLOADS_PER_MINUTE = 10;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ purchaseId: string }> },
) {
  const { purchaseId } = await params;
  const access = await getDownloadAccess(purchaseId);

  if (access.kind === "login") {
    // A link opened while logged out: log in, then back to the library.
    return Response.redirect(new URL("/login?next=/downloads", request.url), 307);
  }
  if (access.kind === "not-found") {
    // Same answer for "doesn't exist", "not yours" and "refunded".
    return new Response("Download not found.", { status: 404 });
  }
  if (access.kind === "no-file") {
    return new Response("The seller hasn't uploaded this file yet.", { status: 409 });
  }

  // Counted only for real downloads (after the checks above).
  const limit = rateLimit(`download:${access.userId}`, DOWNLOADS_PER_MINUTE, 60_000);
  if (!limit.ok) {
    return new Response("Too many downloads. Try again in a moment.", {
      status: 429,
      headers: { "Retry-After": String(limit.retryAfterSeconds) },
    });
  }

  // A short-lived signed URL, used only here on the server.
  const { ufsUrl } = await utapi.generateSignedURL(access.fileKey, { expiresIn: 60 });
  const upstream = await fetch(ufsUrl);
  if (!upstream.ok || !upstream.body) {
    console.error("[downloads] UploadThing answered", upstream.status, "for", access.fileKey);
    return new Response("The file is temporarily unavailable.", { status: 502 });
  }

  const headers = new Headers({
    // Always a download, never shown inline (a PDF won't open in the tab).
    "Content-Type": "application/octet-stream",
    // filename* keeps non-ASCII names (ă, î, ș…) intact; filename is the
    // plain fallback for old clients.
    "Content-Disposition": `attachment; filename="${asciiFallback(access.fileName)}"; filename*=UTF-8''${encodeURIComponent(access.fileName)}`,
    // Personal content: never stored by the browser or a proxy cache.
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  });
  const length = upstream.headers.get("content-length");
  if (length) headers.set("Content-Length", length); // lets the browser show progress

  // Streamed: the server passes chunks along without holding the whole file.
  return new Response(upstream.body, { status: 200, headers });
}

// "ghid-clujă.zip" → "ghid-cluj_.zip" for the plain filename= parameter.
function asciiFallback(name: string) {
  return name.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "_");
}
