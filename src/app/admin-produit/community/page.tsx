import Link from "next/link";
import { SurfaceRaised } from "@/components/community/SurfaceRaised";
import { CommunityPageShell } from "@/components/community/CommunityPageShell";
import { ButtonLink } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/Card";
import { COMMUNITY_UI } from "@/lib/community/ui-tokens";
import { cn } from "@/lib/utils";

const SECTIONS = [
  {
    href: "/admin-produit/community/beta",
    title: "Programme bêta",
    description:
      "Registre des bêta-testeurs et inbox des candidatures.",
    emptyMessage: "Les candidatures apparaîtront ici.",
    ctaLabel: "Ouvrir le programme bêta",
  },
  {
    href: "/admin-produit/community/contenus",
    title: "Bibliothèque éditoriale",
    description: "Thèmes, templates, médias et ours pour vos contenus.",
    emptyMessage: "Aucun contenu éditorial pour le moment.",
    ctaLabel: "Ouvrir la bibliothèque",
  },
  {
    href: "/admin-produit/community/publications",
    title: "Publications Semi",
    description: "File, calendrier et éditeur des publications sociales.",
    emptyMessage: "Aucune publication planifiée.",
    ctaLabel: "Créer une publication",
  },
  {
    href: "/admin-produit/community/blog",
    title: "Blog SEO+GEO",
    description: "Articles publics orientés référencement et citabilité.",
    emptyMessage: "Aucun article de blog pour l’instant.",
    ctaLabel: "Préparer un article",
  },
  {
    href: "/admin-produit/community/comptes",
    title: "Comptes sociaux",
    description: "Liens Instagram, Threads et TikTok du fondateur.",
    emptyMessage: "Aucun compte social enregistré.",
    ctaLabel: "Gérer les comptes",
  },
  {
    href: "/admin-produit/community/studio",
    title: "Studio vidéo",
    description: "Preview Remotion in-house avant publication Semi.",
    emptyMessage: "Composez une vidéo courte on-brand.",
    ctaLabel: "Ouvrir le studio",
  },
  {
    href: "/admin-produit/community/studio-ours",
    title: "Studio Ours",
    description:
      "Générer une scène illustrée (situation · émotion · lieu) — canon C-v3.",
    emptyMessage: "Phase 1 mock : compose le prompt verrouillé.",
    ctaLabel: "Ouvrir Studio Ours",
  },
  {
    href: "/admin-produit/community/ours-canon",
    title: "Canon ours",
    description: "Sheet C-v3 et scènes référentiel pour validation fondateur.",
    emptyMessage: "Consultez le canon avant de générer.",
    ctaLabel: "Voir le canon",
  },
] as const;

export default function CommunityHubPage() {
  return (
    <CommunityPageShell
      title="Community"
      subtitle="Communication et acquisition — hors périmètre clinique"
      actions={
        <>
          <Link href="/admin-produit" className="text-teal">
            KPIs
          </Link>
          <Link href="/admin-produit/exercices" className="text-teal">
            Catalogue exercices
          </Link>
        </>
      }
    >
      <p className={cn("text-sm", COMMUNITY_UI.muted)}>
        Pilotez bêta, contenus, publications et blog depuis un seul hub.
        Aucune donnée patient ou établissement ici.
      </p>

      <SurfaceRaised className="border-teal/25 bg-teal/5">
        <SectionTitle className="text-base">Aperçus fondateur</SectionTitle>
        <p className={cn("mt-2 text-sm", COMMUNITY_UI.muted)}>
          Vérifiez le rendu avant deploy / publication Semi.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <ButtonLink
            href="/admin-produit/community/publications/preview/demo-classique"
            size="sm"
          >
            Classique
          </ButtonLink>
          <ButtonLink
            href="/admin-produit/community/publications/preview/demo-carrousel"
            size="sm"
            variant="secondary"
          >
            Carrousel
          </ButtonLink>
          <ButtonLink
            href="/admin-produit/community/publications/preview/demo-video"
            size="sm"
            variant="secondary"
          >
            Vidéo
          </ButtonLink>
        </div>
      </SurfaceRaised>

      <div className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <SurfaceRaised key={section.href} className="flex flex-col">
            <SectionTitle className="text-base">{section.title}</SectionTitle>
            <p className={cn("mt-2 flex-1 text-sm", COMMUNITY_UI.muted)}>
              {section.description}
            </p>
            <p className={cn("mt-3 text-sm", COMMUNITY_UI.muted)}>
              {section.emptyMessage}
            </p>
            <div className="mt-4">
              <ButtonLink href={section.href} size="sm" variant="secondary">
                {section.ctaLabel}
              </ButtonLink>
            </div>
          </SurfaceRaised>
        ))}
      </div>
    </CommunityPageShell>
  );
}
