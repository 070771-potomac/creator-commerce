// Configuration for drizzle-kit, the command-line tool that turns
// db/schema.ts into SQL migrations and applies them to Neon.
import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

// drizzle-kit runs outside Next.js, so .env.local isn't loaded for it.
// @next/env loads it exactly the way Next.js does (recommended in the
// Next.js environment-variables guide for ORM config files).
loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Add it to .env.local (see Neon → Connect).");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  // Generated SQL migration files go here and ARE committed: they are the
  // history of how the database structure changed.
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
