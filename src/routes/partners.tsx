import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";

export const Route = createFileRoute("/partners")({
  head: () => ({ meta: [{ title: "Partners | BCF" }, { name: "description", content: "Ecosystem and community partners of Blockchain Club FUTMINNA." }] }),
  component: () => <PageStub eyebrow="Ecosystem" title="Partners" blurb="The foundations, communities, and sponsors building alongside us." />,
});