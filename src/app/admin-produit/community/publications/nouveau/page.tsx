import { prisma } from "@/lib/prisma";
import { CommunityPageShell } from "@/components/community/CommunityPageShell";
import { SurfaceRaised } from "@/components/community/SurfaceRaised";
import { SectionTitle } from "@/components/ui/Card";
import { TextColorFields } from "@/components/community/TextColorFields";
import { OursSituationFields } from "@/components/community/OursSituationFields";
import { createPublicationAction } from "../../actions";

const ALL_CHANNELS = ["instagram", "threads", "facebook", "tiktok"] as const;

export default async function NouvellePublicationPage() {
  const [themes, accounts, media, scenarios] = await Promise.all([
    prisma.communityTheme.findMany({ orderBy: { label: "asc" } }),
    prisma.communitySocialAccount.findMany({ where: { active: true } }),
    prisma.communityMediaAsset.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.communityBearScenario.findMany(),
  ]);

  return (
    <CommunityPageShell
      title="Nouveau post"
      subtitle="Contenu → situation ours → réseaux → format adapté"
    >
      <SurfaceRaised>
        <SectionTitle>Éditeur</SectionTitle>
        <form action={createPublicationAction} className="mt-3 space-y-3">
          <select
            name="kind"
            className="w-full rounded-2xl border border-cream-dark px-4 py-3"
            defaultValue="classique"
          >
            <option value="classique">
              Classique — image unique (IG / Threads / Facebook)
            </option>
            <option value="carrousel">
              Carrousel — scènes + texte (IG / Threads / Facebook)
            </option>
            <option value="video">
              Vidéo (TikTok + IG / Threads / Facebook)
            </option>
          </select>
          <input
            name="title"
            placeholder="Titre (sur l’image)"
            className="w-full rounded-2xl border border-cream-dark px-4 py-3"
          />
          <textarea
            name="body"
            required
            rows={5}
            placeholder="Légende du post"
            className="w-full rounded-2xl border border-cream-dark px-4 py-3"
          />

          <TextColorFields />

          <OursSituationFields />

          <textarea
            name="slidesJson"
            rows={4}
            placeholder='Carrousel — JSON : [{"overlayText":"…","subtitle":"…","sceneKey":"scene-cognitif","textColor":"#5B6BC0","subtitleColor":"#8B7BB5","accent":"teal"}]'
            className="w-full rounded-2xl border border-cream-dark px-4 py-3 font-mono text-xs"
          />
          <input
            name="tags"
            placeholder="Tags (#Aidants …)"
            className="w-full rounded-2xl border border-cream-dark px-4 py-3"
          />
          <select
            name="themeId"
            className="w-full rounded-2xl border border-cream-dark px-4 py-3"
            defaultValue=""
          >
            <option value="">Thème éditorial Community (optionnel)</option>
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          <select
            name="bearScenarioId"
            className="w-full rounded-2xl border border-cream-dark px-4 py-3"
            defaultValue=""
          >
            <option value="">Scénario CAP-9 (optionnel)</option>
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
          <input type="hidden" name="poseKey" value="encourage" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="bearEnabled" defaultChecked />
            Inclure l’ours en situation
          </label>
          <fieldset className="text-sm">
            <legend className="font-semibold">
              Réseaux de diffusion (le premier coché pilote le format d’aperçu)
            </legend>
            {ALL_CHANNELS.map((ch) => (
              <label key={ch} className="mr-4 inline-flex items-center gap-1">
                <input
                  type="checkbox"
                  name="channels"
                  value={ch}
                  defaultChecked={ch === "instagram"}
                />
                {ch}
                {ch === "tiktok"
                  ? " (vidéo seulement)"
                  : ""}
                {ch === "facebook" ? " (format fil / 16:9 vidéo)" : ""}
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
          <button
            type="submit"
            className="touch-target rounded-2xl bg-teal px-6 py-3 font-semibold text-white"
          >
            Enregistrer brouillon
          </button>
        </form>
      </SurfaceRaised>
    </CommunityPageShell>
  );
}
