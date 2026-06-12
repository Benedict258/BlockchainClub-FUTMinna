import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Code,
  ExternalLink,
  Github,
  ArrowRight,
  Users,
  Layers,
  Rocket,
  Star,
} from "lucide-react";
import { getProjects } from "@/lib/api/projects.server";

type EcosystemFilter =
  | "all"
  | "EVM"
  | "SUI_MOVE"
  | "APTOS_MOVE"
  | "SOLANA_RUST";

const ECOSYSTEM_LABELS: Record<string, string> = {
  EVM: "EVM",
  SUI_MOVE: "Sui",
  APTOS_MOVE: "Aptos",
  SOLANA_RUST: "Solana",
  GENERAL: "General",
};

const ECOSYSTEM_COLORS: Record<string, string> = {
  EVM: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  SUI_MOVE: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  APTOS_MOVE: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  SOLANA_RUST: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  GENERAL: "bg-muted text-muted-foreground border-border",
};

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Build the Future | BlockchainClub FUTMINNA" },
      {
        name: "description",
        content:
          "Showcasing the next generation of decentralized applications, protocols, and tooling built by the FUTMINNA blockchain community.",
      },
      { property: "og:title", content: "Projects — Build the Future" },
      {
        property: "og:description",
        content: "Decentralized applications built by FUTMINNA members.",
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-card p-6 space-y-4"
        >
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectsPage() {
  const [ecosystemFilter, setEcosystemFilter] =
    useState<EcosystemFilter>("all");

  const fetchProjects = useServerFn(getProjects);

  const { data, isLoading } = useQuery({
    queryKey: ["projects", ecosystemFilter],
    queryFn: () =>
      fetchProjects({
        data: {
          page: 1,
          limit: 50,
          ecosystem: ecosystemFilter === "all" ? undefined : ecosystemFilter,
        },
      }),
  });

  const projects = data?.projects ?? [];
  const featured = projects.filter(
    (p: { isFeatured: boolean }) => p.isFeatured
  );
  const regular = projects.filter(
    (p: { isFeatured: boolean }) => !p.isFeatured
  );

  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-24 md:py-32 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-3 py-1 text-label-bold text-primary">
            PROJECTS
          </span>
          <h1 className="mt-8 text-display-lg md:text-[56px] md:leading-[60px] tracking-tight">
            Community-Built
            <br />
            <span className="text-primary">Protocols</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-body-lg text-muted-foreground">
            Showcasing the next generation of decentralized applications,
            protocols, and tooling built by the FUTMINNA blockchain community.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border bg-surface-low">
        <div className="mx-auto max-w-[1280px] px-6 py-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <Code className="h-5 w-5 text-primary" />
              <div>
                <div className="text-headline-sm">{data?.total ?? 0}</div>
                <div className="text-xs text-muted-foreground">
                  Total Projects
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <div className="text-headline-sm">
                  {new Set(
                    projects.flatMap(
                      (p: { members?: { user: { id: string } }[] }) =>
                        p.members?.map(
                          (m: { user: { id: string } }) => m.user.id
                        ) ?? []
                    )
                  ).size}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total Builders
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Layers className="h-5 w-5 text-primary" />
              <div>
                <div className="text-headline-sm">
                  {new Set(
                    projects.map(
                      (p: { ecosystem: string }) => p.ecosystem
                    )
                  ).size}
                </div>
                <div className="text-xs text-muted-foreground">
                  Ecosystems
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER + GRID */}
      <section className="mx-auto max-w-[1280px] px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <h2 className="text-headline-lg">All Projects</h2>
          <Tabs
            value={ecosystemFilter}
            onValueChange={(v) => setEcosystemFilter(v as EcosystemFilter)}
          >
            <TabsList className="bg-background/50">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="EVM">EVM</TabsTrigger>
              <TabsTrigger value="SUI_MOVE">Sui</TabsTrigger>
              <TabsTrigger value="SOLANA_RUST">Solana</TabsTrigger>
              <TabsTrigger value="APTOS_MOVE">Aptos</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <ProjectsSkeleton />
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <Code className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <p className="mt-4 text-lg text-muted-foreground">
              No projects found.
            </p>
            <p className="mt-2 text-sm text-muted-foreground/60">
              Be the first to submit a project!
            </p>
          </div>
        ) : (
          <>
            {/* FEATURED */}
            {featured.length > 0 && (
              <div className="mb-10">
                <h3 className="text-headline-md mb-5 flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Featured Project
                </h3>
                {featured.slice(0, 1).map((project) => (
                  <Card
                    key={project.id}
                    className="group relative overflow-hidden border-border bg-card p-0"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                    <div className="p-8">
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Badge
                          variant="outline"
                          className={`${ECOSYSTEM_COLORS[project.ecosystem] || ECOSYSTEM_COLORS.GENERAL}`}
                        >
                          {ECOSYSTEM_LABELS[project.ecosystem] ||
                            project.ecosystem}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          <Star className="mr-1 h-3 w-3" />
                          Featured
                        </Badge>
                        {project.tags?.map(
                          (t: { tag: { id: string; name: string } }) => (
                            <Badge
                              key={t.tag.id}
                              variant="secondary"
                              className="text-[10px]"
                            >
                              {t.tag.name}
                            </Badge>
                          )
                        )}
                      </div>
                      <h3 className="text-headline-lg">{project.name}</h3>
                      {project.description && (
                        <p className="mt-3 text-muted-foreground leading-relaxed max-w-2xl">
                          {project.description}
                        </p>
                      )}
                      <div className="mt-5 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Builders:
                          </span>
                          <div className="flex -space-x-2">
                            {project.members
                              ?.slice(0, 5)
                              .map(
                                (
                                  m: {
                                    user: {
                                      id: string;
                                      profile: {
                                        fullName: string;
                                        avatarUrl: string | null;
                                      } | null;
                                    };
                                  },
                                  idx: number
                                ) => (
                                  <Avatar
                                    key={m.user.id}
                                    className="h-7 w-7 border-2 border-card"
                                  >
                                    <AvatarImage
                                      src={
                                        m.user.profile?.avatarUrl ||
                                        undefined
                                      }
                                    />
                                    <AvatarFallback className="text-[10px]">
                                      {m.user.profile?.fullName
                                        ?.split(" ")
                                        .map((p: string) => p[0])
                                        .join("") ||
                                        `U${idx}`}
                                    </AvatarFallback>
                                  </Avatar>
                                )
                              )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {project.githubUrl && (
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Github className="mr-1.5 h-3.5 w-3.5" />
                                GitHub
                              </a>
                            </Button>
                          )}
                          {project.demoUrl && (
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                                Demo
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* ALL PROJECTS */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {(featured.length > 0 ? regular : projects).map((project) => (
                <Card
                  key={project.id}
                  className="group relative overflow-hidden border-border bg-card p-0 transition-all hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top rounded-r" />
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${ECOSYSTEM_COLORS[project.ecosystem] || ECOSYSTEM_COLORS.GENERAL}`}
                      >
                        {ECOSYSTEM_LABELS[project.ecosystem] ||
                          project.ecosystem}
                      </Badge>
                      {project.tags
                        ?.slice(0, 2)
                        .map(
                          (t: { tag: { id: string; name: string } }) => (
                            <Badge
                              key={t.tag.id}
                              variant="secondary"
                              className="text-[10px]"
                            >
                              {t.tag.name}
                            </Badge>
                          )
                        )}
                    </div>
                    <h3 className="mt-3 text-headline-md group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {project.members
                          ?.slice(0, 4)
                          .map(
                            (
                              m: {
                                user: {
                                  id: string;
                                  profile: {
                                    fullName: string;
                                    avatarUrl: string | null;
                                  } | null;
                                };
                              },
                              idx: number
                            ) => (
                              <Avatar
                                key={m.user.id}
                                className="h-6 w-6 border-2 border-card"
                              >
                                <AvatarImage
                                  src={
                                    m.user.profile?.avatarUrl || undefined
                                  }
                                />
                                <AvatarFallback className="text-[9px]">
                                  {m.user.profile?.fullName
                                    ?.split(" ")
                                    .map((p: string) => p[0])
                                    .join("") || `U${idx}`}
                                </AvatarFallback>
                              </Avatar>
                            )
                          )}
                      </div>
                      <div className="flex gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </section>

      {/* CTA */}
      <section className="border-y border-border bg-surface-low">
        <div className="mx-auto max-w-[1280px] px-6 py-16 text-center">
          <Rocket className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-6 text-headline-lg">
            Built Something?
            <br />
            Show It Off.
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Submit your project to the BlockchainClub FUTMINNA showcase. Get feedback, find
            collaborators, and inspire the next wave of builders.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 font-semibold tracking-wide"
          >
            <Link to="/projects/submit">
              Submit a Project <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
