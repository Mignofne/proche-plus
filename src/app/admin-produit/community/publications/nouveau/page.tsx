import { prisma } from "@/lib/prisma";
import { CommunityPageShell } from "@/components/community/CommunityPageShell";
import { SurfaceRaised } from "@/components/community/SurfaceRaised";
import { SectionTitle } from "@/components/ui/Card";
import { createPublicationAction } from "../../actions";
import { channelsAllowedForKind } from "@/lib/community/publications";

export default async function NouvellePublicationPage() {
  const [themes, accounts, media, scenarios] = await Promise.all([
    prisma.communityTheme.findMany({ orderBy: { label: "asc" } }),
    prisma.communitySocialAccount.findMany({ where: { active: true } }),
    prisma.communityMediaAsset.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.communityBearScenario.findMany(),
  ]);

  const classiqueChannels = channelsAllowedForKind("classique");

  return (
    <CommunityPageShell
      title="Nouvelle publication"
      subtitle="Classique, carrousel ou vidéo — règles canaux Semi"
    >
      <SurfaceRaised>
        <SectionTitle>Éditeur</SectionTitle>
        <form action={createPublicationAction} className="mt-3 space-y-3">
          <select name="kind" className="w-full rounded-2xl border border-cream-dark px-4 py-3" defaultValue="classique">
            <option value="classique">Classique — image unique (IG / Threads)</option>
            <option value="carrousel">Carrousel — plusieurs slides + texte sur image (IG / Threads)</option>
            <option value="video">Vidéo (TikTok + IG / Threads)</option>
          </select>
          <input name="title" placeholder="Titre interne" className="w-full rounded-2xl border border-cream-dark px-4 py-3" />
          <textarea name="body" required rows={5} placeholder="Légende / texte du post" className="w-full rounded-2xl border border-cream-dark px-4 py-3" />
          <textarea
            name="slidesJson"
            rows={4}
            placeholder='Carrousel (optionnel) — JSON slides : [{"overlayText":"…","poseKey":"encourage","accent":"teal"}]'
            className="w-full rounded-2xl border border-cream-dark px-4 py-3 font-mono text-xs"
          />
          <input name="tags" placeholder="Tags (#Aidants …)" className="w-full rounded-2xl border border-cream-dark px-4 py-3" />
          <select name="themeId" className="w-full rounded-2xl border border-cream-dark px-4 py-3" defaultValue="">
            <option value="">Thème (optionnel)</option>
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          <select name="bearScenarioId" className="w-full rounded-2xl border border-cream-dark px-4 py-3" defaultValue="">
            <option value="">Scénario ours (optionnel)</option>
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
          <select name="poseKey" className="w-full rounded-2xl border border-cream-dark px-4 py-3" defaultValue="encourage">
            <option value="accueil">Pose accueil</option>
            <option value="encourage">Pose encouragement</option>
            <option value="patience">Pose patience</option>
            <option value="celebration">Pose célébration</option>
            <option value="vigilance">Pose vigilance</option>
            <option value="curiosite">Pose curiosité</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="bearEnabled" defaultChecked />
            Inclure l’ours
          </label>
          <fieldset className="text-sm">
            <legend className="font-semibold">Canaux (classique = pas TikTok)</legend>
            {(["instagram", "threads", "tiktok"] as const).map((ch) => (
              <label key={ch} className="mr-4 inline-flex items-center gap-1">
                <input
                  type="checkbox"
                  name="channels"
                  value={ch}
                  defaultChecked={classiqueChannels.includes(ch)}
                  disabled={ch === "tiktok"}
                />
                {ch}
                {ch === "tiktok" ? " (vidéo seulement)" : ""}
              </label>
            ))}
          </fieldset>
          <fieldset className="text-sm">
            <legend className="font-semibold">Comptes</legend>
            {accounts.map((a) => (
              <label key={a.id} className="mr-3 inline-flex items-center gap-1">
                <input type="checkbox" name="accountIds" value={a.id} />
                {a.label} ({a.channel})
              </label>
            ))}
            {accounts.length === 0 ? (
              <p className="text-text-muted">Ajoutez des comptes d’abord.</p>
            ) : null}
          </fieldset>
          <fieldset className="text-sm">
            <legend className="font-semibold">Médias licence-ok</legend>
            {media.map((m) => (
              <label key={m.id} className="mr-3 inline-flex items-center gap-1">
                <input type="checkbox" name="mediaIds" value={m.id} />
                {m.label}
              </label>
            ))}
          </fieldset>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isTestimonial" />
            Témoignage
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isAttributable" />
            Citation / portrait attribuable (CAP-11)
          </label>
          <button type="submit" className="touch-target rounded-2xl bg-teal px-6 py-3 font-semibold text-white">
            Enregistrer brouillon
          </button>
        </form>
      </SurfaceRaised>
    </CommunityPageShell>
  );
}
