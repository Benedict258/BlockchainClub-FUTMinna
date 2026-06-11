import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  ArrowRight,
  Code,
  FileText,
  Video,
  Wrench,
  GraduationCap,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { getTracks, getResources } from "@/lib/api/learn.server";
import { useAuthStore } from "@/stores/auth-store";

type EcosystemFilter =
  | "all"
  | "EVM"
  | "SUI_MOVE"
  | "APTOS_MOVE"
  | "SOLANA_RUST";

const ECOSYSTEM_LABELS: Record<string, string> = {
  EVM: "EVM / Solidity",
  SUI_MOVE: "Sui / Move",
  APTOS_MOVE: "Aptos / Move",
  SOLANA_RUST: "Solana / Rust",
  GENERAL: "General",
};

const ECOSYSTEM_ICONS: Record<string, string> = {
  EVM: "⬡",
  SUI_MOVE: "◆",
  APTOS_MOVE: "◎",
  SOLANA_RUST: "◉",
  GENERAL: "●",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  BEGINNER: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  INTERMEDIATE: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  ADVANCED: "bg-red-500/10 text-red-400 border-red-500/20",
};

const RESOURCE_TYPE_ICONS: Record<string, typeof BookOpen> = {
  ARTICLE: FileText,
  VIDEO: Video,
  DOCS: BookOpen,
  TOOL: Wrench,
  TUTORIAL: Code,
};

export const Route = createFileRoute("/learn/")({
  head: () => ({
    meta: [
      { title: "Learn — Master Web3 Engineering | BCF" },
      {
        name: "description",
        content:
          "Comprehensive curriculums for the next generation of blockchain developers. From Solidity to Move, start your journey.",
      },
      {
        property: "og:title",
        content: "Master Web3 Engineering — Blockchain Club FUTMINNA",
      },
      {
        property: "og:description",
        content: "Tracks for EVM, Sui/Move, Aptos, and Solana.",
      },
    ],
  }),
  component: LearnPage,
});

function LearnSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-card p-6 space-y-4"
        >
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}

