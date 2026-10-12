// The database connection. Only lib/dal/ imports this file: pages and
// components never talk to the database directly (see lib/dal/auth.ts).
import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

// Comes from .env.local (never committed). Next.js loads it automatically.
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing. Add it to .env.local (see Neon → Connect).");
}

// Neon's HTTP driver: each query is one HTTPS request, with no long-lived
// connection to keep open. That suits serverless hosting like Vercel (S17).
const sql = neon(databaseUrl);

// `schema` lets Drizzle know the tables, so queries are typed column by column.
export const db = drizzle({ client: sql, schema });
