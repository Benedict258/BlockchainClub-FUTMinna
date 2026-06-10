import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Network, Layers, Eye, Rocket } from "lucide-react";
import chip from "@/assets/chip.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Architecting Web3 in Nigeria | BCF" },
      { name: "description", content: "Blockchain Club FUTMINNA is a community of builders, researchers, and pioneers dedicated to driving decentralized innovation from the heart of Minna." },
      { property: "og:title", content: "About — Blockchain Club FUTMINNA" },
      { property: "og:description", content: "Architecting the future of Web3 in Nigeria." },
    ],
  }),
  component: AboutPage,
});

const TEAM = [
  { name: "Ibrahim Musa", handle: "CyberSage", role: "Lead Core Developer" },
  { name: "Fatima Bello", handle: "ZkQueen", role: "Ecosystem Strategist" },
  { name: "Samuel Okon", handle: "ChainLinker", role: "Smart Contract Engineer" },
  { name: "Chidera Okafor", handle: "Y-Node", role: "Research Lead" },
  { name: "Victor Adamu", handle: "SolDev", role: "Frontend Architect" },
  { name: "Aisha Umar", handle: "DaoDiva", role: "Community Operations" },
];

function AboutPage() {
  return (
    <div className="bg-background">
      <section className="mx-auto max-w-[1280px] px-6 py-20 text-center">
        <span className="inline-block rounded-full border border-border px-4 py-1 text-label-bold text-muted-foreground">The Onchain Generation</span>
        <h1 className="mt-8 text-display-lg">Architecting the Future of Web3 in <span className="text-primary">Nigeria.</span></h1>
        <p className="mx-auto mt-6 max-w-2xl text-body-lg text-muted-foreground">Blockchain Club FUTMINNA is a community of builders, researchers, and pioneers dedicated to driving decentralized innovation from the heart of Minna.</p>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-12 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-headline-lg">The Challenge</h2>
          <p className="mt-4 text-muted-foreground">Despite Africa's rapid crypto adoption, a critical gap remains in technical depth and local application building.</p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex gap-3"><AlertTriangle className="h-5 w-5 text-primary flex-none" /> Lack of specialized Web3 engineering curriculum in traditional academia.</li>
            <li className="flex gap-3"><Network className="h-5 w-5 text-primary flex-none" /> Disconnected talent pools working in isolation without collaborative structures.</li>
            <li className="flex gap-3"><Layers className="h-5 w-5 text-primary flex-none" /> Barriers to entry for developers navigating complex multi-chain ecosystems.</li>
          </ul>
        </div>
        <div className="overflow-hidden rounded-xl border border-border">
          <img src={chip} alt="Microprocessor with blockchain etching" width={1024} height={1024} className="w-full h-auto" loading="lazy" />
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-8">
          <Eye className="h-6 w-6" />
          <h3 className="mt-6 text-headline-md">Our Vision</h3>
          <p className="mt-3 text-muted-foreground">To establish FUTMINNA as the premier hub for blockchain innovation in West Africa, producing world-class talent capable of building resilient decentralized systems.</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-8">
          <Rocket className="h-6 w-6" />
          <h3 className="mt-6 text-headline-md">Our Mission</h3>
          <p className="mt-3 text-muted-foreground">To bridge the knowledge gap through structured learning, hands-on development, and direct ecosystem partnerships, empowering students to build in public.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-20 text-center">
        <h2 className="text-headline-lg">Our Story</h2>
        <div className="relative mt-10 grid gap-10 md:grid-cols-3">
          {[
            { y: "2022: THE GENESIS", t: "Founded by a small group of computer science students fascinated by Ethereum's programmable state machine." },
            { y: "2023: EXPANSION", t: "Secured university recognition and hosted the first University-wide Web3 Summit with 500+ attendees." },
            { y: "2024: BUILD PHASE", t: "Launching the BCF Lab — a physical space for students to experiment with ZK proofs and L2 scaling solutions." },
          ].map((s) => (
            <div key={s.y}>
              <p className="text-label-bold">{s.y}</p>
              <p className="mt-3 text-sm text-muted-foreground max-w-xs mx-auto">{s.t}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-20">
        <div className="rounded-xl border border-border bg-surface-low p-10">
          <h2 className="text-center text-headline-lg">What Makes Us Different</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3 text-sm">
            {[
              { t: "MULTI-ECOSYSTEM", d: "We are chain-agnostic. From Ethereum and Solana to Bitcoin Layers and Polkadot, we explore the tech where it shines brightest." },
              { t: "BUILD-IN-PUBLIC", d: "Our code is open-source. We ship weekly updates, host GitHub workshops, and encourage radical transparency in development." },
              { t: "AFRICAN CONTEXT", d: "We don't just build; we build for Africa. Solving local problems like remittance, identity, and supply chain through decentralized tech." },
            ].map((c) => (
              <div key={c.t} className="border-t border-border pt-5">
                <p className="text-label-bold">{c.t}</p>
                <p className="mt-3 text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-20">
        <h2 className="text-headline-lg">The Lead Builders</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m) => (
            <div key={m.name} className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="aspect-[4/5] bg-gradient-to-br from-surface-high to-surface-low flex items-center justify-center text-display-md text-muted-foreground/40">
                {m.name.split(" ").map((p) => p[0]).join("")}
              </div>
              <div className="p-5">
                <p className="text-headline-md">{m.name}</p>
                <p className="text-sm text-muted-foreground">"{m.handle}"</p>
                <p className="mt-1 text-sm">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-20">
        <div className="rounded-2xl border border-border bg-surface-low p-10 text-center">
          <h2 className="text-headline-lg">Ready to join the next block?</h2>
          <p className="mt-3 text-muted-foreground">Whether you're a beginner or an experienced dev, there's a place for you in our ecosystem.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="uppercase tracking-wider font-bold"><Link to="/join">Apply for Membership</Link></Button>
            <Button asChild variant="outline" className="uppercase tracking-wider font-bold"><Link to="/learn">Explore Resources</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}