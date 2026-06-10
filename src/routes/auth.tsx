import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign In | BCF" }, { name: "description", content: "Sign in to your Blockchain Club FUTMINNA account." }] }),
  component: () => <PageStub eyebrow="Member Access" title="Sign In" blurb="Sign in to manage your profile, submit projects, and track your XP." />,
});