"use client";

// One-click Published / Draft switch for a row of the products list.
//
// Optimistic UI: the switch and the badge change THE MOMENT you click,
// before the server answers. useOptimisticAction (next-safe-action, built on
// React's useOptimistic) shows the guessed state while the action runs:
//   - success → the server-rendered list arrives with the same status
//     (updateTag in the DAL), so nothing visibly changes;
//   - failure → the optimistic state is dropped, the switch jumps back to
//     the real status and a short error appears.
import { useOptimisticAction } from "next-safe-action/hooks";

import { setProductStatusAction } from "@/app/(master)/products/actions";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
// `import type` only: the DAL is server-only, its types are erased at build.
import type { ProductStatus } from "@/lib/dal/products";

export function ProductStatusToggle({
  id,
  title,
  status,
}: {
  id: string;
  title: string;
  status: ProductStatus; // the real status, from the server
}) {
  const { execute, optimisticState, isExecuting, hasErrored, result } = useOptimisticAction(
    setProductStatusAction,
    {
      currentState: status,
      // The guess shown while the action runs: the status we asked for.
      updateFn: (_current, input) => input.status,
    },
  );

  const published = optimisticState === "Published";

  return (
    <div className="flex items-center gap-2">
      <Switch
        size="sm"
        checked={published}
        aria-label={`Published: ${title}`}
        onCheckedChange={(checked) => execute({ id, status: checked ? "Published" : "Draft" })}
      />
      <Badge
        variant={published ? "default" : "secondary"}
        // Slightly faded while the server hasn't confirmed yet.
        className={isExecuting ? "opacity-60" : undefined}
      >
        {optimisticState}
      </Badge>
      {hasErrored ? (
        <span role="alert" className="text-xs text-destructive">
          {result.serverError ?? "Couldn't save. Try again."}
        </span>
      ) : null}
    </div>
  );
}
