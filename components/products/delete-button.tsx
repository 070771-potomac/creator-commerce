"use client";

// "Delete" on the edit page (S12). Two clicks on purpose: the first one
// asks "Confirm delete?", the second one deletes. (An in-page confirmation
// instead of the browser's confirm() dialog.)
import { TrashIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";

import { deleteProductAction } from "@/app/(master)/products/actions";
import { Button } from "@/components/ui/button";

export function DeleteButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const { execute, isPending, result, reset } = useAction(deleteProductAction, {
    onSuccess: () => router.push("/products"),
    onError: () => setConfirming(false),
  });

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="destructive" disabled={isPending} onClick={() => execute({ id: productId })}>
          <TrashIcon />
          {isPending ? "Deleting…" : "Confirm delete"}
        </Button>
        <Button variant="ghost" disabled={isPending} onClick={() => setConfirming(false)}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        variant="outline"
        onClick={() => {
          reset(); // clear a previous error
          setConfirming(true);
        }}
      >
        <TrashIcon />
        Delete
      </Button>
      {result.serverError ? (
        <p role="alert" className="max-w-64 text-right text-xs text-destructive">
          {result.serverError}
        </p>
      ) : null}
    </div>
  );
}
