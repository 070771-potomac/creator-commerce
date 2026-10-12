import "server-only";
import { and, eq, gt, sql } from "drizzle-orm";

import { db } from "@/db";
import { products, purchases, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/dal/auth";
import { formatCents } from "@/lib/dal/format";
import { REPURCHASE_WINDOW_HOURS } from "@/lib/dal/record-purchase";
import { siteUrl, stripe } from "@/lib/stripe";

// Starting a purchase (S9). Everything the payment depends on — price,
// currency, seller — is read from the database here, never taken from the
// browser: the Buy button only sends the product id.

export type StartCheckoutResult =
  | { kind: "login"; next: string } // not signed in → log in, then come back
  | { kind: "owned" } // bought in the last 24 h → go to Downloads
  | { kind: "error"; message: string }
  | { kind: "checkout"; url: string }; // Stripe's payment page

export async function startCheckout(productId: string): Promise<StartCheckoutResult> {
  const [product] = await db
    .select({
      id: products.id,
      title: products.title,
      description: products.description,
      priceCents: products.priceCents,
      currency: products.currency,
      status: products.status,
      coverUrl: products.coverUrl,
      sellerId: products.ownerId,
      sellerHandle: users.handle,
      slug: products.slug,
    })
    .from(products)
    .innerJoin(users, eq(users.id, products.ownerId))
    .where(eq(products.id, productId))
    .limit(1);

  // A Draft is private: answer exactly as for a product that doesn't exist.
  if (!product || product.status !== "Published") {
    return { kind: "error", message: "This product isn't available." };
  }
  const productPath = `/@${product.sellerHandle}/${product.slug}`;

  const buyer = await getCurrentUser();
  if (!buyer) return { kind: "login", next: productPath };

  if (buyer.id === product.sellerId) {
    return { kind: "error", message: "This is your own product." };
  }

  // One purchase of a product per buyer per 24 h (S10 rule): within the
  // window, Buy leads to Downloads instead of a new payment. The webhook
  // refunds any duplicate that still gets through (two tabs paid at once).
  const [recent] = await db
    .select({ id: purchases.id })
    .from(purchases)
    .where(
      and(
        eq(purchases.buyerId, buyer.id),
        eq(purchases.productId, product.id),
        eq(purchases.status, "Paid"),
        gt(purchases.createdAt, sql`now() - make_interval(hours => ${REPURCHASE_WINDOW_HOURS})`),
      ),
    )
    .limit(1);
  if (recent) return { kind: "owned" };

  // Who bought what from whom. The webhook (S10) reads this back to record
  // the purchase — it is the only link between Stripe's payment and our data.
  const metadata = { buyerId: buyer.id, sellerId: product.sellerId, productId: product.id };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: product.currency.toLowerCase(), // Stripe wants "usd", "ron"…
          unit_amount: product.priceCents, // integer cents, like our database
          product_data: {
            name: product.title,
            // Stripe rejects an empty description, so only send a real one.
            ...(product.description ? { description: product.description.slice(0, 500) } : {}),
            ...(product.coverUrl ? { images: [product.coverUrl] } : {}),
          },
        },
      },
    ],
    customer_email: buyer.email, // pre-filled on Stripe's page
    client_reference_id: buyer.id,
    metadata,
    // Also on the payment itself, so refunds (later) can be traced back.
    payment_intent_data: { metadata },
    // {CHECKOUT_SESSION_ID} is replaced by Stripe with the real session id.
    // Built as a string: new URL() would escape the braces.
    success_url: `${siteUrl("/checkout/success")}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl("/checkout/cancel")}?product=${encodeURIComponent(productPath)}`,
  });

  if (!session.url) return { kind: "error", message: "Couldn't start the payment. Try again." };
  return { kind: "checkout", url: session.url };
}

// ── after the payment page ───────────────────────────────────────────────

export type CheckoutResult = {
  paid: boolean; // Stripe's payment_status === "paid"
  productTitle: string;
  amount: string; // "$22.00", what Stripe actually charged
  sellerHandle: string;
};

// The success page (/checkout/success?session_id=cs_…). The session is read
// from Stripe itself — never trusted from the URL — and shown only to the
// buyer it belongs to; anyone else holding the link gets null.
export async function getCheckoutResult(sessionId: string): Promise<CheckoutResult | null> {
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return null;

  const buyer = await getCurrentUser();
  if (!buyer) return null;

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return null; // unknown or expired session id
  }
  if (session.metadata?.buyerId !== buyer.id || !session.metadata.productId) return null;

  const [product] = await db
    .select({ title: products.title, sellerHandle: users.handle })
    .from(products)
    .innerJoin(users, eq(users.id, products.ownerId))
    .where(eq(products.id, session.metadata.productId))
    .limit(1);
  if (!product) return null;

  return {
    paid: session.payment_status === "paid",
    productTitle: product.title,
    amount: formatCents(session.amount_total ?? 0, (session.currency ?? "usd").toUpperCase()),
    sellerHandle: product.sellerHandle,
  };
}
