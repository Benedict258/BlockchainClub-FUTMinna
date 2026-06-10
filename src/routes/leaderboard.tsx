import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Club Rankings — Leaderboard | BCF" },
      { name: "description", content: "Top contributors and builders of Blockchain Club FUTMINNA. On-chain proof of excellence." },
      { property: "og:title", content: "Club Rankings — BCF Leaderboard" },
      { property: "og:description", content: "Celebrating the top contributors and builders of the club." },
    ],
  }),
  component: () => <PageStub eyebrow="On-chain Proof of Excellence" title="Club Rankings" blurb="Celebrating the top contributors and builders of Blockchain Club FUTMINNA." />,
});