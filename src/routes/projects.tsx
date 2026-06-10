import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Build the Future | BCF" },
      { name: "description", content: "Showcasing the next generation of decentralized applications, protocols, and tooling built by the FUTMINNA blockchain community." },
      { property: "og:title", content: "Projects — Build the Future" },
      { property: "og:description", content: "Decentralized applications built by FUTMINNA members." },
    ],
  }),
  component: () => <PageStub eyebrow="Ecosystem Spotlight" title="Build the Future" blurb="Showcasing the next generation of decentralized applications, protocols, and tooling built by the FUTMINNA blockchain community." />,
});