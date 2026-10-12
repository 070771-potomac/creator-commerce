// Validation rules for products, written once with zod and used in two places:
//   - in the browser, by React Hook Form → instant messages under each field;
//   - on the server, by next-safe-action → the real protection (anyone can
//     bypass the browser and send data straight to the server).
// No "server-only" here: this file must be importable by client components.
import { z } from "zod";

// ── currencies and prices ────────────────────────────────────────────────

export const CURRENCIES = ["USD", "EUR", "RON"] as const;
export type Currency = (typeof CURRENCIES)[number];

// Minimum price per currency, in cents. Stripe refuses very small charges
// (its minimum differs per currency), so 1.00 is fine in USD/EUR but too
// little in RON.
export const MIN_PRICE_CENTS: Record<Currency, number> = { USD: 100, EUR: 100, RON: 500 };
export const MAX_PRICE_CENTS = 1_000_000; // 10,000.00

// The price is typed as text ("24.50") and converted to integer cents (2450),
// the format stored in the database — no floating-point numbers in between.
const priceField = z
  .string()
  .trim()
  .min(1, "Enter a price.")
  .regex(/^\d+(\.\d{1,2})?$/, "Use a number with up to 2 decimals, e.g. 24.50.")
  .transform((value) => Math.round(Number(value) * 100));

// ── shared fields ────────────────────────────────────────────────────────

// Used in the public URL /@handle/{slug}.
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const baseFields = {
  title: z
    .string()
    .trim()
    .min(3, "The title needs at least 3 characters.")
    .max(120, "Keep the title under 120 characters."),
  description: z.string().trim().max(2000, "Keep the description under 2000 characters."),
  price: priceField,
  currency: z.enum(CURRENCIES, "Choose USD, EUR or RON."),
};

// Price limits depend on the chosen currency, so they are checked on the
// whole object (superRefine) rather than on the price field alone.
function checkPriceForCurrency(
  data: { price: number; currency: Currency },
  ctx: z.RefinementCtx,
) {
  // zod 4 runs this even when a field already failed. If the price text was
  // invalid, it was never converted to cents — its own message is enough.
  if (typeof data.price !== "number" || !CURRENCIES.includes(data.currency)) return;
  const min = MIN_PRICE_CENTS[data.currency];
  if (data.price < min) {
    ctx.addIssue({
      code: "custom",
      path: ["price"],
      message: `The minimum price in ${data.currency} is ${(min / 100).toFixed(2)}.`,
    });
  }
  if (data.price > MAX_PRICE_CENTS) {
    ctx.addIssue({
      code: "custom",
      path: ["price"],
      message: `The maximum price is ${(MAX_PRICE_CENTS / 100).toFixed(2)}.`,
    });
  }
}

// ── create (/products/new) ───────────────────────────────────────────────

export const createProductSchema = z
  .object({
    ...baseFields,
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "The slug needs at least 3 characters.")
      .max(80, "Keep the slug under 80 characters.")
      .regex(SLUG_PATTERN, "Only lowercase letters, digits and single dashes, e.g. my-ui-kit."),
  })
  .superRefine(checkPriceForCurrency);

// ── update (/products/{id}) ──────────────────────────────────────────────
// The slug is not editable after creation: changing it would break links
// that were already shared. The status can change (Draft ↔ Published).

const statusField = z.enum(["Draft", "Published"], "Choose Draft or Published.");

export const updateProductSchema = z
  .object({
    id: z.uuid("Invalid product."),
    ...baseFields,
    status: statusField,
  })
  .superRefine(checkPriceForCurrency);

// Types, generated from the schemas (never written by hand):
//   …Input  = what the form holds (price as text)
//   …Output = what the server receives after validation (price in cents)
export type CreateProductInput = z.input<typeof createProductSchema>;
export type CreateProductOutput = z.output<typeof createProductSchema>;
export type UpdateProductInput = z.input<typeof updateProductSchema>;
export type UpdateProductOutput = z.output<typeof updateProductSchema>;

// The one-click Published switch in the products list (optimistic UI).
export const setProductStatusSchema = z.object({
  id: z.uuid("Invalid product."),
  status: statusField,
});
export type SetProductStatusInput = z.input<typeof setProductStatusSchema>;

// "My UI Kit — v2!" → "my-ui-kit-v2". Used by the form to suggest a slug.
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/\p{M}/gu, "") // remove accents (combining marks): ă → a
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
