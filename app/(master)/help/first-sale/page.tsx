import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const steps = [
  {
    title: "Create the product",
    description: "Add a title, price and short description in New product.",
  },
  {
    title: "Upload your file & cover",
    description:
      "Attach the digital asset and a cover image, then let AI draft the page.",
  },
  {
    title: "Publish & connect Stripe",
    description:
      "Switch the status to Published so it appears on your storefront.",
  },
  {
    title: "Share your storefront",
    description:
      "Send your /@handle link. Buyers pay and get instant downloads.",
  },
];

export default function FirstSaleGuidePage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          How to sell your first product
        </h1>
        <p className="text-sm text-muted-foreground">
          A 5-minute walkthrough from upload to first sale.
        </p>
      </div>

      <ol className="flex max-w-2xl flex-col gap-3">
        {steps.map((step, index) => (
          <li key={step.title}>
            <Card>
              <CardHeader className="flex flex-row items-start gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center bg-primary text-sm font-medium text-primary-foreground">
                  {index + 1}
                </span>
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-base">{step.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {step.description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ol>

      <div>
        <Button nativeButton={false} render={<Link href="/products/new" />}>
          Create my first product
        </Button>
      </div>
    </div>
  );
}
