import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CommunityPageShell } from "@/components/community/CommunityPageShell";
import { ClassicPostPreview } from "@/components/community/ClassicPostPreview";
import { CarouselPostPreview } from "@/components/community/CarouselPostPreview";
import { VideoPostPreview } from "@/components/community/VideoPostPreview";
import { SurfaceRaised } from "@/components/community/SurfaceRaised";
import { ButtonLink } from "@/components/ui/Button";

const DEMO_CLASSIC = {
  title: "Un petit pas compte",
  body: "Pas besoin de tout faire d’un coup. On avance tranquillement, ensemble. #ProchePlus #Aidants",
  poseKey: "encourage",
};

const DEMO_VIDEO = {
  title: "Une idée pour la visite",
  body: "Une activité courte, à votre rythme. L’ours vous accompagne — sans promesse clinique.",
  poseKey: "curiosite",
};

const DEMO_CARROUSEL = {
  title: "Trois gestes simples",
  body: "Un carrousel pour partager des repères concrets, à votre rythme. #ProchePlus #Aidants",
  slides: [
    {
      overlayText: "On commence tranquillement ?",
      poseKey: "accueil",
      accent: "teal" as const,
    },
    {
      overlayText: "Un petit pas compte déjà.",
      poseKey: "encourage",
      accent: "sun" as const,
    },
    {
      overlayText: "Prenez le temps qu’il faut.",
      poseKey: "patience",
      accent: "teal" as const,
    },
    {
      overlayText: "Et célébrez l’essai, pas la perfection.",
      poseKey: "celebration",
      accent: "sun" as const,
    },
  ],
};

function PreviewChrome({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <CommunityPageShell title={title} subtitle={subtitle}>
      <SurfaceRaised className="mb-2 border-teal/20 bg-gradient-to-br from-white via-cream to-cream-dark/40">
        <p className="text-sm text-text-muted">
          Aperçu fondateur — ours = mascotte produit Proche+. Corrigez avant
          deploy / Semi. Aucune PHI.
        </p>
      </SurfaceRaised>
      <div className="flex justify-center py-2">{children}</div>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/admin-produit/community/publications" size="sm" variant="ghost">
          Retour file
        </ButtonLink>
        <ButtonLink
          href="/admin-produit/community/publications/preview/demo-classique"
          size="sm"
          variant="ghost"
        >
          Classique
        </ButtonLink>
        <ButtonLink
          href="/admin-produit/community/publications/preview/demo-carrousel"
          size="sm"
          variant="ghost"
        >
          Carrousel
        </ButtonLink>
        <ButtonLink
          href="/admin-produit/community/publications/preview/demo-video"
          size="sm"
          variant="ghost"
        >
          Vidéo
        </ButtonLink>
      </div>
    </CommunityPageShell>
  );
}

export default async function PublicationPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "demo-classique") {
    return (
      <PreviewChrome
        title="Aperçu classique (démo)"
        subtitle="Post image unique — Instagram / Threads"
      >
        <ClassicPostPreview
          title={DEMO_CLASSIC.title}
          body={DEMO_CLASSIC.body}
          poseKey={DEMO_CLASSIC.poseKey}
        />
      </PreviewChrome>
    );
  }

  if (id === "demo-carrousel") {
    return (
      <PreviewChrome
        title="Aperçu carrousel (démo)"
        subtitle="Plusieurs slides + texte sur chaque image"
      >
        <CarouselPostPreview
          title={DEMO_CARROUSEL.title}
          body={DEMO_CARROUSEL.body}
          slides={DEMO_CARROUSEL.slides}
        />
      </PreviewChrome>
    );
  }

  if (id === "demo-video") {
    return (
      <PreviewChrome
        title="Aperçu vidéo (démo)"
        subtitle="Short Remotion 9:16 — TikTok / IG / Threads"
      >
        <VideoPostPreview
          title={DEMO_VIDEO.title}
          body={DEMO_VIDEO.body}
          poseKey={DEMO_VIDEO.poseKey}
        />
      </PreviewChrome>
    );
  }

  const pub = await prisma.communityPublication.findUnique({
    where: { id },
  });
  if (!pub) notFound();

  let slides: {
    overlayText: string;
    poseKey?: string | null;
    accent?: "teal" | "sun" | "terracotta";
  }[] = [];
  if (pub.slidesJson) {
    try {
      const raw = JSON.parse(pub.slidesJson) as {
        overlayText: string;
        poseKey?: string;
        accent?: "teal" | "sun" | "terracotta";
      }[];
      slides = raw.map((s) => ({
        overlayText: s.overlayText,
        accent: s.accent,
        poseKey: s.poseKey || pub.poseKey || "encourage",
      }));
    } catch {
      slides = [];
    }
  }

  return (
    <CommunityPageShell
      title={`Aperçu — ${pub.title || pub.kind}`}
      subtitle="Corriger avant deploy / Semi publish"
    >
      <SurfaceRaised className="mb-6 text-sm text-text-muted">
        Statut : {pub.status} · Type : {pub.kind} · Ours = mascotte produit · Aucune PHI.
      </SurfaceRaised>
      {pub.kind === "video" ? (
        <VideoPostPreview
          title={pub.title || "Proche+"}
          body={pub.body}
          poseKey={pub.poseKey}
        />
      ) : pub.kind === "carrousel" || slides.length > 0 ? (
        <CarouselPostPreview
          title={pub.title}
          body={pub.body}
          slides={
            slides.length > 0
              ? slides.map((s) => ({
                  ...s,
                  bearEnabled: pub.bearEnabled,
                }))
              : [
                  {
                    overlayText: pub.title || "Proche+",
                    poseKey: pub.poseKey || "encourage",
                    bearEnabled: pub.bearEnabled,
                  },
                ]
          }
        />
      ) : (
        <ClassicPostPreview
          title={pub.title}
          body={pub.body}
          poseKey={pub.poseKey}
          bearEnabled={pub.bearEnabled}
        />
      )}
      <div className="mt-6">
        <ButtonLink
          href={`/admin-produit/community/publications/${pub.id}`}
          size="sm"
        >
          Ouvrir le détail
        </ButtonLink>
      </div>
    </CommunityPageShell>
  );
}
