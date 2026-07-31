import { SiteHeader } from "@/components/layout/SiteHeader";

export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-gradient-to-b from-cream via-cream to-teal/5">
      <SiteHeader variant="public" />
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <article className="rounded-3xl border border-cream-dark bg-white p-6 shadow-sm sm:p-10">
          <h1 className="text-3xl font-bold text-teal-dark">{title}</h1>
          <p className="mt-4 text-text-muted">{intro}</p>
          <div className="mt-8 space-y-7 leading-7 text-text">{children}</div>
        </article>
      </main>
    </div>
  );
}
