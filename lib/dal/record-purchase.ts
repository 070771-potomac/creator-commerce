import "server-only";
import { and, asc, eq, gt, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import type Stripe from "stripe";

import { db } from "@/db";
import { products, purchases } from "@/db/schema";
import { isUuid } from "@/lib/dal/format";
import { tags } from "@/lib/dal/tags";
import { stripe } from "@/lib/stripe";

// Records a paid Stripe Checkout session as a purchase (S10). Called only by
// the webhook (app/api/stripe/webhook), after its signature was verified.
//
// Rules (decided with the course owner):
// - one row per Stripe session: Stripe may deliver the same event twice,
//   the unique stripe_session_id index makes the second insert a no-op;
// - one purchase of a product per buyer per 24 h: a further payment for the
//   same product in that window (e.g. two tabs paid at once) is refunded
//   automatically and kept as "Refunded", so the history stays complete.

export const REPURCHASE_WINDOW_HOURS = 24;

export type RecordOutcome =
  | "recorded" // new Paid purchase
  | "duplicate-refunded" // second payment within 24 h → refunded
  | "already-processed" // same session seen before, nothing to do
  | "ignored"; // not paid yet, or not one of our product checkouts

export async function recordPaidCheckout(session: Stripe.Checkout.Session): Promise<RecordOutcome> {
  // Bank transfers etc. complete later: async_payment_succeeded comes then.
  if (session.payment_status !== "paid") return "ignored";

  const { buyerId, productId } = session.metadata ?? {};
  if (!buyerId || !productId || !isUuid(productId)) return "ignored";

  // The seller is read from the product, not trusted from metadata.
  const [product] = await db
    .select({ ownerId: products.ownerId })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);
  if (!product) return "ignored";

  // 1. Insert as Paid. A retry of the same event hits the unique index and
  //    inserts nothing.
  const inserted = await db
    .insert(purchases)
    .values({
      buyerId,
      sellerId: product.ownerId,
      productId,
      amountCents: session.amount_total ?? 0, // what Stripe actually charged
      currency: (session.currency ?? "usd").toUpperCase(),
      status: "Paid",
      stripeSessionId: session.id,
    })
    .onConflictDoNothing({ target: purchases.stripeSessionId })
    .returning({ id: purchases.id });

  const [row] = await db
    .select({ id: purchases.id, status: purchases.status })
    .from(purchases)
    .where(eq(purchases.stripeSessionId, session.id))
    .limit(1);
  if (!row) throw new Error(`Purchase for ${session.id} not found after insert`);

  // 2. The 24 h rule: the earliest Paid purchase of this product by this
  //    buyer in the window is the one that counts. Checked AFTER inserting,
  //    so two webhooks arriving together still agree on a single winner.
  let outcome: RecordOutcome = inserted.length > 0 ? "recorded" : "already-processed";
  if (row.status === "Paid") {
    const [first] = await db
      .select({ id: purchases.id })
      .from(purchases)
      .where(
        and(
          eq(purchases.buyerId, buyerId),
          eq(purchases.productId, productId),
          eq(purchases.status, "Paid"),
          gt(purchases.createdAt, sql`now() - make_interval(hours => ${REPURCHASE_WINDOW_HOURS})`),
        ),
      )
      .orderBy(asc(purchases.createdAt), asc(purchases.id))
      .limit(1);

    if (first && first.id !== row.id) {
      await refundDuplicate(session);
      await db.update(purchases).set({ status: "Refunded" }).where(eq(purchases.id, row.id));
      outcome = "duplicate-refunded";
    }
  }

  // Downloads / Purchases of the buyer, Sales / dashboard KPIs of the seller.
  // The route awaits all of this before answering, so it runs inside the
  // request (unlike UploadThing's callback in S8).
  revalidateTag(tags.purchases(buyerId), { expire: 0 });
  revalidateTag(tags.sales(product.ownerId), { expire: 0 });
  return outcome;
}

async function refundDuplicate(session: Stripe.Checkout.Session) {
  const paymentIntent =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
  if (!paymentIntent) throw new Error(`No payment intent on ${session.id}`);

  await stripe.refunds.create(
    {
      payment_intent: paymentIntent,
      reason: "duplicate",
      metadata: { rule: `one purchase per ${REPURCHASE_WINDOW_HOURS}h`, checkoutSession: session.id },
    },
    // If this webhook is retried, Stripe returns the same refund instead of
    // trying to refund twice.
    { idempotencyKey: `duplicate-refund-${session.id}` },
  );
}
