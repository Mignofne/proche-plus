import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CommunityPageShell } from "@/components/community/CommunityPageShell";
import { SurfaceRaised } from "@/components/community/SurfaceRaised";
import { SectionTitle } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { GEO_FORMAT_META } from "@/lib/community/blog-formats";

export default async function CommunityBlogAdminPage() {
  const articles = await prisma.communityBlogArticle.findMany({
    orderBy: { updatedAt: "desc" },
    include: { theme: true },
  });

  return (
    <CommunityPageShell
      title="Blog SEO+GEO"
      subtitle="Articles CMS distincts des posts sociaux — pas de promesse de ranking génératif"
    >
      <SurfaceRaised>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionTitle>Articles</SectionTitle>
          <ButtonLink href="/admin-produit/community/blog/nouveau" size="sm">
            Nouvel article
          </ButtonLink>
        </div>
        {articles.length === 0 ? (
          <p className="mt-3 text-sm text-text-muted">
            Aucun article. Formats disponibles :{" "}
            {Object.values(GEO_FORMAT_META)
              .map((f) => f.label)
              .join(", ")}
            .
          </p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {articles.map((a) => (
              <li key={a.id} className="rounded-xl border border-cream-dark p-3">
                <Link
                  className="font-semibold text-teal-dark"
                  href={`/admin-produit/community/blog/${a.id}`}
                >
                  {a.titleSeo}
                </Link>
                <span className="text-text-muted">
                  {" "}
                  · {a.status} · {GEO_FORMAT_META[a.format].label} · /blog/{a.slug}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SurfaceRaised>
    </CommunityPageShell>
  );
}
