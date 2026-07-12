import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, BookOpen, Code as Code2, Users, Briefcase, ShieldCheck, Cpu, Download } from "lucide-react";
import researchLab from "@/assets/research-lab.jpg";
import eventHackathon from "@/assets/event-hackathon.jpg";
import slide1 from "@/assets/slide1.jpg";
import slide2 from "@/assets/slide2.jpg";
import { getProjects } from "@/lib/api/projects.server";
import { getBlogPosts } from "@/lib/api/blog.server";

const heroImages = [
  { src: slide1, alt: "Blockchain Club FUTMinna" },
  { src: slide2, alt: "Blockchain Club FUTMinna" },
];

function ImageCarousel() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % heroImages.length);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isHovered, next]);

  return (
    <div
      className="overflow-hidden rounded-lg border border-border bg-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/10" }}>
        {heroImages.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt={img.alt}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === current ? 1 : 0 }}
          />
        ))}
      </div>
      <div className="bg-surface-low px-5 py-3 flex items-center justify-center gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Blockchain Club FUTMinna — Home for Web3 Builders" },
      { name: "description", content: "FUTMinna's premier hub for blockchain innovation, decentralized development, and academic excellence in West Africa." },
      { property: "og:title", content: "Blockchain Club FUTMinna" },
      { property: "og:description", content: "Home for Web3 builders. Empowering the next wave of protocol engineers." },
    ],
  }),
  component: Home,
});

function Home() {
  const fetchProjects = useServerFn(getProjects);
  const fetchPosts = useServerFn(getBlogPosts);

  const { data: projectsData } = useQuery({
    queryKey: ["home-projects"],
    queryFn: () => fetchProjects({ data: { page: 1, limit: 3, featured: true } }),
    suspense: true,
  });

  const { data: postsData } = useQuery({
    queryKey: ["home-posts"],
    queryFn: () => fetchPosts({ data: { page: 1, limit: 3 } }),
  });

  const projects = projectsData?.projects ?? [];
  const posts = postsData?.posts ?? [];

  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="border-b border-border">
         <div className="mx-auto max-w-[1400px] px-6 py-16 md:py-24 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-3 py-1 text-label-bold text-primary">
            Onchain Generation
          </span>
          <h1 className="mt-6 text-display-lg md:text-[64px] md:leading-[68px] tracking-tight">
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
        <div className="mx-auto max-w-[1400px] px-6 py-8 md:py-10">
          <div className="grid grid-cols-2 divide-x divide-border md:grid-cols-4">
            {[
              { v: projectsData?.total ? `${projectsData.total}+` : "20+", l: "BUIDL Projects" },
              { v: postsData?.total ? `${postsData.total}+` : "5+", l: "Blog Posts" },
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
      <section className="mx-auto max-w-[1400px] px-6 py-16 grid gap-12 lg:grid-cols-2 lg:items-center">
        <ImageCarousel />
        <div>
          <h2 className="text-headline-lg">ROOTED IN RESEARCH,<br />DRIVEN BY CODE</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Blockchain Club FUTMinna is more than just a community; it's an incubator for the next generation of decentralized finance and Web3 infrastructure builders.
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
        <div className="mx-auto max-w-[1400px] px-6 py-16">
          <div className="text-center">
            <h2 className="text-headline-lg">CORE PILLARS</h2>
            <p className="mt-3 text-muted-foreground">How we accelerate the Web3 adoption curve within the university ecosystem.</p>
          </div>
          <div className="mt-10 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4 border border-border overflow-hidden rounded-lg">
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
      <section className="mx-auto max-w-[1400px] px-6 py-16">
        <h2 className="text-headline-lg">UPCOMING<br />DEPLOYMENTS</h2>
      </section>

      {/* PAST EVENTS */}
      <section className="mx-auto max-w-[1400px] px-6 py-16">
        <div className="space-y-4">
          <h3 className="text-headline-lg">PAST EVENTS</h3>
          <div className="overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="grid md:grid-cols-[280px_1fr]">
              <div className="aspect-[4/3] md:aspect-auto bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                <img
                  src="/vibe-coding.jpg"
                  alt="AI Vibe-Coding Workshop"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <Badge variant="secondary" className="text-xs mb-2">WORKSHOP</Badge>
                  <h3 className="text-headline-md">AI Vibe-Coding Workshop</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    An online session on vibe-coding with AI, featuring Noah AI. Held on 11th July 2026.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="grid md:grid-cols-[280px_1fr]">
              <div className="aspect-[4/3] md:aspect-auto bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                <img
                  src="/onboard.png"
                  alt="Blockchain Club Onboarding"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <Badge variant="secondary" className="text-xs mb-2">ONBOARDING</Badge>
                  <h3 className="text-headline-md">Blockchain Onboarding Session</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Welcome session for new members — covered club structure, roadmap, and getting started with Web3 development.
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href="/ONCHAIN FUTMINNA.pdf" download className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-high px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-low transition-colors">
                    <Download className="h-3.5 w-3.5" /> Download PDF
                  </a>
                  <a href="/blockchain Onboarding.pptx" download className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-high px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-low transition-colors">
                    <Download className="h-3.5 w-3.5" /> Download PPTX
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHIPPED PROTOCOLS */}
      <section className="border-y border-border bg-surface-low">
        <div className="mx-auto max-w-[1400px] px-6 py-16">
          <h2 className="text-headline-lg">SHIPPED PROTOCOLS</h2>
          <p className="mt-2 text-muted-foreground">High-impact projects developed by our student body.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {projects.slice(0, 3).map((project: any, i: number) => (
              <Link
                key={project.id}
                to="/projects/$projectId"
                params={{ projectId: project.id }}
                className={`group relative block rounded-lg border border-border bg-card ${i === 0 ? 'p-6' : 'p-5'} transition-all hover:border-primary/50 hover:shadow-sm overflow-hidden`}
              >
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top rounded-r" />
                <span className="text-label-bold text-primary bg-primary/8 border border-primary/20 rounded px-2 py-0.5">{project.ecosystem || 'PROJECT'}</span>
                <p className={`${i === 0 ? 'mt-4 text-headline-md' : 'mt-3 text-headline-md'}`}>{project.name}</p>
                <p className={`${i === 0 ? 'mt-2 text-sm' : 'mt-1 text-sm'} text-muted-foreground leading-relaxed`}>{project.headline || project.description}</p>
                {i === 0 && (
                  <div className="mt-8 flex items-center gap-1.5 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    View Project <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Link>
            ))}
            <Link
              to="/projects"
              className="flex items-center justify-center rounded-lg border border-dashed border-border bg-transparent p-5 text-label-bold text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              SUBMIT YOUR PROJECT →
            </Link>
          </div>
        </div>
      </section>

      {/* LEARNING TRACKS PREVIEW */}
      <section className="mx-auto max-w-[1400px] px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
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

      {/* CTA */}
      <section className="mx-auto max-w-[1400px] px-6 py-16">
        <div className="relative overflow-hidden rounded-xl border border-border bg-surface-low p-8 md:p-12 text-center">
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
