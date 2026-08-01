import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CommunityPageShell } from "@/components/community/CommunityPageShell";
import { ClassicPostPreview } from "@/components/community/ClassicPostPreview";
import { CarouselPostPreview } from "@/components/community/CarouselPostPreview";
import { VideoPostPreview } from "@/components/community/VideoPostPreview";
import { SurfaceRaised } from "@/components/community/SurfaceRaised";
import { ButtonLink } from "@/components/ui/Button";
import { resolvePrimaryChannel } from "@/lib/community/formats";
import type { CommunitySocialChannel } from "@prisma/client";

const DEMO_CLASSIC = {
  title: "Un petit pas compte",
  body: "Pas besoin de tout faire d’un coup. On avance tranquillement, ensemble. #ProchePlus #Aidants",
  poseKey: "encourage",
  titleColor: "#5B6BC0",
  subtitleColor: "#8B7BB5",
  sceneKey: "scene-cognitif",
};

const DEMO_VIDEO = {
  title: "Une idée pour la visite",
  body: "Une activité courte, à votre rythme — sans promesse clinique.",
  poseKey: "curiosite",
  titleColor: "#5B6BC0",
  subtitleColor: "#8B7BB5",
  sceneKey: "scene-communication",
};

const DEMO_CARROUSEL = {
  title: "Trois gestes simples",
  body: "Un carrousel pour partager des repères concrets, à votre rythme. #ProchePlus #Aidants",
  titleColor: "#5B6BC0",
  slides: [
    {
      overlayText: "On commence tranquillement ?",
      subtitle: "Un premier geste, à votre rythme.",
      poseKey: "accueil",
      sceneKey: "scene-communication",
      accent: "teal" as const,
      textColor: "#5B6BC0",
      subtitleColor: "#8B7BB5",
    },
    {
      overlayText: "Un petit pas compte déjà.",
      subtitle: "Pas besoin d’être parfait.",
      poseKey: "encourage",
      sceneKey: "scene-cognitif",
      accent: "sun" as const,
      textColor: "#2A9D8F",
      subtitleColor: "#5C5650",
    },
    {
      overlayText: "Prenez le temps qu’il faut.",
      subtitle: "La régularité avant la performance.",
      poseKey: "patience",
      sceneKey: "scene-mobilite-lit",
      accent: "teal" as const,
      textColor: "#5B6BC0",
      subtitleColor: "#8B7BB5",
    },
    {
      overlayText: "Et célébrez l’essai, pas la perfection.",
      subtitle: "Chaque essai compte.",
      poseKey: "celebration",
      sceneKey: "scene-habillage",
      accent: "sun" as const,
      textColor: "#C67B5C",
      subtitleColor: "#5C5650",
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
          Aperçu fondateur du post — ours en situation + couleurs texte. Format
          adapté au réseau cible. Corrigez avant deploy / Semi. Aucune PHI.
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
        <ButtonLink
          href="/admin-produit/community/publications/preview/demo-facebook"
          size="sm"
          variant="ghost"
        >
          Facebook
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
        subtitle="Ours en situation — Instagram / Threads"
      >
        <ClassicPostPreview
          title={DEMO_CLASSIC.title}
          body={DEMO_CLASSIC.body}
          poseKey={DEMO_CLASSIC.poseKey}
          titleColor={DEMO_CLASSIC.titleColor}
          subtitleColor={DEMO_CLASSIC.subtitleColor}
          sceneKey={DEMO_CLASSIC.sceneKey}
          channels={["instagram", "threads"]}
        />
      </PreviewChrome>
    );
  }

  if (id === "demo-facebook") {
    return (
      <PreviewChrome
        title="Aperçu Facebook (démo)"
        subtitle="Format fil 1.91:1 — ours en situation"
      >
        <ClassicPostPreview
          title={DEMO_CLASSIC.title}
          body={DEMO_CLASSIC.body}
          poseKey={DEMO_CLASSIC.poseKey}
          titleColor={DEMO_CLASSIC.titleColor}
          subtitleColor={DEMO_CLASSIC.subtitleColor}
          sceneKey={DEMO_CLASSIC.sceneKey}
          channels={["facebook"]}
        />
      </PreviewChrome>
    );
  }

  if (id === "demo-carrousel") {
    return (
      <PreviewChrome
        title="Aperçu carrousel (démo)"
        subtitle="Scènes + couleurs texte par slide"
      >
        <CarouselPostPreview
          title={DEMO_CARROUSEL.title}
          body={DEMO_CARROUSEL.body}
          slides={DEMO_CARROUSEL.slides}
          titleColor={DEMO_CARROUSEL.titleColor}
          channels={["instagram", "threads"]}
        />
      </PreviewChrome>
    );
  }

  if (id === "demo-video") {
    return (
      <PreviewChrome
        title="Aperçu vidéo (démo)"
        subtitle="Short Remotion — format selon réseau"
      >
        <VideoPostPreview
          title={DEMO_VIDEO.title}
          body={DEMO_VIDEO.body}
          poseKey={DEMO_VIDEO.poseKey}
          titleColor={DEMO_VIDEO.titleColor}
          subtitleColor={DEMO_VIDEO.subtitleColor}
          sceneKey={DEMO_VIDEO.sceneKey}
          channels={["instagram", "threads", "tiktok"]}
        />
      </PreviewChrome>
    );
  }

  const pub = await prisma.communityPublication.findUnique({
    where: { id },
    include: {
      targets: true,
      theme: true,
    },
  });
  if (!pub) notFound();

  let channelsFromJson: CommunitySocialChannel[] = [];
  try {
    const parsed = JSON.parse(pub.channelsJson || "[]") as string[];
    channelsFromJson = parsed.filter(
      (c): c is CommunitySocialChannel =>
        c === "instagram" ||
        c === "threads" ||
        c === "tiktok" ||
        c === "facebook"
    );
  } catch {
    channelsFromJson = [];
  }
  // channelsJson (ordre de coche) prioritaire pour le format ; targets en secours
  const targetChannels = [
    ...channelsFromJson,
    ...pub.targets.map((t) => t.channel),
  ];
  const primary = resolvePrimaryChannel(targetChannels);

  let slides: {
    overlayText: string;
    subtitle?: string | null;
    poseKey?: string | null;
    sceneKey?: string | null;
    imageSrc?: string | null;
    accent?: "teal" | "sun" | "terracotta";
    textColor?: string | null;
    subtitleColor?: string | null;
  }[] = [];
  if (pub.slidesJson) {
    try {
      const raw = JSON.parse(pub.slidesJson) as {
        overlayText: string;
        subtitle?: string;
        poseKey?: string;
        sceneKey?: string;
        imageSrc?: string;
        accent?: "teal" | "sun" | "terracotta";
        textColor?: string;
        subtitleColor?: string;
      }[];
      slides = raw.map((s) => ({
        overlayText: s.overlayText,
        subtitle: s.subtitle,
        accent: s.accent,
        poseKey: s.poseKey || pub.poseKey || "encourage",
        sceneKey: s.sceneKey || pub.sceneKey,
        imageSrc: s.imageSrc,
        textColor: s.textColor || pub.titleColor,
        subtitleColor: s.subtitleColor || pub.subtitleColor,
      }));
    } catch {
      slides = [];
    }
  }

  const channels = (
    targetChannels.length > 0 ? targetChannels : [primary]
  ) as CommunitySocialChannel[];

  return (
    <CommunityPageShell
      title={`Aperçu — ${pub.title || pub.kind}`}
      subtitle="Corriger avant deploy / mise en ligne du post"
    >
      <SurfaceRaised className="mb-6 text-sm text-text-muted">
        Statut : {pub.status} · Type : {pub.kind} · Canal principal : {primary} ·
        Ours en situation · Aucune PHI.
      </SurfaceRaised>
      {pub.kind === "video" ? (
        <VideoPostPreview
          title={pub.title || "Proche+"}
          body={pub.body}
          poseKey={pub.poseKey}
          titleColor={pub.titleColor}
          subtitleColor={pub.subtitleColor}
          sceneKey={pub.sceneKey}
          themeSlug={pub.theme?.slug}
          channels={channels}
          bearEnabled={pub.bearEnabled}
        />
      ) : pub.kind === "carrousel" || slides.length > 0 ? (
        <CarouselPostPreview
          title={pub.title}
          body={pub.body}
          titleColor={pub.titleColor}
          subtitleColor={pub.subtitleColor}
          themeSlug={pub.theme?.slug}
          channels={channels}
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
                    sceneKey: pub.sceneKey,
                    textColor: pub.titleColor,
                    subtitleColor: pub.subtitleColor,
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
          titleColor={pub.titleColor}
          subtitleColor={pub.subtitleColor}
          sceneKey={pub.sceneKey}
          themeSlug={pub.theme?.slug}
          channels={channels}
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
