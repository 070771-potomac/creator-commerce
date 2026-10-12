// The Stripe client (S9). Server-only: the secret key can create payments
// and refunds, so it must never reach the browser.
import "server-only";
import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) throw new Error("STRIPE_SECRET_KEY is missing from .env.local");

// The SDK pins the Stripe API version it was built for (2026-09-30.endive
// in stripe@23.0.0), so a Stripe-side upgrade can't change our responses.
export const stripe = new Stripe(secretKey);

// The site's own address, for the URLs Stripe sends the buyer back to.
// BETTER_AUTH_URL already holds it (http://localhost:3000 in development).
export function siteUrl(path: string): string {
  return new URL(path, process.env.BETTER_AUTH_URL ?? "http://localhost:3000").toString();
}
