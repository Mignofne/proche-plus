import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HealthDisclaimer } from "@/components/community/HealthDisclaimer";
import { buildArticleJsonLd } from "@/lib/community/blog-formats";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await prisma.communityBlogArticle.findFirst({
    where: { slug, status: "publie" },
  });
  if (!article) return { title: "Article | Proche+" };
  return {
    title: `${article.titleSeo} | Proche+`,
    description: article.metaDescription,
  };
}

export default async function BlogPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await prisma.communityBlogArticle.findFirst({
    where: { slug, status: "publie" },
  });
  if (!article) notFound();

  const schemas = buildArticleJsonLd(article);

  return (
    <div className="min-h-full bg-gradient-to-b from-cream via-cream to-teal/5">
      <SiteHeader variant="public" />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <article className="rounded-3xl border border-cream-dark bg-white p-6 shadow-sm sm:p-10">
          <p className="text-sm text-text-muted">
            {article.publishedAt
              ? `Publié le ${article.publishedAt.toLocaleDateString("fr-FR")}`
              : null}
            {article.updatedContentAt
              ? ` · Mis à jour le ${article.updatedContentAt.toLocaleDateString("fr-FR")}`
              : null}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-teal-dark">
            {article.titleSeo}
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            {article.authorName} — {article.authorExpertise}
          </p>
          {article.tldr ? (
            <div className="mt-6 rounded-2xl bg-cream p-4">
              <p className="text-xs font-bold uppercase text-teal">TL;DR</p>
              <p className="mt-1">{article.tldr}</p>
            </div>
          ) : null}
          <div className="prose mt-8 max-w-none whitespace-pre-wrap leading-7 text-text">
            {article.bodyMarkdown}
          </div>
          <div className="mt-8">
            <HealthDisclaimer />
            <p className="mt-3 text-sm text-text-muted">{article.disclaimer}</p>
          </div>
          <p className="mt-6 text-xs text-text-muted">
            Contenu structuré pour la recherche et la citabilité — sans garantie
            de citation par un moteur génératif.
          </p>
        </article>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
    </div>
  );
}
