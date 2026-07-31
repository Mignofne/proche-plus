import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CommunityPageShell } from "@/components/community/CommunityPageShell";
import { SurfaceRaised } from "@/components/community/SurfaceRaised";
import { SectionTitle } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { POSE_PACK, EDITORIAL_GUARDS_FR } from "@/lib/community/illustrations";
import {
  createMediaAssetAction,
  createTemplateAction,
  applyTemplateToDraftAction,
} from "../actions";

export default async function CommunityContenusPage() {
  const [themes, templates, media, scenarios] = await Promise.all([
    prisma.communityTheme.findMany({ orderBy: { label: "asc" } }),
    prisma.communityTemplate.findMany({ orderBy: { name: "asc" } }),
    prisma.communityMediaAsset.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.communityBearScenario.findMany({ orderBy: { title: "asc" } }),
  ]);

  return (
    <CommunityPageShell
      title="Bibliothèque éditoriale"
      subtitle="Thèmes, templates, médias tracés, scénarios ours"
    >
      <SurfaceRaised>
        <SectionTitle>Garde-fous éditoriaux</SectionTitle>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text-muted">
          {EDITORIAL_GUARDS_FR.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </SurfaceRaised>

      <SurfaceRaised>
        <SectionTitle>Thèmes ({themes.length}/9)</SectionTitle>
        {themes.length === 0 ? (
          <p className="mt-2 text-sm text-text-muted">
            Exécutez <code>npm run db:seed-community</code> pour charger les 9
            thèmes.
          </p>
        ) : (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {themes.map((t) => {
              const tags = JSON.parse(t.suggestedTagsJson) as string[];
              return (
                <li key={t.id} className="rounded-xl bg-cream p-3 text-sm">
                  <strong>{t.label}</strong>
                  <p className="text-text-muted">{t.description}</p>
                  <p className="mt-1 text-xs text-teal">{tags.join(" ")}</p>
                </li>
              );
            })}
          </ul>
        )}
      </SurfaceRaised>

      <SurfaceRaised>
        <SectionTitle>Médias (licence + source obligatoires)</SectionTitle>
        <form action={createMediaAssetAction} className="mt-3 grid gap-2 sm:grid-cols-2">
          <input name="label" required placeholder="Libellé" className="rounded-2xl border border-cream-dark px-4 py-3" />
          <input name="url" required placeholder="URL ou /chemin" className="rounded-2xl border border-cream-dark px-4 py-3" />
          <input name="license" required placeholder="Licence" className="rounded-2xl border border-cream-dark px-4 py-3" />
          <input name="source" required placeholder="Source / provenance" className="rounded-2xl border border-cream-dark px-4 py-3" />
          <button type="submit" className="touch-target rounded-2xl bg-teal px-4 py-3 font-semibold text-white sm:col-span-2">
            Enregistrer le média
          </button>
        </form>
        <ul className="mt-3 space-y-2 text-sm">
          {media.map((m) => (
            <li key={m.id} className="rounded-xl border border-cream-dark px-3 py-2">
              {m.label} · {m.license} · {m.source}
            </li>
          ))}
          {media.length === 0 ? (
            <li className="text-text-muted">Aucun média — pose pack seedé ci-dessous.</li>
          ) : null}
        </ul>
        <div className="mt-4">
          <p className="text-sm font-semibold">Pose pack curaté</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {POSE_PACK.map((p) => (
              <div key={p.key} className="w-24 text-center text-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.assetPath} alt={p.label} className="mx-auto h-20 w-20" />
                {p.label}
              </div>
            ))}
          </div>
        </div>
      </SurfaceRaised>

      <SurfaceRaised>
        <SectionTitle>Templates texte</SectionTitle>
        <form action={createTemplateAction} className="mt-3 space-y-2">
          <input name="name" required placeholder="Nom" className="w-full rounded-2xl border border-cream-dark px-4 py-3" />
          <textarea
            name="body"
            required
            rows={4}
            placeholder="Corps avec {{marque}} {{cta}}…"
            className="w-full rounded-2xl border border-cream-dark px-4 py-3"
          />
          <select name="kind" className="rounded-2xl border border-cream-dark px-4 py-3">
            <option value="both">Classique + vidéo</option>
            <option value="classique">Classique</option>
            <option value="video">Vidéo</option>
          </select>
          <button type="submit" className="touch-target block rounded-2xl bg-teal px-4 py-3 font-semibold text-white">
            Créer le template
          </button>
        </form>
        <ul className="mt-3 space-y-2 text-sm">
          {templates.map((tpl) => (
            <li key={tpl.id} className="rounded-xl bg-cream p-3">
              <strong>{tpl.name}</strong> ({tpl.kind})
              <pre className="mt-1 whitespace-pre-wrap text-xs text-text-muted">{tpl.body}</pre>
              <form action={applyTemplateToDraftAction} className="mt-2 flex gap-2">
                <input type="hidden" name="templateId" value={tpl.id} />
                <select name="kind" className="rounded-xl border px-2 py-1">
                  <option value="classique">Classique</option>
                  <option value="video">Vidéo</option>
                </select>
                <button type="submit" className="rounded-xl bg-sun px-3 py-1 font-semibold">
                  Appliquer → brouillon
                </button>
              </form>
            </li>
          ))}
        </ul>
      </SurfaceRaised>

      <SurfaceRaised>
        <SectionTitle>Scénarios ours</SectionTitle>
        {scenarios.length === 0 ? (
          <p className="mt-2 text-sm text-text-muted">Seed community requis.</p>
        ) : (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {scenarios.map((s) => (
              <li key={s.id} className="rounded-xl border border-cream-dark p-3 text-sm">
                <strong>{s.title}</strong>
                <p className="text-text-muted">{s.bearRole}</p>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3">
          <ButtonLink href="/admin-produit/community/studio" size="sm">
            Ouvrir le studio vidéo
          </ButtonLink>
        </div>
      </SurfaceRaised>

      <Link href="/admin-produit/community/publications" className="text-teal text-sm">
        → Publications Semi
      </Link>
    </CommunityPageShell>
  );
}
