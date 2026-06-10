import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";

export const Route = createFileRoute("/blog")({
  head: () => ({ meta: [{ title: "Blog & Resources | BCF" }, { name: "description", content: "Event recaps, tutorials, and ecosystem deep-dives." }] }),
  component: () => <PageStub eyebrow="Build in Public" title="Blog & Resources" blurb="Event recaps, tutorials, threads, and ecosystem deep-dives from BCF builders." />,
});