import { CommunityPageShell } from "@/components/community/CommunityPageShell";
import { SurfaceRaised } from "@/components/community/SurfaceRaised";
import { ButtonLink } from "@/components/ui/Button";

const CONCEPTS = [
  {
    id: "C-v3",
    title: "C-v3 — Canon (sans nœud, fleurs mexicaines, pattes d’oie)",
    src: "/community-assets/ours-canon/canon-c-v3.png",
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

const SCENES = [
  {
    id: "habillage",
    title: "S'habiller",
    src: "/community-assets/ours-canon/scenes-referentiel/scene-habillage.png",
  },
  {
    id: "repas",
    title: "Manger",
    src: "/community-assets/ours-canon/scenes-referentiel/scene-repas.png",
  },
  {
    id: "deplacement",
    title: "Se déplacer",
    src: "/community-assets/ours-canon/scenes-referentiel/scene-deplacement.png",
  },
  {
    id: "fauteuil-freins",
    title: "Fauteuil (freins)",
    src: "/community-assets/ours-canon/scenes-referentiel/scene-fauteuil-freins.png",
  },
  {
    id: "toilette",
    title: "Toilette / hygiène",
    src: "/community-assets/ours-canon/scenes-referentiel/scene-toilette.png",
  },
  {
    id: "mobilite-lit",
    title: "Mobilité au lit",
    src: "/community-assets/ours-canon/scenes-referentiel/scene-mobilite-lit.png",
  },
  {
    id: "communication",
    title: "Communication",
    src: "/community-assets/ours-canon/scenes-referentiel/scene-communication.png",
  },
  {
    id: "cognitif",
    title: "Mémoire / attention",
    src: "/community-assets/ours-canon/scenes-referentiel/scene-cognitif.png",
  },
] as const;

export default function OursCanonPage() {
  return (
    <CommunityPageShell
      title="Canon ours — validation"
      subtitle="Choisis A, B ou C et dis ce qu’il faut corriger (mono-sourcil, mèche, tenue, ton)."
      actions={
        <ButtonLink
          href="/admin-produit/community/studio-ours"
          size="sm"
        >
          Studio Ours
        </ButtonLink>
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

        <h2 className="text-xl font-bold text-teal-dark">Scènes référentiel</h2>
        {SCENES.map((s) => (
          <SurfaceRaised key={s.id} className="space-y-3">
            <h3 className="text-lg font-bold text-teal-dark">{s.title}</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.src}
              alt={s.title}
              className="w-full max-w-xl rounded-2xl border border-cream-dark bg-cream object-contain"
            />
            <p className="text-sm text-text-muted">
              Fichier : <code>{s.src}</code>
            </p>
          </SurfaceRaised>
        ))}
      </div>
    </CommunityPageShell>
  );
}
