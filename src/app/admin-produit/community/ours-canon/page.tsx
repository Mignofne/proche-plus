import { CommunityPageShell } from "@/components/community/CommunityPageShell";
import { SurfaceRaised } from "@/components/community/SurfaceRaised";
import { ButtonLink } from "@/components/ui/Button";
import {
  CANON_IMAGE_PATH,
  SCENE_OPTIONS,
} from "@/lib/community/scenes";

const CONCEPTS = [
  {
    id: "C-v3",
    title: "C-v3 — Canon (sans nœud, fleurs mexicaines, pattes d’oie)",
    src: CANON_IMAGE_PATH,
  },
  {
    id: "C-v2",
    title: "C-v2 — Itération précédente",
    src: "/community-assets/ours-canon/canon-c-v2.png",
  },
  {
    id: "C",
    title: "C — Planche initiale (archive)",
    src: "/community-assets/ours-canon/reference-sheet-v1.png",
  },
  {
    id: "A",
    title: "A — Face / studio (archive)",
    src: "/community-assets/ours-canon/canon-face.png",
  },
  {
    id: "B",
    title: "B — Front corps entier (archive)",
    src: "/community-assets/ours-canon/canon-front.png",
  },
] as const;

export default function OursCanonPage() {
  return (
    <CommunityPageShell
      title="Canon ours — validation"
      subtitle="Kit C-v3 adopté + scènes référentiel — même source que les publications Community."
      actions={
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/admin-produit/community/studio-ours" size="sm">
            Studio Ours
          </ButtonLink>
          <ButtonLink
            href="/admin-produit/community/publications/nouveau"
            size="sm"
            variant="ghost"
          >
            Nouvelle publication
          </ButtonLink>
        </div>
      }
    >
      <div className="grid gap-8">
        {CONCEPTS.map((c) => (
          <SurfaceRaised key={c.id} className="space-y-3">
            <h2 className="text-lg font-bold text-teal-dark">{c.title}</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.src}
              alt={c.title}
              className="w-full max-w-xl rounded-2xl border border-cream-dark bg-cream object-contain"
            />
            <p className="text-sm text-text-muted">
              Fichier : <code>{c.src}</code>
            </p>
          </SurfaceRaised>
        ))}

        <h2 className="text-xl font-bold text-teal-dark">
          Scènes référentiel (kit posts Community)
        </h2>
        <p className="text-sm text-text-muted">
          Ces scènes alimentent l’éditeur de publications (ours en situation) —
          source unique via <code>src/lib/community/scenes.ts</code>.
        </p>
        {SCENE_OPTIONS.map((s) => (
          <SurfaceRaised key={s.value} className="space-y-3">
            <h3 className="text-lg font-bold text-teal-dark">{s.label}</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.src}
              alt={s.label}
              className="w-full max-w-xl rounded-2xl border border-cream-dark bg-cream object-contain"
            />
            <p className="text-sm text-text-muted">
              Clé : <code>{s.value}</code> · Fichier : <code>{s.src}</code>
            </p>
          </SurfaceRaised>
        ))}
      </div>
    </CommunityPageShell>
  );
}
