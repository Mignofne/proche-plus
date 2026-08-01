"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireFondateur } from "@/lib/community/auth-gate";
import { createAppVersionSchema } from "@/lib/community/app-versions";
import { mediaAssetSchema } from "@/lib/community/media";
import {
  assertChannelsForKind,
  assertRightsGate,
  applyTemplateVariables,
  canTransition,
} from "@/lib/community/publications";
import { validateEditableTags } from "@/lib/community/themes";
import { blogArticleSchema } from "@/lib/community/blog";
import { HEALTH_DISCLAIMER_BODY } from "@/lib/community/health-disclaimer";
import {
  isSceneKey,
  normalizeHexColor,
  DEFAULT_TITLE_COLOR,
  DEFAULT_SUBTITLE_COLOR,
} from "@/lib/community/scenes";
import type {
  CommunityPublicationKind,
  CommunitySocialChannel,
} from "@prisma/client";

function revalidateCommunity() {
  revalidatePath("/admin-produit/community");
  revalidatePath("/admin-produit/community/beta");
  revalidatePath("/admin-produit/community/contenus");
  revalidatePath("/admin-produit/community/publications");
  revalidatePath("/admin-produit/community/blog");
  revalidatePath("/admin-produit/community/comptes");
}

export async function createAppVersionAction(formData: FormData): Promise<void> {
  await requireFondateur();
  const parsed = createAppVersionSchema.safeParse({
    label: formData.get("label"),
    previewUrl: formData.get("previewUrl"),
    notes: formData.get("notes") || null,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Donnees invalides");
  }
  await prisma.communityAppVersion.create({ data: parsed.data });
  revalidateCommunity();
}

export async function inviteBetaTesterAction(formData: FormData): Promise<void> {
  await requireFondateur();
  const leadId = String(formData.get("leadId") || "");
  const appVersionId = String(formData.get("appVersionId") || "");
  if (!leadId || !appVersionId) throw new Error("Lead et version requis");

  const lead = await prisma.communityBetaLead.findUnique({ where: { id: leadId } });
  if (!lead) throw new Error("Lead introuvable");

  await prisma.communityBetaTester.create({
    data: {
      leadId,
      appVersionId,
      status: "invite",
      inviteNote: String(formData.get("inviteNote") || "") || null,
    },
  });
  await prisma.communityBetaLead.update({
    where: { id: leadId },
    data: { status: "invite" },
  });
  revalidateCommunity();
}

export async function updateBetaTesterStatusAction(
  formData: FormData
): Promise<void> {
  await requireFondateur();
  const id = String(formData.get("testerId") || "");
  const status = String(formData.get("status") || "") as
    | "actif"
    | "revoque"
    | "invite";
  if (!id || !["actif", "revoque", "invite"].includes(status)) {
    throw new Error("Statut invalide");
  }
  await prisma.communityBetaTester.update({ where: { id }, data: { status } });
  revalidateCommunity();
}

export async function createMediaAssetAction(formData: FormData): Promise<void> {
  await requireFondateur();
  const parsed = mediaAssetSchema.safeParse({
    label: formData.get("label"),
    url: formData.get("url"),
    mimeType: formData.get("mimeType") || null,
    license: formData.get("license"),
    source: formData.get("source"),
    provenance: formData.get("provenance") || null,
    isPosePack: formData.get("isPosePack") === "on",
    poseKey: formData.get("poseKey") || null,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Donnees invalides");
  }
  await prisma.communityMediaAsset.create({ data: parsed.data });
  revalidateCommunity();
}

export async function createTemplateAction(formData: FormData): Promise<void> {
  await requireFondateur();
  const name = String(formData.get("name") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const kind = String(formData.get("kind") || "both") as
    | "classique"
    | "video"
    | "both";
  if (!name || !body) throw new Error("Nom et corps requis");
  await prisma.communityTemplate.create({
    data: {
      name,
      body,
      kind,
      themeId: String(formData.get("themeId") || "") || null,
    },
  });
  revalidateCommunity();
}

export async function createSocialAccountAction(
  formData: FormData
): Promise<void> {
  await requireFondateur();
  const channel = String(formData.get("channel") || "") as CommunitySocialChannel;
  const label = String(formData.get("label") || "").trim();
  const url = String(formData.get("url") || "").trim();
  if (!["instagram", "threads", "tiktok", "facebook"].includes(channel)) {
    throw new Error("Canal invalide");
  }
  if (!label || !url) throw new Error("Libelle et URL requis");
  await prisma.communitySocialAccount.create({
    data: { channel, label, url },
  });
  revalidateCommunity();
}

export async function createPublicationAction(
  formData: FormData
): Promise<void> {
  await requireFondateur();
  const kind = String(formData.get("kind") || "classique") as CommunityPublicationKind;
  const body = String(formData.get("body") || "").trim();
  const title = String(formData.get("title") || "").trim() || null;
  if (!body) throw new Error("Texte requis");

  const channels = formData
    .getAll("channels")
    .map(String) as CommunitySocialChannel[];
  assertChannelsForKind(kind, channels);

  const tagsRaw = String(formData.get("tags") || "")
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter(Boolean);
  const tagCheck = validateEditableTags(tagsRaw);
  if (!tagCheck.ok) {
    throw new Error(
      `Tags refuses (medical / PHI / etablissement) : ${tagCheck.rejected.join(", ")}`
    );
  }

  const accountIds = formData.getAll("accountIds").map(String).filter(Boolean);
  const mediaIds = formData.getAll("mediaIds").map(String).filter(Boolean);

  const slidesRaw = String(formData.get("slidesJson") || "").trim();
  let slidesJson: string | null = null;
  if (slidesRaw) {
    try {
      const parsed = JSON.parse(slidesRaw);
      if (!Array.isArray(parsed)) throw new Error("slides must be array");
      slidesJson = JSON.stringify(parsed);
    } catch {
      throw new Error("slidesJson invalide — attendu un tableau JSON de slides");
    }
  } else if (kind === "carrousel") {
    throw new Error("Carrousel : renseignez slidesJson (overlayText par slide)");
  }

  const titleColorRaw = String(formData.get("titleColor") || "").trim();
  const subtitleColorRaw = String(formData.get("subtitleColor") || "").trim();
  const titleColor = titleColorRaw
    ? normalizeHexColor(titleColorRaw, DEFAULT_TITLE_COLOR)
    : null;
  const subtitleColor = subtitleColorRaw
    ? normalizeHexColor(subtitleColorRaw, DEFAULT_SUBTITLE_COLOR)
    : null;
  const sceneKeyRaw = String(formData.get("sceneKey") || "").trim();
  const sceneKey = isSceneKey(sceneKeyRaw) ? sceneKeyRaw : null;

  const accounts =
    accountIds.length > 0
      ? await prisma.communitySocialAccount.findMany({
          where: { id: { in: accountIds } },
        })
      : [];
  const accountById = Object.fromEntries(accounts.map((a) => [a.id, a]));

  const pub = await prisma.communityPublication.create({
    data: {
      kind,
      status: "draft",
      title,
      body,
      tagsJson: JSON.stringify(tagsRaw),
      themeId: String(formData.get("themeId") || "") || null,
      bearScenarioId: String(formData.get("bearScenarioId") || "") || null,
      bearEnabled: formData.get("bearEnabled") === "on",
      poseKey: String(formData.get("poseKey") || "") || null,
      titleColor,
      subtitleColor,
      sceneKey,
      channelsJson: JSON.stringify(channels),
      slidesJson,
      isTestimonial: formData.get("isTestimonial") === "on",
      isAttributable: formData.get("isAttributable") === "on",
      remotionComposition:
        kind === "video"
          ? channels[0] === "facebook"
            ? "ProchePlusShortFacebook"
            : "ProchePlusShort"
          : null,
      targets: {
        create: accountIds.map((accountId, i) => ({
          accountId,
          channel:
            accountById[accountId]?.channel ||
            channels[i] ||
            channels[0] ||
            "instagram",
        })),
      },
      assets: {
        create: mediaIds.map((mediaId, i) => ({ mediaId, sortOrder: i })),
      },
    },
  });

  revalidateCommunity();
  redirect(`/admin-produit/community/publications/preview/${pub.id}`);
}

export async function applyTemplateToDraftAction(
  formData: FormData
): Promise<void> {
  await requireFondateur();
  const templateId = String(formData.get("templateId") || "");
  const kind = String(formData.get("kind") || "classique") as CommunityPublicationKind;
  const tpl = await prisma.communityTemplate.findUnique({
    where: { id: templateId },
  });
  if (!tpl) throw new Error("Template introuvable");
  const body = applyTemplateVariables(tpl.body, {
    marque: "Proche+",
    cta: "En savoir plus",
  });
  const pub = await prisma.communityPublication.create({
    data: {
      kind,
      status: "draft",
      title: tpl.name,
      body,
      themeId: tpl.themeId,
    },
  });
  revalidateCommunity();
  redirect(`/admin-produit/community/publications/preview/${pub.id}`);
}

export async function schedulePublicationAction(
  formData: FormData
): Promise<void> {
  await requireFondateur();
  const id = String(formData.get("publicationId") || "");
  const when = String(formData.get("scheduledAt") || "");
  const pub = await prisma.communityPublication.findUnique({ where: { id } });
  if (!pub) throw new Error("Post introuvable");
  if (!canTransition(pub.status, "scheduled")) {
    throw new Error(`Transition ${pub.status} -> scheduled impossible`);
  }
  const scheduledAt = new Date(when);
  if (Number.isNaN(scheduledAt.getTime())) throw new Error("Date invalide");

  assertRightsGate({
    isTestimonial: pub.isTestimonial,
    isAttributable: pub.isAttributable,
    hasAttestation: Boolean(pub.rightsAttestationId),
  });

  await prisma.communityPublication.update({
    where: { id },
    data: { status: "scheduled", scheduledAt },
  });
  revalidateCommunity();
}

export async function cancelPublicationAction(
  formData: FormData
): Promise<void> {
  await requireFondateur();
  const id = String(formData.get("publicationId") || "");
  const pub = await prisma.communityPublication.findUnique({ where: { id } });
  if (!pub) throw new Error("Post introuvable");
  if (!canTransition(pub.status, "cancelled")) {
    throw new Error("Annulation impossible");
  }
  await prisma.communityPublication.update({
    where: { id },
    data: { status: "cancelled" },
  });
  revalidateCommunity();
}

export async function publishManuallyAction(formData: FormData): Promise<void> {
  await requireFondateur();
  const id = String(formData.get("publicationId") || "");
  const pub = await prisma.communityPublication.findUnique({ where: { id } });
  if (!pub) throw new Error("Post introuvable");
  if (pub.status !== "ready") {
    throw new Error("Mise en ligne manuelle uniquement depuis le statut prêt (ready)");
  }
  assertRightsGate({
    isTestimonial: pub.isTestimonial,
    isAttributable: pub.isAttributable,
    hasAttestation: Boolean(pub.rightsAttestationId),
  });
  await prisma.communityPublication.update({
    where: { id },
    data: { status: "published", publishedAt: new Date() },
  });
  revalidateCommunity();
}

export async function anonymizeTestimonialAction(
  formData: FormData
): Promise<void> {
  await requireFondateur();
  const id = String(formData.get("publicationId") || "");
  await prisma.communityPublication.update({
    where: { id },
    data: { isAttributable: false },
  });
  revalidateCommunity();
}

export async function attachRightsAttestationAction(
  formData: FormData
): Promise<void> {
  await requireFondateur();
  const publicationId = String(formData.get("publicationId") || "");
  const label = String(formData.get("label") || "").trim();
  const fileUrl = String(formData.get("fileUrl") || "").trim() || null;
  const notes = String(formData.get("notes") || "").trim() || null;
  if (!publicationId || !label) {
    throw new Error("Post et libellé requis");
  }
  const att = await prisma.communityRightsAttestation.create({
    data: { label, fileUrl, notes },
  });
  await prisma.communityPublication.update({
    where: { id: publicationId },
    data: {
      rightsAttestationId: att.id,
      isTestimonial: true,
      isAttributable: true,
    },
  });
  revalidateCommunity();
}

export async function createBlogArticleAction(
  formData: FormData
): Promise<void> {
  await requireFondateur();
  const parsed = blogArticleSchema.safeParse({
    format: formData.get("format"),
    titleSeo: formData.get("titleSeo"),
    metaDescription: formData.get("metaDescription"),
    slug: formData.get("slug"),
    tldr: formData.get("tldr") || null,
    authorName: formData.get("authorName"),
    authorExpertise: formData.get("authorExpertise"),
    sourcesJson: formData.get("sourcesJson") || "[]",
    disclaimer: formData.get("disclaimer") || HEALTH_DISCLAIMER_BODY,
    bodyMarkdown: formData.get("bodyMarkdown"),
    planJson: formData.get("planJson") || null,
    faqJson: formData.get("faqJson") || null,
    howtoJson: formData.get("howtoJson") || null,
    themeId: formData.get("themeId") || null,
    tagsJson: formData.get("tagsJson") || "[]",
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Article invalide");
  }
  const tags = JSON.parse(parsed.data.tagsJson || "[]") as string[];
  const tagCheck = validateEditableTags(tags);
  if (!tagCheck.ok) {
    throw new Error(`Tags refuses : ${tagCheck.rejected.join(", ")}`);
  }
  const article = await prisma.communityBlogArticle.create({
    data: { ...parsed.data, status: "brouillon" },
  });
  revalidateCommunity();
  redirect(`/admin-produit/community/blog/${article.id}`);
}

export async function publishBlogArticleAction(
  formData: FormData
): Promise<void> {
  await requireFondateur();
  const id = String(formData.get("articleId") || "");
  const article = await prisma.communityBlogArticle.findUnique({
    where: { id },
  });
  if (!article) throw new Error("Article introuvable");
  const now = new Date();
  await prisma.communityBlogArticle.update({
    where: { id },
    data: {
      status: "publie",
      publishedAt: article.publishedAt || now,
      updatedContentAt: now,
    },
  });
  revalidatePath(`/blog/${article.slug}`);
  revalidateCommunity();
}

export async function exportBlogArticleAction(
  formData: FormData
): Promise<void> {
  await requireFondateur();
  const id = String(formData.get("articleId") || "");
  const article = await prisma.communityBlogArticle.findUnique({
    where: { id },
  });
  if (!article) throw new Error("Article introuvable");
  await prisma.communityBlogArticle.update({
    where: { id },
    data: { status: "exporte" },
  });
  revalidateCommunity();
}

export async function generateSocialTeasersAction(
  formData: FormData
): Promise<void> {
  await requireFondateur();
  const articleId = String(formData.get("articleId") || "");
  const article = await prisma.communityBlogArticle.findUnique({
    where: { id: articleId },
  });
  if (!article) throw new Error("Article introuvable");
  const teaserBody =
    article.tldr ||
    article.metaDescription ||
    article.bodyMarkdown.slice(0, 220);
  const pub = await prisma.communityPublication.create({
    data: {
      kind: "classique",
      status: "draft",
      title: `Teaser — ${article.titleSeo}`,
      body: teaserBody,
      themeId: article.themeId,
      articleId: article.id,
      tagsJson: article.tagsJson,
      bearEnabled: true,
      poseKey: "encourage",
    },
  });
  revalidateCommunity();
  redirect(`/admin-produit/community/publications/preview/${pub.id}`);
}

export async function markNotificationReadAction(
  formData: FormData
): Promise<void> {
  await requireFondateur();
  const id = String(formData.get("notificationId") || "");
  await prisma.communityFounderNotification.update({
    where: { id },
    data: { readAt: new Date() },
  });
  revalidateCommunity();
}
