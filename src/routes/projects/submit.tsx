import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuthStore } from "@/stores/auth-store";
import { ArrowLeft } from "lucide-react";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  demoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  ecosystem: z.enum(["EVM", "SUI_MOVE", "APTOS_MOVE", "SOLANA_RUST", "GENERAL"]),
});

type ProjectInput = z.infer<typeof projectSchema>;

export const Route = createFileRoute("/projects/submit")({
  head: () => ({
    meta: [
      { title: "Submit Project | BlockchainClub FUTMinna" },
      { name: "description", content: "Submit your project to Blockchain Club FUTMinna." },
    ],
  }),
  component: SubmitProjectPage,
});

function SubmitProjectPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);

  const form = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      githubUrl: "",
      demoUrl: "",
      ecosystem: "GENERAL",
    },
  });

  async function onSubmit(values: ProjectInput) {
    if (!accessToken) {
      toast.error("Please sign in to submit a project");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/supabase/rpc/submit_project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          params: {
            p_name: values.name,
            p_description: values.description || null,
            p_github_url: values.githubUrl || null,
            p_demo_url: values.demoUrl || null,
            p_ecosystem: values.ecosystem,
            p_user_id: user?.id,
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit project");
      }

      setSubmitted(true);
      toast.success("Project submitted for review!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit project");
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-border bg-card">
          <CardContent className="p-6 text-center space-y-4">
            <p className="text-muted-foreground">Please sign in to submit a project.</p>
            <Button asChild className="w-full">
              <Link to="/auth">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-border bg-card">
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="text-headline-sm">Project Submitted!</h2>
            <p className="text-muted-foreground">
              Your project has been submitted for review. An admin will review it shortly.
            </p>
            <Button asChild className="w-full">
              <Link to="/projects">View Projects</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Submit Project</CardTitle>
          <CardDescription>Share your project with the BlockchainClub FUTMinna community</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="ghost" className="mb-4 -ml-2">
            <Link to="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Link>
          </Button>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Project" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your project..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ecosystem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ecosystem</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ecosystem" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EVM">EVM</SelectItem>
                        <SelectItem value="SUI_MOVE">Sui</SelectItem>
                        <SelectItem value="APTOS_MOVE">Aptos</SelectItem>
                        <SelectItem value="SOLANA_RUST">Solana</SelectItem>
                        <SelectItem value="GENERAL">General</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/username/repo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="demoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demo URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://myproject.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Project"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
