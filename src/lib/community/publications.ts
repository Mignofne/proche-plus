import type {
  CommunityPublicationKind,
  CommunityPublicationStatus,
  CommunitySocialChannel,
} from "@prisma/client";

/** AD-5 — machine d’états Semi */
const TRANSITIONS: Record<
  CommunityPublicationStatus,
  CommunityPublicationStatus[]
> = {
  draft: ["scheduled", "cancelled"],
  scheduled: ["ready", "cancelled", "draft"],
  ready: ["published", "cancelled", "failed"],
  published: [],
  cancelled: ["draft"],
  failed: ["draft", "scheduled"],
};

export function canTransition(
  from: CommunityPublicationStatus,
  to: CommunityPublicationStatus
): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

/** FR5 — TikTok uniquement pour vidéo ; classique + carrousel = IG/Threads */
export function channelsAllowedForKind(
  kind: CommunityPublicationKind
): CommunitySocialChannel[] {
  if (kind === "classique" || kind === "carrousel") {
    return ["instagram", "threads"];
  }
  return ["instagram", "threads", "tiktok"];
}

export function assertChannelsForKind(
  kind: CommunityPublicationKind,
  channels: CommunitySocialChannel[]
): void {
  const allowed = channelsAllowedForKind(kind);
  for (const ch of channels) {
    if (!allowed.includes(ch)) {
      throw new Error(
        kind === "classique" || kind === "carrousel"
          ? "TikTok n’est pas disponible pour un post classique / carrousel — utilisez une publication vidéo."
          : `Canal non autorisé : ${ch}`
      );
    }
  }
}

/** CAP-11 gate avant ready/published */
export function assertRightsGate(params: {
  isTestimonial: boolean;
  isAttributable: boolean;
  hasAttestation: boolean;
}): void {
  if (
    params.isTestimonial &&
    params.isAttributable &&
    !params.hasAttestation
  ) {
    throw new Error(
      "Attestation droit à l’image / citation requise (CAP-11), ou anonymisez le témoignage."
    );
  }
}

export function applyTemplateVariables(
  body: string,
  vars: Record<string, string>
): string {
  return body.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => {
    return vars[key] ?? `{{${key}}}`;
  });
}
