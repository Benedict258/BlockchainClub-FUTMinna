import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Code as Code2, Users, Briefcase, ShieldCheck, Cpu } from "lucide-react";
import researchLab from "@/assets/research-lab.jpg";
import eventHackathon from "@/assets/event-hackathon.jpg";
import eventNode from "@/assets/event-node.jpg";
import eventGovernance from "@/assets/event-governance.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Blockchain Club FUTMINNA — Home for Web3 Builders" },
      { name: "description", content: "FUTMinna's premier hub for blockchain innovation, decentralized development, and academic excellence in West Africa." },
      { property: "og:title", content: "Blockchain Club FUTMINNA" },
      { property: "og:description", content: "Home for Web3 builders. Empowering the next wave of protocol engineers." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-24 md:py-32 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-3 py-1 text-label-bold text-primary">
            Onchain Generation
          </span>
          <h1 className="mt-8 text-display-lg md:text-[64px] md:leading-[68px] tracking-tight">
            FUTMinna's Home for<br />
            <span className="text-primary">Web3 Builders</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-body-lg text-muted-foreground">
            The premier hub for blockchain innovation, decentralized development, and academic excellence in West Africa. Empowering the next wave of protocol engineers.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="font-semibold tracking-wide">
              <Link to="/join">Join the Community</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-semibold tracking-wide">
              <Link to="/learn">Explore Learn</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border bg-surface-low">
        <div className="mx-auto max-w-[1280px] px-6 py-10 md:py-12">
          <div className="grid grid-cols-2 divide-x divide-border md:grid-cols-4">
            {[
              { v: "500+", l: "Active Members" },
              { v: "20+", l: "BUIDL Projects" },
              { v: "$50k+", l: "Bounties Won" },
              { v: "12", l: "Protocol Partners" },
            ].map((s) => (
              <div key={s.l} className="text-center px-6 py-4">
                <div className="text-display-md text-foreground">{s.v}</div>
                <div className="mt-2 text-label-bold text-outline">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROOTED IN RESEARCH */}
      <section className="mx-auto max-w-[1280px] px-6 py-20 grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <img
            src={researchLab}
            alt="Students researching at FUTMinna"
            width={1280}
            height={896}
            className="w-full h-auto"
          />
          <div className="bg-surface-low px-5 py-3.5 border-t border-border flex items-center justify-between">
            <p className="text-label-bold text-foreground">Est. 2021</p>
            <p className="text-xs text-muted-foreground">Northern Nigeria's Web3 Hub</p>
          </div>
        </div>
        <div>
          <h2 className="text-headline-lg">ROOTED IN RESEARCH,<br />DRIVEN BY CODE</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Blockchain Club FUTMINNA is more than just a community; it's an incubator for the next generation of decentralized finance and Web3 infrastructure builders.
          </p>
          <ul className="mt-8 space-y-5">
            <li className="flex gap-4 items-start">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface-high text-primary">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-sm">Academic Integrity</p>
                <p className="mt-0.5 text-sm text-muted-foreground">Rigorous research-driven approach to protocol analysis and development.</p>
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface-high text-primary">
                <Cpu className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-sm">Builder-First Culture</p>
                <p className="mt-0.5 text-sm text-muted-foreground">We value shipping code and deploying smart contracts over empty speculation.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* CORE PILLARS */}
      <section className="border-y border-border bg-surface-low">
        <div className="mx-auto max-w-[1280px] px-6 py-20">
          <div className="text-center">
            <h2 className="text-headline-lg">CORE PILLARS</h2>
            <p className="mt-3 text-muted-foreground">How we accelerate the Web3 adoption curve within the university ecosystem.</p>
          </div>
          <div className="mt-12 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4 border border-border overflow-hidden rounded-lg">
            {[
              { i: BookOpen, t: "Education", d: "Deep dive technical workshops from Solidity foundations to advanced ZK math." },
              { i: Code2, t: "Hackathons", d: "Quarterly intensive build sessions with mainnet ecosystem grant prizes." },
              { i: Users, t: "Community", d: "Networking with global builders and local peers in an inclusive, high-output environment." },
              { i: Briefcase, t: "Industry Exposure", d: "Direct pipelines to internships, job opportunities, and venture capital funding." },
            ].map((p) => (
              <div key={p.t} className="bg-card p-7 hover:bg-surface-low transition-colors group">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-high text-primary group-hover:border-primary/30 transition-colors">
                  <p.i className="h-4 w-4" />
                </span>
                <p className="mt-5 text-label-bold text-foreground">{p.t}</p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING DEPLOYMENTS */}
      <section className="mx-auto max-w-[1280px] px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-headline-lg">UPCOMING<br />DEPLOYMENTS</h2>
          <Link
            to="/events"
            className="text-sm font-semibold text-on-surface-variant hover:text-primary inline-flex items-center gap-1.5 transition-colors"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { img: eventHackathon, date: "AUG 16", title: "Build-A-Thon 2026", desc: "Our flagship annual hackathon with a $4,000 prize pool.", cta: "REGISTER" },
            { img: eventNode, date: "EVERY SATURDAY", title: "Weekly Build Node", desc: "Co-working and mentorship sessions at the CS Lab.", cta: "JOIN" },
            { img: eventGovernance, date: "SEPT 05", title: "Governance Night", desc: "Deep-dive into DAO structures and on-chain voting.", cta: "DETAILS" },
          ].map((e) => (
            <article
              key={e.title}
              className="overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-sm"
            >
              <img
                src={e.img}
                alt={e.title}
                width={800}
                height={600}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <div className="p-5">
                <p className="text-label-bold text-outline">{e.date}</p>
                <h3 className="mt-2 text-headline-md">{e.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{e.desc}</p>
                <Button asChild variant="outline" className="mt-5 w-full font-semibold tracking-wide text-xs">
                  <Link to="/events">{e.cta}</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SHIPPED PROTOCOLS */}
      <section className="border-y border-border bg-surface-low">
        <div className="mx-auto max-w-[1280px] px-6 py-20">
          <h2 className="text-headline-lg">SHIPPED PROTOCOLS</h2>
          <p className="mt-2 text-muted-foreground">High-impact projects developed by our student body.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <Link
              to="/projects"
              className="group relative block rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-sm overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top rounded-r" />
              <span className="text-label-bold text-primary bg-primary/8 border border-primary/20 rounded px-2 py-0.5">DEFI</span>
              <p className="mt-4 text-headline-md">FutSwap DEX</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">A decentralized exchange optimized for low-bandwidth environments, enabling student-to-student peer trading.</p>
              <div className="mt-8 flex items-center gap-1.5 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                View Project <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
            <div className="grid gap-5">
              <Link
                to="/projects"
                className="group relative block rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-sm overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top rounded-r" />
                <span className="text-label-bold text-outline bg-surface-high border border-border rounded px-2 py-0.5">IDENTITY</span>
                <p className="mt-3 text-headline-md">UniID Protocol</p>
                <p className="mt-1 text-sm text-muted-foreground">Self-sovereign identity for academic credential verification.</p>
              </Link>
              <Link
                to="/projects"
                className="group relative block rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-sm overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top rounded-r" />
                <span className="text-label-bold text-outline bg-surface-high border border-border rounded px-2 py-0.5">DAO</span>
                <p className="mt-3 text-headline-md">ClubGov</p>
                <p className="mt-1 text-sm text-muted-foreground">On-chain treasury management for the club.</p>
              </Link>
              <Link
                to="/projects"
                className="flex items-center justify-center rounded-lg border border-dashed border-border bg-transparent p-5 text-label-bold text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                SUBMIT YOUR PROJECT →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LEARNING TRACKS PREVIEW */}
      <section className="mx-auto max-w-[1280px] px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
          <h2 className="text-headline-lg">LEARNING TRACKS</h2>
          <div className="flex gap-2">
            <span className="rounded-md border border-border bg-surface-low px-3 py-1 text-label-bold text-outline">BEGINNER</span>
            <span className="rounded-md border border-border bg-surface-low px-3 py-1 text-label-bold text-outline">ADVANCED</span>
          </div>
        </div>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[
            { code: "EVM", name: "Ethereum & L2s" },
            { code: "SUI", name: "Move Ecosystem" },
            { code: "SOL", name: "Solana Performance" },
            { code: "APT", name: "Aptos Network" },
          ].map((t) => (
            <Link
              key={t.code}
              to="/learn"
              className="group rounded-lg border border-border bg-card p-6 hover:border-primary transition-all hover:shadow-sm hover:-translate-y-0.5"
            >
              <div className="font-mono text-3xl font-bold text-muted-foreground/40 group-hover:text-primary transition-colors tracking-tight">
                {t.code}
              </div>
              <p className="mt-6 text-label-bold text-foreground">{t.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">Smart contract development track.</p>
            </Link>
          ))}
        </div>
      </section>

      {/* PARTNERS STRIP */}
      <section className="border-y border-border bg-surface-low">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-around gap-6 px-6 py-8">
          {["ETHEREUM FOUNDATION", "SUI FOUNDATION", "STARKNET", "SOLANA FOUNDATION"].map((p) => (
            <span key={p} className="text-label-bold text-muted-foreground hover:text-foreground transition-colors cursor-default">
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1280px] px-6 py-20">
        <div className="relative overflow-hidden rounded-xl border border-border bg-surface-low p-10 md:p-14 text-center">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <h2 className="text-headline-lg">READY TO BUILD THE<br />PERMITTED FUTURE?</h2>
          <p className="mt-4 text-muted-foreground">Join 500+ builders at the forefront of the decentralized revolution.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="font-semibold tracking-wide">
              <Link to="/auth">Enter the Discord</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-semibold tracking-wide">
              <Link to="/join">Apply for Fellowship</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
