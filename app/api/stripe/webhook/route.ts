// POST /api/stripe/webhook — Stripe calls this after events on our account
// (S10). Unlike the success page, it doesn't depend on the buyer's browser:
// it arrives even if the tab was closed right after paying, and Stripe
// retries it until we answer 2xx. That's why the purchase is recorded here.
import type Stripe from "stripe";

import { recordPaidCheckout } from "@/lib/dal/record-purchase";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET is missing from .env.local");
    return new Response("Webhook not configured", { status: 500 });
  }

  // Anyone can POST to this URL, so the request proves it comes from Stripe:
  // the Stripe-Signature header is an HMAC of the exact body, made with the
  // shared whsec_ secret. The RAW body is needed — re-serialized JSON would
  // no longer match the signature.
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  const body = await request.text();
  let event: Stripe.Event;
  try {
    // Also rejects old events (default tolerance 5 minutes) → no replays.
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      // Card payments: paid when the session completes.
      case "checkout.session.completed":
      // Delayed methods (bank transfer…): paid later, in this event.
      case "checkout.session.async_payment_succeeded": {
        const outcome = await recordPaidCheckout(event.data.object);
        console.log(`[stripe] ${event.type} ${event.data.object.id} → ${outcome}`);
        break;
      }
      default:
        // Other events are acknowledged and ignored.
        break;
    }
  } catch (error) {
    // 500 → Stripe retries the event later (for up to 3 days). Safe, because
    // recording is idempotent (unique session id, refund idempotency key).
    console.error("[stripe] webhook failed", event.id, error);
    return new Response("Webhook handler failed", { status: 500 });
  }

  // 2xx tells Stripe "received" — otherwise it retries for up to 3 days.
  return Response.json({ received: true });
}
