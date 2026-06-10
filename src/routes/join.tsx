import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";

export const Route = createFileRoute("/join")({
  head: () => ({ meta: [{ title: "Join the Club | BCF" }, { name: "description", content: "Apply for membership to Blockchain Club FUTMINNA." }] }),
  component: () => <PageStub eyebrow="Apply for Membership" title="Join the Club" blurb="Create your member profile to access events, learning tracks, bounties, and the club Discord." />,
});