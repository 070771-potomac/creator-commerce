import "server-only";

import { products, users } from "@/lib/sample-data";

// Public storefront data (/@handle and /@handle/{slug}).
// No requireUser() here: anyone may view a storefront, logged in or not.
// The rule that protects creators instead: ONLY Published products are
// returned — Drafts are invisible to the public, as if they didn't exist.

export type StorefrontProduct = {
  title: string;
  slug: string;
  type: string;
  price: string;
};

export type Storefront = {
  name: string;
  handle: string;
  bio: string;
  products: StorefrontProduct[];
};

export type PublicProduct = {
  title: string;
  slug: string;
  description: string;
  type: string;
  price: string;
  creatorHandle: string;
};

// Creator profile + their Published products. null → the page shows 404.
// The creator's email is deliberately left out of the DTO.
export async function getStorefront(handle: string): Promise<Storefront | null> {
  const owner = users.find((user) => user.handle === handle);
  if (!owner) return null;

  return {
    name: owner.name,
    handle: owner.handle,
    bio: owner.bio,
    products: products
      .filter((product) => product.ownerId === owner.id && product.status === "Published")
      .map(({ title, slug, type, price }) => ({ title, slug, type, price })),
  };
}

// One Published product of one creator. The slug must belong to THAT
// creator: /@maria/notion-dashboard-kit is a 404 even though the slug exists.
export async function getPublicProduct(
  handle: string,
  slug: string,
): Promise<PublicProduct | null> {
  const owner = users.find((user) => user.handle === handle);
  if (!owner) return null;

  const product = products.find(
    (p) => p.ownerId === owner.id && p.slug === slug && p.status === "Published",
  );
  if (!product) return null;

  return {
    title: product.title,
    slug: product.slug,
    description: product.description,
    type: product.type,
    price: product.price,
    creatorHandle: owner.handle,
  };
}
