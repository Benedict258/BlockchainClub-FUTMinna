import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Workshops, Hackathons & Talks | BCF" },
      { name: "description", content: "Upcoming and past events from Blockchain Club FUTMINNA: workshops, hackathons, talks, and bootcamps." },
      { property: "og:title", content: "BCF Events" },
      { property: "og:description", content: "Workshops, hackathons, talks, and bootcamps." },
    ],
  }),
  component: () => <PageStub eyebrow="Live & Upcoming" title="Events" blurb="Workshops, hackathons, talks, and bootcamps from Blockchain Club FUTMINNA." />,
});