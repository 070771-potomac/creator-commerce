import Link from "next/link";
import {
  CreditCardIcon,
  LockKeyIcon,
  SparkleIcon,
  UserSwitchIcon,
} from "@phosphor-icons/react/ssr";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const sampleProducts = [
  { title: "UI Kit Pro", price: "$24", type: "ZIP" },
  { title: "Photo Pack", price: "$12", type: "ZIP" },
];

const steps = [
  {
    title: "Publish",
    description:
      "Upload your file, set a price, add a cover. AI drafts the product page for you.",
  },
  {
    title: "Sell",
    description:
      "Share your /@handle storefront. Buyers pay securely via Stripe Checkout.",
  },
  {
    title: "Deliver",
    description:
      "Buyers get instant, protected downloads. You track revenue in your dashboard.",
  },
];

const features = [
  {
    icon: CreditCardIcon,
    title: "Stripe Checkout",
    description: "Secure payments with buyer, seller and product details attached.",
  },
  {
    icon: LockKeyIcon,
    title: "Protected downloads",
    description: "Files are only accessible to verified buyers.",
  },
  {
    icon: SparkleIcon,
    title: "AI product pages",
    description: "Descriptions and per-file teasers generated from your upload.",
  },
  {
    icon: UserSwitchIcon,
    title: "One account, buy & sell",
    description: "Every user gets a storefront and a buyer library.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main>
        <section className="mx-auto grid w-full max-w-5xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col items-start gap-4">
            <Badge variant="secondary">For digital creators</Badge>
            <h1 className="font-heading text-4xl font-medium tracking-tight md:text-5xl">
              Sell what you create. Get paid instantly.
            </h1>
            <p className="text-base text-muted-foreground">
              Launch a storefront, publish digital products, take payments with
              Stripe, and deliver protected downloads — all from one account.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button size="lg" nativeButton={false} render={<Link href="/signup" />}>
                Start selling — free
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={<Link href="/@alexpopovici" />}
              >
                See a storefront
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              No monthly fee to start · Stripe-powered payouts
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {sampleProducts.map((product) => (
              <ProductCard key={product.title} {...product} />
            ))}
          </div>
        </section>

        <section id="how" className="bg-muted">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16">
            <div className="flex flex-col gap-1">
              <h2 className="font-heading text-2xl font-medium">How it works</h2>
              <p className="text-muted-foreground">
                Three steps from file to first sale.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <Card key={step.title}>
                  <CardHeader>
                    <span className="flex size-8 items-center justify-center bg-primary text-sm font-medium text-primary-foreground">
                      {index + 1}
                    </span>
                    <CardTitle className="mt-2 text-base">{step.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="features">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-16">
            <h2 className="font-heading text-2xl font-medium">
              Everything you need to sell digital
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <CardHeader>
                    <feature.icon className="size-6 text-primary" />
                    <CardTitle className="mt-2 text-base">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-4 pb-16">
          <div className="flex flex-col items-center gap-3 bg-primary px-6 py-12 text-center text-primary-foreground">
            <h2 className="font-heading text-2xl font-medium">
              Ready to open your storefront?
            </h2>
            <p className="max-w-md opacity-90">
              Create an account and publish your first product in minutes.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="mt-2"
              nativeButton={false}
              render={<Link href="/signup" />}
            >
              Get started
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-heading font-medium text-foreground">My-E-Commerce</span>
            <span>Sell digital products. Get paid. Deliver instantly.</span>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/#how" className="hover:text-foreground">How it works</Link>
            <Link href="/#features" className="hover:text-foreground">Features</Link>
            <Link href="/login" className="hover:text-foreground">Log in</Link>
            <Link href="/signup" className="hover:text-foreground">Sign up</Link>
          </nav>
        </div>
        <div className="mx-auto w-full max-w-5xl px-4 pb-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} My-E-Commerce
        </div>
      </footer>
    </div>
  );
}
