import { ProductCard } from "@/components/product-card";
import { wishlist } from "@/lib/sample-data";

export default function WishlistPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Wishlist
        </h1>
        <p className="text-sm text-muted-foreground">
          Products you saved from storefronts.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wishlist.map((item) => (
          <ProductCard
            key={item.id}
            title={item.title}
            description={item.creator}
            price={item.price}
            type={item.type}
            href={item.href}
          />
        ))}
      </div>
    </div>
  );
}
