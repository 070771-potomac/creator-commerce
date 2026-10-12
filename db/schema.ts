// Database tables, described in TypeScript with Drizzle.
// drizzle-kit reads this file to generate SQL migrations (npm run db:generate),
// and lib/dal queries use the same definitions, so every column is type-checked.
//
// The tables mirror lib/sample-data.ts from Session 4. The rules below are
// enforced by Postgres itself, so they hold even if application code has a bug.

import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// Enums: the column accepts ONLY these values.
export const productStatus = pgEnum("product_status", ["Draft", "Published"]);
export const purchaseStatus = pgEnum("purchase_status", ["Pending", "Paid", "Refunded"]);

// ── users ────────────────────────────────────────────────────────────────
// Also Better Auth's "user" model (see lib/auth.ts). Text id because Better
// Auth creates user ids as text. name, email, emailVerified, image,
// createdAt and updatedAt are the fields Better Auth requires; handle and
// bio are our own extra fields (Better Auth "additionalFields").
export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    // Public storefront address: /@handle. Unique across all users.
    handle: text("handle").notNull(),
    bio: text("bio").notNull().default(""),
    email: text("email").notNull(),
    // Set to true once the user confirms their email (not required in S6).
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex("users_handle_unique").on(t.handle),
    uniqueIndex("users_email_unique").on(t.email),
  ],
);

// ── products ─────────────────────────────────────────────────────────────
export const products = pgTable(
  "products",
  {
    // Random UUID: product ids can't be guessed by counting (/products/2 → 3).
    id: uuid("id").primaryKey().defaultRandom(),
    // The owner. Deleting a user deletes their products (unless purchases
    // reference them — see purchases.productId below).
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    type: text("type").notNull(), // PDF, ZIP, IMG… (file-type router in S14)
    // Money as integer cents: exact sums, no floating-point errors.
    priceCents: integer("price_cents").notNull(),
    currency: text("currency").notNull().default("USD"),
    status: productStatus("status").notNull().default("Draft"),
    // The digital asset, stored in UploadThing (S8). Only the key is kept, no
    // URL: the file is what buyers pay for, so download links are created
    // per buyer (S11), never shown on a public page.
    fileKey: text("file_key"),
    fileName: text("file_name"),
    fileSizeBytes: integer("file_size_bytes"),
    // Cover image (UploadThing, S8). Public: shown on the storefront, so the
    // URL is stored; the key lets us delete the old file when it's replaced.
    coverKey: text("cover_key"),
    coverUrl: text("cover_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // One creator can't have two products with the same slug (/@handle/slug).
    uniqueIndex("products_owner_slug_unique").on(t.ownerId, t.slug),
    // Fast "products of user X" — the DAL's getMyProducts().
    index("products_owner_idx").on(t.ownerId),
    check("products_price_non_negative", sql`${t.priceCents} >= 0`),
  ],
);

// ── purchases ────────────────────────────────────────────────────────────
// One row per order: a purchase for the buyer, a sale for the seller.
// Created by the Stripe webhook in S10 with the checkout metadata.
export const purchases = pgTable(
  "purchases",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // "restrict": a user or product with purchases can't be deleted —
    // order history must survive for receipts and accounting.
    buyerId: text("buyer_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    sellerId: text("seller_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    // Price paid at the time of purchase (the product price may change later).
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency").notNull().default("USD"),
    status: purchaseStatus("status").notNull().default("Pending"),
    // Stripe Checkout session id (S9–S10); unique so a webhook retry
    // can't record the same payment twice.
    stripeSessionId: text("stripe_session_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("purchases_buyer_idx").on(t.buyerId), // getMyPurchases / getMyDownloads
    index("purchases_seller_idx").on(t.sellerId), // getMySales / getDashboardMetrics
    index("purchases_product_idx").on(t.productId),
    uniqueIndex("purchases_stripe_session_unique").on(t.stripeSessionId),
    check("purchases_amount_non_negative", sql`${t.amountCents} >= 0`),
  ],
);

// ── wishlist_items ───────────────────────────────────────────────────────
export const wishlistItems = pgTable(
  "wishlist_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // Saving the same product twice is impossible.
    uniqueIndex("wishlist_user_product_unique").on(t.userId, t.productId),
  ],
);

// ── follows ──────────────────────────────────────────────────────────────
export const follows = pgTable(
  "follows",
  {
    followerId: text("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingId: text("following_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // The pair is the key: following the same creator twice is impossible.
    primaryKey({ columns: [t.followerId, t.followingId] }),
    check("follows_not_self", sql`${t.followerId} <> ${t.followingId}`),
  ],
);

// ── authentication (Better Auth) ─────────────────────────────────────────
// Managed by Better Auth through the Drizzle adapter (lib/auth.ts). Our code
// never writes these tables directly — except db/seed.ts for test accounts.

// One row per logged-in browser. The browser holds a signed cookie with the
// token; deleting the row (logout, expiry) ends that login.
export const sessions = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    token: text("token").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [uniqueIndex("session_token_unique").on(t.token), index("session_user_idx").on(t.userId)],
);

// How a user logs in. For email + password: providerId "credential" and
// `password` holds the password HASH (never the password itself).
// Social logins (GitHub, Google…) would add rows with their tokens.
export const accounts = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("account_user_idx").on(t.userId)],
);

// Short-lived codes: email verification, password reset links.
export const verifications = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);
