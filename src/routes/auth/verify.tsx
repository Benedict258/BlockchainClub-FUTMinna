import { createFileRoute, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth/verify")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || "",
  }),
  head: () => ({
    meta: [
      { title: "Verify Email | BlockchainClub FUTMinna" },
      { name: "description", content: "Verify your email address." },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { token } = Route.useSearch();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided");
      return;
    }

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Verification failed");
        setStatus("success");
        setMessage(data.message || "Email verified successfully!");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Verification failed");
      });
  }, [token]);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="grid lg:grid-cols-2 lg:min-h-[calc(100vh-4rem)]">
        <div className="hidden lg:flex bg-surface-low border-r border-border">
          <div className="flex flex-col justify-center px-8 py-12 lg:px-16">
            <Link to="/" className="inline-flex items-center gap-2 mb-12">
              <img src="/lightlogo.png" alt="BCF" className="h-10 w-auto" />
            </Link>
            <h2 className="text-headline-lg text-foreground">
              {status === "loading" && "Verifying..."}
              {status === "success" && "Email Verified!"}
              {status === "error" && "Verification Failed"}
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {status === "loading" && "Hang tight — we're confirming your email address."}
              {status === "success" && "Your email has been confirmed. Welcome to BlockchainClub FUTMinna."}
              {status === "error" && "Something went wrong. The verification link may have expired."}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center px-6 py-12 lg:py-16">
          <Card className="w-full max-w-md border-border bg-card">
            <CardContent className="pt-8 text-center space-y-4">
              <div className="lg:hidden mb-4">
                <h1 className="text-headline-md">
                  {status === "loading" && "Verifying Email..."}
                  {status === "success" && "Email Verified!"}
                  {status === "error" && "Verification Failed"}
                </h1>
              </div>
              <p className="text-muted-foreground">{message}</p>
              {status === "success" && (
                <Button asChild className="w-full">
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
              {status === "error" && (
                <Button asChild variant="outline" className="w-full">
                  <Link to="/auth">Back to Sign In</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
