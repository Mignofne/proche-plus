/**
 * Seed Community marketing data (thèmes, ours, médias pose pack, pubs démo, comptes).
 * Usage: npx tsx prisma/seed-community.ts
 * Aucune donnée clinique.
 */
import { PrismaClient } from "@prisma/client";
import { COMMUNITY_THEME_SEED } from "../src/lib/community/themes";
import {
  BEAR_SCENARIO_SEED,
  POSE_PACK,
} from "../src/lib/community/illustrations";
import { SCENE_OPTIONS } from "../src/lib/community/scenes";
import { HEALTH_DISCLAIMER_BODY } from "../src/lib/community/health-disclaimer";

const prisma = new PrismaClient();

async function main() {
  for (const t of COMMUNITY_THEME_SEED) {
    await prisma.communityTheme.upsert({
      where: { slug: t.slug },
      create: {
        slug: t.slug,
        label: t.label,
        description: t.description,
        networksJson: JSON.stringify(t.networks),
        formatsJson: JSON.stringify(t.formats),
        suggestedTagsJson: JSON.stringify(t.suggestedTags),
      },
      update: {
        label: t.label,
        description: t.description,
        networksJson: JSON.stringify(t.networks),
        formatsJson: JSON.stringify(t.formats),
        suggestedTagsJson: JSON.stringify(t.suggestedTags),
      },
    });
  }

  const themes = await prisma.communityTheme.findMany();
  const themeBySlug = Object.fromEntries(themes.map((t) => [t.slug, t]));

  for (const s of BEAR_SCENARIO_SEED) {
    await prisma.communityBearScenario.upsert({
      where: { slug: s.slug },
      create: {
        slug: s.slug,
        title: s.title,
        bearRole: s.bearRole,
        beatSheetJson: JSON.stringify(s.beatSheet),
        suggestedTagsJson: JSON.stringify(s.suggestedTags),
        poseKeysJson: JSON.stringify(s.poseKeys),
        themeId: themeBySlug[s.themeSlug]?.id,
      },
      update: {
        title: s.title,
        bearRole: s.bearRole,
        beatSheetJson: JSON.stringify(s.beatSheet),
        suggestedTagsJson: JSON.stringify(s.suggestedTags),
        poseKeysJson: JSON.stringify(s.poseKeys),
        themeId: themeBySlug[s.themeSlug]?.id,
      },
    });
  }

  for (const p of POSE_PACK) {
    const existing = await prisma.communityMediaAsset.findFirst({
      where: { poseKey: p.key, isPosePack: true },
    });
    if (!existing) {
      await prisma.communityMediaAsset.create({
        data: {
          label: `Pose pack — ${p.label}`,
          url: p.assetPath,
          mimeType: "image/svg+xml",
          license: "Proche+ kit interne curaté",
          source: "community-assets/bear-pose-pack",
          provenance: "provenance.json v1.0.0 — AD-11 kit-only MVP",
          isPosePack: true,
          poseKey: p.key,
        },
      });
    }
  }

  // Kit scènes référentiel (ours en situation) — même source que Community posts
  for (const scene of SCENE_OPTIONS) {
    const existing = await prisma.communityMediaAsset.findFirst({
      where: { url: scene.src },
    });
    if (!existing) {
      await prisma.communityMediaAsset.create({
        data: {
          label: `Scène référentiel — ${scene.label}`,
          url: scene.src,
          mimeType: "image/png",
          license: "Proche+ kit interne curaté (canon C-v3)",
          source: "community-assets/ours-canon/scenes-referentiel",
          provenance: "ours-canon C-v3 [ADOPTED] — scènes fondateur",
          isPosePack: false,
          poseKey: scene.value,
        },
      });
    }
  }

  await prisma.communityTemplate.upsert({
    where: { id: "seed-tpl-petit-pas" },
    create: {
      id: "seed-tpl-petit-pas",
      name: "Petit pas aidant",
      body: "{{marque}} : un petit pas compte. {{cta}}",
      kind: "both",
      themeId: themeBySlug["benefices-aidants"]?.id,
    },
    update: {
      body: "{{marque}} : un petit pas compte. {{cta}}",
    },
  });

  for (const ch of [
    {
      channel: "instagram" as const,
      label: "Proche+ Instagram",
      url: "https://instagram.com/procheplus",
    },
    {
      channel: "threads" as const,
      label: "Proche+ Threads",
      url: "https://threads.net/@procheplus",
    },
    {
      channel: "tiktok" as const,
      label: "Proche+ TikTok",
      url: "https://tiktok.com/@procheplus",
    },
    {
      channel: "facebook" as const,
      label: "Proche+ Facebook",
      url: "https://facebook.com/procheplus",
    },
  ]) {
    await prisma.communitySocialAccount.upsert({
      where: { channel_url: { channel: ch.channel, url: ch.url } },
      create: ch,
      update: { label: ch.label, active: true },
    });
  }

  await prisma.communityAppVersion.upsert({
    where: { id: "seed-app-version-preview" },
    create: {
      id: "seed-app-version-preview",
      label: "Preview démo seed",
      type: "vercel_preview",
      previewUrl: "https://procheplus-beta.vercel.app",
      notes: "Exemple isolé — ne pas brancher Neon prod patients",
    },
    update: {},
  });

  const classicExisting = await prisma.communityPublication.findFirst({
    where: { id: "seed-pub-classique" },
  });
  if (!classicExisting) {
    await prisma.communityPublication.create({
      data: {
        id: "seed-pub-classique",
        kind: "classique",
        status: "draft",
        title: "Un petit pas compte",
        body: "Pas besoin de tout faire d’un coup. On avance tranquillement, ensemble.",
        tagsJson: JSON.stringify(["#ProchePlus", "#Aidants", "#UnPetitPas"]),
        themeId: themeBySlug["benefices-aidants"]?.id,
        bearEnabled: true,
        poseKey: "encourage",
      },
    });
  }

  const videoExisting = await prisma.communityPublication.findFirst({
    where: { id: "seed-pub-video" },
  });
  if (!videoExisting) {
    await prisma.communityPublication.create({
      data: {
        id: "seed-pub-video",
        kind: "video",
        status: "draft",
        title: "Une idée pour la visite",
        body: "Une activité courte, à votre rythme — sans promesse clinique.",
        tagsJson: JSON.stringify(["#ModeVisite", "#TempsPartagé"]),
        themeId: themeBySlug["mode-visite"]?.id,
        bearEnabled: true,
        poseKey: "curiosite",
        remotionComposition: "ProchePlusShort",
      },
    });
  }

  await prisma.communityBlogArticle.upsert({
    where: { slug: "quest-ce-que-la-continuite-educative" },
    create: {
      format: "definition_glossaire",
      status: "publie",
      titleSeo: "Qu’est-ce que la continuité éducative ?",
      metaDescription:
        "Définition accessible de la continuité éducative pour les proches aidants — Proche+.",
      slug: "quest-ce-que-la-continuite-educative",
      tldr: "La continuité éducative, c’est garder un fil simple entre les moments d’accompagnement, sans remplacer l’avis médical.",
      authorName: "Équipe Proche+",
      authorExpertise: "Éditorial Proche+",
      publishedAt: new Date(),
      updatedContentAt: new Date(),
      sourcesJson: "[]",
      disclaimer: HEALTH_DISCLAIMER_BODY,
      bodyMarkdown:
        "La continuité éducative désigne le fait de relier des gestes, repères et activités simples d’une visite à l’autre.\n\nChez Proche+, cela passe par des outils pédagogiques partagés entre proches et professionnels — jamais un diagnostic ni une prescription.",
      themeId: themeBySlug["guides-education"]?.id,
      tagsJson: JSON.stringify(["#GuidePratique", "#ProchePlus"]),
    },
    update: { status: "publie" },
  });

  console.log("Community seed OK — thèmes, ours, médias, pubs démo, blog.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
