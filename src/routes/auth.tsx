import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema, type LoginInput } from "@/lib/validators/auth";
import { useAuthStore } from "@/stores/auth-store";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In | BlockchainClub FUTMinna" },
      { name: "description", content: "Sign in to your Blockchain Club FUTMinna account." },
    ],
  }),
  component: SignInPage,
});

function AuthBranding() {
  return (
    <div className="flex flex-col justify-center px-8 py-12 lg:px-16">
      <Link to="/" className="inline-flex items-center gap-2 mb-12">
        <img src="/lightlogo.png" alt="BCF" className="h-10 w-auto" />
      </Link>
      <h2 className="text-headline-lg text-foreground">Welcome Back</h2>
      <p className="mt-3 text-muted-foreground leading-relaxed">
        Sign in to access your dashboard, track your learning progress, and connect with fellow Web3 builders at FUTMinna.
      </p>
      <div className="mt-10 space-y-4 text-sm text-muted-foreground">
        <div className="flex gap-3">
          <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border text-xs font-bold text-primary">1</span>
          <span>Track your onchain learning journey</span>
        </div>
        <div className="flex gap-3">
          <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border text-xs font-bold text-primary">2</span>
          <span>Earn badges and climb the leaderboard</span>
        </div>
        <div className="flex gap-3">
          <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border text-xs font-bold text-primary">3</span>
          <span>Collaborate on open-source protocols</span>
        </div>
      </div>
    </div>
  );
}

function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const authLogin = useAuthStore((s) => s.login);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Login failed");
      authLogin(result.user, result.accessToken);
      toast.success("Welcome back!");
      window.location.href = "/";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="grid lg:grid-cols-2 lg:min-h-[calc(100vh-4rem)]">
        <div className="hidden lg:flex bg-surface-low border-r border-border">
          <AuthBranding />
        </div>
        <div className="flex items-center justify-center px-6 py-12 lg:py-16">
          <Card className="w-full max-w-md border-border bg-card">
            <CardContent className="pt-8">
              <div className="mb-6 lg:hidden">
                <h1 className="text-headline-md">Welcome Back</h1>
                <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@futminna.edu.ng" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center justify-end">
                    <Link
                      to="/auth/forgot-password"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </Form>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link to="/join" className="font-medium text-primary hover:underline">
                  Join the Club
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