function LearnPage() {
  const [ecosystemFilter, setEcosystemFilter] =
    useState<EcosystemFilter>("all");
  const [resourceType, setResourceType] = useState<string>("all");
  const { isAuthenticated } = useAuthStore();

  const fetchTracks = useServerFn(getTracks);
  const fetchResources = useServerFn(getResources);

  const { data: tracks, isLoading: tracksLoading } = useQuery({
    queryKey: ["tracks"],
    queryFn: () => fetchTracks({ data: {} }),
  });

  const { data: resources, isLoading: resourcesLoading } = useQuery({
    queryKey: ["resources", ecosystemFilter, resourceType],
    queryFn: () =>
      fetchResources({
        data: {
          ecosystem:
            ecosystemFilter === "all" ? undefined : ecosystemFilter,
          type: resourceType === "all" ? undefined : resourceType,
        },
      }),
  });

  const trackList = tracks ?? [];
  const resourceList = resources ?? [];

  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-24 md:py-32 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-3 py-1 text-label-bold text-primary">
            LEARN
          </span>
          <h1 className="mt-8 text-display-lg md:text-[56px] md:leading-[60px] tracking-tight">
            Master <span className="text-primary">Blockchain</span>
            <br />
            Development
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-body-lg text-muted-foreground">
            Comprehensive learning tracks designed for the next generation of
            blockchain developers. From Solidity fundamentals to advanced Move
            programming.
          </p>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="border-b border-border bg-surface-low">
        <div className="mx-auto max-w-[1280px] px-6 py-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <Layers className="h-5 w-5 text-primary" />
              <div>
                <div className="text-headline-sm">{trackList.length}</div>
                <div className="text-xs text-muted-foreground">
                  Learning Tracks
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <div className="text-headline-sm">
                  {trackList.reduce(
                    (acc: number, t: { _count?: { modules?: number } }) =>
                      acc + (t._count?.modules ?? 0),
                    0
                  )}
                </div>
                <div className="text-xs text-muted-foreground">Modules</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <GraduationCap className="h-5 w-5 text-primary" />
              <div>
                <div className="text-headline-sm">
                  {isAuthenticated ? "—" : "—"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Quizzes Completed
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRACKS */}
      <section className="mx-auto max-w-[1280px] px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-headline-lg">Learning Tracks</h2>
        </div>

        {tracksLoading ? (
          <LearnSkeleton />
        ) : trackList.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <p className="mt-4 text-lg text-muted-foreground">
              No tracks available yet.
            </p>
            <p className="mt-2 text-sm text-muted-foreground/60">
              Content is being prepared. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {trackList.map((track) => (
              <Card
                key={track.id}
                className="group relative overflow-hidden border-border bg-card p-0 transition-all hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top rounded-r" />
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-high text-lg">
                      {ECOSYSTEM_ICONS[track.ecosystem] || "●"}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${DIFFICULTY_COLORS[track.difficulty] || ""}`}
                      >
                        {track.difficulty}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {track._count?.modules ?? 0} modules
                      </Badge>
                    </div>
                  </div>
                  <h3 className="mt-4 text-headline-md">{track.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {ECOSYSTEM_LABELS[track.ecosystem] || track.ecosystem}
                  </p>
                  {track.description && (
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {track.description}
                    </p>
                  )}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Progress</span>
                      <span>{isAuthenticated ? "0%" : "Login to track"}</span>
                    </div>
                    <Progress value={0} className="h-1.5" />
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-5 w-full font-semibold tracking-wide text-xs group-hover:border-primary/40"
                  >
                    <Link to="/learn">
                      Start Learning{" "}
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* RESOURCES */}
      <section className="border-y border-border bg-surface-low">
        <div className="mx-auto max-w-[1280px] px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <h2 className="text-headline-lg">Resources Library</h2>
            <Tabs
              value={ecosystemFilter}
              onValueChange={(v) => setEcosystemFilter(v as EcosystemFilter)}
            >
              <TabsList className="bg-background/50">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="EVM">EVM</TabsTrigger>
                <TabsTrigger value="SUI_MOVE">Sui</TabsTrigger>
                <TabsTrigger value="APTOS_MOVE">Aptos</TabsTrigger>
                <TabsTrigger value="SOLANA_RUST">Solana</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Tabs value={resourceType} onValueChange={setResourceType}>
            <TabsList className="mb-6 bg-background/50">
              <TabsTrigger value="all">All Types</TabsTrigger>
              <TabsTrigger value="ARTICLE">Articles</TabsTrigger>
              <TabsTrigger value="VIDEO">Videos</TabsTrigger>
              <TabsTrigger value="DOCS">Docs</TabsTrigger>
              <TabsTrigger value="TOOL">Tools</TabsTrigger>
            </TabsList>

            <TabsContent value={resourceType}>
              {resourcesLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border bg-card p-5 space-y-3"
                    >
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              ) : resourceList.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-10 w-10 text-muted-foreground/40" />
                  <p className="mt-3 text-muted-foreground">
                    No resources found.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {resourceList.map((resource) => {
                    const IconComp =
                      RESOURCE_TYPE_ICONS[resource.type || ""] || FileText;
                    return (
                      <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface-high text-primary">
                            <IconComp className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                              {resource.title}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {resource.type || "Resource"} ·{" "}
                              {ECOSYSTEM_LABELS[resource.ecosystem] ||
                                resource.ecosystem}
                            </p>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1280px] px-6 py-20">
        <div className="relative overflow-hidden rounded-xl border border-border bg-surface-low p-10 md:p-14 text-center">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-6 text-headline-lg">
            READY TO START YOUR
            <br />
            WEB3 JOURNEY?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join the community and get access to all learning tracks, mentorship,
            and project opportunities.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="font-semibold tracking-wide">
              <Link to="/join">Join BCF</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="font-semibold tracking-wide"
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
