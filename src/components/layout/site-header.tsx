import { Link } from "@tanstack/react-router";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Explore" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/learn", label: "Learn" },
  { to: "/projects", label: "Projects" },
  { to: "/events", label: "Events" },
  { to: "/opportunities", label: "Opportunities" },
] as const;

function useTheme() {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);
  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("bcf-theme", next ? "dark" : "light"); } catch {}
    setIsDark(next);
  };
  return { isDark, toggle };
}

export function SiteHeader() {
  const { isDark, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-6 px-6">
        <Link to="/" className="flex items-center gap-2 text-label-bold tracking-[0.12em]">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-sm bg-primary text-primary-foreground font-extrabold">B</span>
          <span className="hidden sm:inline">Blockchain Club <span className="text-primary">FUTMINNA</span></span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground underline underline-offset-8 decoration-2" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Button asChild variant="default" size="sm" className="hidden sm:inline-flex font-bold uppercase tracking-wider">
            <Link to="/join">Join the Club</Link>
          </Button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="mx-auto flex max-w-[1280px] flex-col px-6 py-4 gap-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-medium"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/join"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-bold uppercase tracking-wider text-primary-foreground"
            >
              Join the Club
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}