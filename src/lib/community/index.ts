/**
 * Domaine Community — module cloisonné (AD-1, AD-2).
 *
 * INTERDIT : importer modules/données cliniques
 * (Patient, Transmission, Visit, services aidant, parcours aidant/pro).
 * INTERDIT : barrel qui réexporte le clinique.
 * firewall.ts : Node-only (fs) — ne pas réexporter ici.
 */

export {
  assertFondateurSession,
  requireFondateur,
} from "./auth-gate";
export {
  COMMUNITY_BRAND,
  COMMUNITY_UI,
  COMMUNITY_COPY_TONE,
} from "./ui-tokens";
export {
  HEALTH_DISCLAIMER_BODY,
  HEALTH_DISCLAIMER_TITLE,
} from "./health-disclaimer";
export {
  canTransition,
  channelsAllowedForKind,
  assertChannelsForKind,
  assertRightsGate,
  applyTemplateVariables,
} from "./publications";
