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
export {
  formatForChannelKind,
  channelLabel,
  channelLabels,
  resolvePrimaryChannel,
} from "./formats";
export {
  resolveSceneKey,
  resolveSceneSrc,
  sceneImagePath,
  SCENE_OPTIONS,
  SCENE_KEYS,
  CANON_IMAGE_PATH,
  DEFAULT_TITLE_COLOR,
  DEFAULT_SUBTITLE_COLOR,
  TEXT_COLOR_PRESETS,
  normalizeHexColor,
} from "./scenes";
