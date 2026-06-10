import { Link } from "@tanstack/react-router";

export function PageStub({ eyebrow, title, blurb }: { eyebrow: string; title: string; blurb: string }) {
  return (
    <div className="mx-auto max-w-[1280px] px-6 py-24">
      <p className="text-label-bold text-primary">{eyebrow}</p>
      <h1 className="mt-3 text-display-lg">{title}</h1>
      <p className="mt-4 max-w-2xl text-body-lg text-muted-foreground">{blurb}</p>
      <div className="mt-10 rounded-xl border border-dashed border-border bg-surface-low p-10 text-center">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">Coming next in the build</p>
        <p className="mt-2 text-muted-foreground">This page will be wired up when the backend (Lovable Cloud) is enabled in Phase 2.</p>
        <Link to="/" className="mt-4 inline-block text-sm font-bold uppercase tracking-wider text-primary hover:underline">← Back home</Link>
      </div>
    </div>
  );
}