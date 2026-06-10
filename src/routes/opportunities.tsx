import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunities — Hackathons, Grants & Jobs | BCF" },
      { name: "description", content: "Unlock the next phase of your Web3 journey. Global hackathons, exclusive grants, and ecosystem programs." },
      { property: "og:title", content: "Onchain Opportunities — BCF" },
      { property: "og:description", content: "Hackathons, grants, jobs, and ecosystem programs." },
    ],
  }),
  component: () => <PageStub eyebrow="Ecosystem Gateway" title="Onchain Opportunities" blurb="Unlock the next phase of your Web3 journey. From global hackathons to exclusive grants, discover how to contribute and grow." />,
});