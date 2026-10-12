"use client";

// Interactive signup form. Checks the handle while you type, using the same
// rules as the server (lib/handle.ts); the server checks again anyway —
// browser checks are only for a better experience, never for security.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";
import { isValidHandle, normalizeHandle } from "@/lib/handle";

const MIN_PASSWORD_LENGTH = 8; // same as emailAndPassword.minPasswordLength in lib/auth.ts

export function SignupForm() {
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const cleanHandle = normalizeHandle(handle);
  const handleProblem =
    handle && !isValidHandle(cleanHandle)
      ? "3–30 characters: lowercase letters, digits or _."
      : null;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (handleProblem) return;
    setPending(true);

    const form = new FormData(event.currentTarget);
    // Calls /api/auth/sign-up/email: creates the user (our users table, with
    // the extra field `handle`) and a credential account with the password
    // HASH, then logs the user in (autoSignIn).
    const { error } = await signUp.email({
      name: String(form.get("name")),
      email: String(form.get("email")),
      password: String(form.get("password")),
      handle: cleanHandle,
    });

    if (error) {
      setError(error.message ?? "Could not create the account. Try again.");
      setPending(false);
      return;
    }
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" autoComplete="name" required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="handle">Handle</Label>
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">/@</span>
          <Input
            id="handle"
            name="handle"
            placeholder="yourname"
            autoComplete="username"
            value={handle}
            onChange={(event) => setHandle(event.target.value)}
            aria-invalid={handleProblem ? true : undefined}
            required
          />
        </div>
        <p className={handleProblem ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>
          {handleProblem ?? (cleanHandle ? `Your storefront: /@${cleanHandle}` : "Your public storefront address.")}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
        />
        <p className="text-xs text-muted-foreground">At least {MIN_PASSWORD_LENGTH} characters.</p>
      </div>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="mt-2 w-full" disabled={pending || Boolean(handleProblem)}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
