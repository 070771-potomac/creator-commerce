"use client";

// Follow / Following on a storefront. Optimistic like the Published switch
// (S7): the label changes the moment you click; if the save fails it goes
// back and shows why.
import { CheckIcon, PlusIcon } from "@phosphor-icons/react";
import { useOptimisticAction } from "next-safe-action/hooks";

import { setFollowAction } from "@/app/(master)/following/actions";
import { Button } from "@/components/ui/button";

export function FollowButton({
  handle,
  following,
  size = "default",
}: {
  handle: string;
  following: boolean;
  size?: "default" | "sm";
}) {
  const { execute, optimisticState, isExecuting, hasErrored, result } = useOptimisticAction(
    setFollowAction,
    {
      currentState: following,
      updateFn: (_current, input) => input.follow,
    },
  );

  return (
    <div className="flex flex-col items-start gap-1">
      <Button
        size={size}
        variant={optimisticState ? "outline" : "default"}
        aria-pressed={optimisticState}
        className={isExecuting ? "opacity-70" : undefined}
        onClick={() => execute({ handle, follow: !optimisticState })}
      >
        {optimisticState ? <CheckIcon /> : <PlusIcon />}
        {optimisticState ? "Following" : "Follow"}
      </Button>
      {hasErrored ? (
        <span role="alert" className="text-xs text-destructive">
          {result.serverError ?? "Couldn't save. Try again."}
        </span>
      ) : null}
    </div>
  );
}
