"use client";

// "Duplicate" on the edit page (S12): creates a Draft copy on the server,
// then opens the copy's edit page.
import { CopyIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";

import { duplicateProductAction } from "@/app/(master)/products/actions";
import { Button } from "@/components/ui/button";

export function DuplicateButton({ productId }: { productId: string }) {
  const router = useRouter();
  const { execute, isPending, result } = useAction(duplicateProductAction, {
    onSuccess: ({ data }) => {
      if (data) router.push(`/products/${data.id}`);
    },
  });

  return (
    <Button
      variant="outline"
      disabled={isPending}
      title={result.serverError ?? "Create a Draft copy (without the file and cover)"}
      onClick={() => execute({ id: productId })}
    >
      <CopyIcon />
      {isPending ? "Duplicating…" : result.serverError ? "Couldn't duplicate" : "Duplicate"}
    </Button>
  );
}
