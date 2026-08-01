import { prisma } from "@/lib/prisma";
import { CommunityPageShell } from "@/components/community/CommunityPageShell";
import { SurfaceRaised } from "@/components/community/SurfaceRaised";
import { SectionTitle } from "@/components/ui/Card";
import { TextColorFields } from "@/components/community/TextColorFields";
import { createPublicationAction } from "../../actions";
import { channelsAllowedForKind } from "@/lib/community/publications";
import { SCENE_OPTIONS } from "@/lib/community/scenes";

const ALL_CHANNELS = ["instagram", "threads", "facebook", "tiktok"] as const;

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
      subtitle="Classique, carrousel ou vidéo — format adapté au réseau (IG / Threads / Facebook / TikTok)"
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
            placeholder="Légende / sous-texte du post"
            className="w-full rounded-2xl border border-cream-dark px-4 py-3"
          />

          <TextColorFields />

          <label className="block text-sm">
            <span className="mb-1 block font-semibold">
              Scène ours (en situation)
            </span>
            <select
              name="sceneKey"
              className="w-full rounded-2xl border border-cream-dark px-4 py-3"
              defaultValue="scene-communication"
            >
              {SCENE_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

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
            <option value="">Thème (optionnel)</option>
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
            <option value="">Scénario ours (optionnel)</option>
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
          <select
            name="poseKey"
            className="w-full rounded-2xl border border-cream-dark px-4 py-3"
            defaultValue="encourage"
          >
            <option value="accueil">Pose / scène liée — accueil</option>
            <option value="encourage">Pose / scène liée — encouragement</option>
            <option value="patience">Pose / scène liée — patience</option>
            <option value="celebration">Pose / scène liée — célébration</option>
            <option value="vigilance">Pose / scène liée — vigilance</option>
            <option value="curiosite">Pose / scène liée — curiosité</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="bearEnabled" defaultChecked />
            Inclure l’ours en situation
          </label>
          <fieldset className="text-sm">
            <legend className="font-semibold">
              Canaux (le premier pilote le format d’aperçu)
            </legend>
            {ALL_CHANNELS.map((ch) => {
              const allowedClassique = classiqueChannels.includes(ch);
              return (
                <label key={ch} className="mr-4 inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="channels"
                    value={ch}
                    defaultChecked={allowedClassique}
                  />
                  {ch}
                  {ch === "tiktok" ? " (vidéo seulement — refusé si classique/carrousel)" : ""}
                  {ch === "facebook" ? " (format fil adapté)" : ""}
                </label>
              );
            })}
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
