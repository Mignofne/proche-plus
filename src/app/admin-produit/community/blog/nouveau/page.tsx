import { prisma } from "@/lib/prisma";
import { CommunityPageShell } from "@/components/community/CommunityPageShell";
import { SurfaceRaised } from "@/components/community/SurfaceRaised";
import { SectionTitle } from "@/components/ui/Card";
import { createBlogArticleAction } from "../../actions";
import { GEO_FORMAT_META } from "@/lib/community/blog-formats";
import { HEALTH_DISCLAIMER_BODY } from "@/lib/community/health-disclaimer";

export default async function NouvelArticlePage() {
  const themes = await prisma.communityTheme.findMany({ orderBy: { label: "asc" } });

  return (
    <CommunityPageShell title="Nouvel article" subtitle="Picker de format CMS GEO">
      <SurfaceRaised>
        <SectionTitle>Éditeur</SectionTitle>
        <form action={createBlogArticleAction} className="mt-3 space-y-3">
          <select name="format" required className="w-full rounded-2xl border px-4 py-3" defaultValue="definition_glossaire">
            {Object.entries(GEO_FORMAT_META).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}
              </option>
            ))}
          </select>
          <input name="titleSeo" required placeholder="Titre SEO" className="w-full rounded-2xl border px-4 py-3" />
          <input name="metaDescription" required placeholder="Méta-description (≤155)" className="w-full rounded-2xl border px-4 py-3" />
          <input name="slug" required placeholder="slug-fr" className="w-full rounded-2xl border px-4 py-3" />
          <textarea name="tldr" rows={2} placeholder="TL;DR" className="w-full rounded-2xl border px-4 py-3" />
          <input name="authorName" required defaultValue="Équipe Proche+" className="w-full rounded-2xl border px-4 py-3" />
          <input name="authorExpertise" required defaultValue="Éditorial Proche+" className="w-full rounded-2xl border px-4 py-3" />
          <select name="themeId" className="w-full rounded-2xl border px-4 py-3" defaultValue="">
            <option value="">Thème</option>
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          <textarea name="bodyMarkdown" required rows={8} placeholder="Corps markdown" className="w-full rounded-2xl border px-4 py-3" />
          <textarea
            name="faqJson"
            rows={2}
            placeholder='FAQ JSON si format faq-qr : [{"question":"…","answer":"…"}]'
            className="w-full rounded-2xl border px-4 py-3"
          />
          <textarea
            name="howtoJson"
            rows={2}
            placeholder='HowTo JSON si guide : [{"titre":"…","detail":"…"}]'
            className="w-full rounded-2xl border px-4 py-3"
          />
          <input name="sourcesJson" defaultValue="[]" className="w-full rounded-2xl border px-4 py-3" />
          <input name="tagsJson" defaultValue='["#ProchePlus"]' className="w-full rounded-2xl border px-4 py-3" />
          <textarea
            name="disclaimer"
            rows={3}
            defaultValue={HEALTH_DISCLAIMER_BODY}
            className="w-full rounded-2xl border px-4 py-3"
          />
          <button type="submit" className="touch-target rounded-2xl bg-teal px-6 py-3 font-semibold text-white">
            Sauver brouillon
          </button>
        </form>
      </SurfaceRaised>
    </CommunityPageShell>
  );
}
