import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CommunityPageShell } from "@/components/community/CommunityPageShell";
import { SurfaceRaised } from "@/components/community/SurfaceRaised";
import { SectionTitle } from "@/components/ui/Card";
import {
  exportBlogArticleAction,
  generateSocialTeasersAction,
  publishBlogArticleAction,
} from "../../actions";
import { GEO_FORMAT_META } from "@/lib/community/blog-formats";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await prisma.communityBlogArticle.findUnique({
    where: { id },
    include: { teasers: true },
  });
  if (!article) notFound();

  return (
    <CommunityPageShell
      title={article.titleSeo}
      subtitle={`${article.status} · ${GEO_FORMAT_META[article.format].label}`}
    >
      <SurfaceRaised>
        <p className="text-sm text-text-muted">/{`blog/${article.slug}`}</p>
        {article.tldr ? (
          <p className="mt-2 rounded-xl bg-cream p-3 text-sm">{article.tldr}</p>
        ) : null}
        <pre className="mt-3 whitespace-pre-wrap text-sm">{article.bodyMarkdown}</pre>
        <div className="mt-4 flex flex-wrap gap-2">
          <form action={publishBlogArticleAction}>
            <input type="hidden" name="articleId" value={article.id} />
            <button type="submit" className="touch-target rounded-2xl bg-teal px-4 py-2 font-semibold text-white">
              Publier sur le site
            </button>
          </form>
          <form action={exportBlogArticleAction}>
            <input type="hidden" name="articleId" value={article.id} />
            <button type="submit" className="touch-target rounded-2xl bg-sun px-4 py-2 font-semibold">
              Exporter (markdown)
            </button>
          </form>
          <form action={generateSocialTeasersAction}>
            <input type="hidden" name="articleId" value={article.id} />
            <button type="submit" className="touch-target rounded-2xl border px-4 py-2 font-semibold">
              Générer teaser social
            </button>
          </form>
          {article.status === "publie" ? (
            <Link className="text-teal underline self-center" href={`/blog/${article.slug}`}>
              Voir public
            </Link>
          ) : null}
        </div>
      </SurfaceRaised>
      {article.teasers.length > 0 ? (
        <SurfaceRaised>
          <SectionTitle>Teasers sociaux liés</SectionTitle>
          <ul className="mt-2 text-sm">
            {article.teasers.map((t) => (
              <li key={t.id}>
                <Link
                  className="text-teal underline"
                  href={`/admin-produit/community/publications/preview/${t.id}`}
                >
                  {t.title || t.id}
                </Link>{" "}
                ({t.status})
              </li>
            ))}
          </ul>
        </SurfaceRaised>
      ) : null}
    </CommunityPageShell>
  );
}
