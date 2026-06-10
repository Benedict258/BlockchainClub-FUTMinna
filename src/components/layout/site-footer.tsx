import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-low">
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-primary-foreground font-extrabold">B</div>
            <p className="text-headline-md">Blockchain Club <span className="text-primary">FUTMINNA</span></p>
            <p className="text-sm text-muted-foreground">The authoritative hub for decentralized technology research and education at Federal University of Technology, Minna.</p>
          </div>
          <FooterCol title="Community" links={[
            { label: "X / Twitter", href: "https://x.com" },
            { label: "Telegram", href: "#" },
            { label: "WhatsApp", href: "#" },
            { label: "Discord", href: "#" },
          ]} />
          <FooterCol title="Resources" links={[
            { label: "GitHub", href: "https://github.com" },
            { label: "Documentation", href: "#" },
            { label: "Brand Assets", href: "#" },
            { label: "Blog", href: "/blog" },
          ]} />
          <FooterCol title="Legal" links={[
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
            { label: "Partners", href: "/partners" },
            { label: "About", href: "/about" },
          ]} />
        </div>
        <div className="mt-10 flex flex-col sm:flex-row justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground">
          <span>© 2026 Blockchain Club FUTMINNA. Built for the Onchain Generation.</span>
          <span className="tracking-widest uppercase">Decentralize · Build · Inhabit</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-label-bold text-muted-foreground mb-4">{title}</p>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            {l.href.startsWith("/") ? (
              <Link to={l.href} className="text-foreground/80 hover:text-primary">{l.label}</Link>
            ) : (
              <a href={l.href} className="text-foreground/80 hover:text-primary" target="_blank" rel="noreferrer">{l.label}</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}