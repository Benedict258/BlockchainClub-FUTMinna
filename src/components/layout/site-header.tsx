import { Link } from "@tanstack/react-router";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const NAV = [
  { to: "/", label: "Explore" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/learn", label: "Learn" },
  { to: "/projects", label: "Projects" },
  { to: "/events", label: "Events" },
  { to: "/opportunities", label: "Opportunities" },
] as const;

function useTheme() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);
  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("bcf-theme", next ? "dark" : "light");
    } catch {}
    setIsDark(next);
  };
  return { isDark, toggle };
}

export function SiteHeader() {
  const { isDark, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-6 px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 shrink-0"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm tracking-tight">
            BCF
          </span>
          <span className="hidden sm:block font-semibold text-sm text-foreground">
            Blockchain Club{" "}
            <span className="text-primary font-bold">FUTMINNA</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="relative px-3 py-1.5 text-sm font-medium text-on-surface-variant transition-colors hover:text-foreground rounded-md hover:bg-surface-high"
              activeProps={{
                className:
                  "relative px-3 py-1.5 text-sm font-medium text-primary rounded-md bg-surface-high",
              }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-on-surface-variant transition-colors hover:text-foreground hover:bg-surface-high"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <Link
            to="/join"
            className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 active:opacity-80"
          >
            Join the Club
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-on-surface-variant lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {open && (
        <div className="lg:hidden border-t border-border bg-surface">
          <nav className="mx-auto flex max-w-[1280px] flex-col gap-1 px-4 py-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-foreground hover:bg-surface-high"
                activeProps={{
                  className:
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium text-primary bg-surface-high",
                }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/join"
              onClick={() => setOpen(false)}
              className="mt-2 flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              Join the Club
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
