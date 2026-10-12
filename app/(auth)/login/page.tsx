import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";
import { CenteredCardShell } from "@/components/centered-card-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <CenteredCardShell>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* The form reads ?next= from the URL (request data), so with
              Cache Components it renders inside <Suspense>. */}
          <Suspense>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </CenteredCardShell>
  );
}
