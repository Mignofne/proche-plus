import { test, expect } from "@playwright/test";
import {
  formatForChannelKind,
  channelLabels,
  resolvePrimaryChannel,
} from "../../src/lib/community/formats";
import {
  normalizeHexColor,
  resolveSceneKey,
  resolveSceneSrc,
  DEFAULT_TITLE_COLOR,
} from "../../src/lib/community/scenes";
import { channelsAllowedForKind } from "../../src/lib/community/publications";

test.describe("Community formats & scènes", () => {
  test("Facebook classique → fil 1.91:1", () => {
    const fmt = formatForChannelKind("facebook", "classique");
    expect(fmt.key).toBe("fb-landscape");
    expect(fmt.width).toBe(1200);
    expect(fmt.height).toBe(630);
  });

  test("Instagram / Threads classique → carré", () => {
    expect(formatForChannelKind("instagram", "classique").key).toBe("ig-square");
    expect(formatForChannelKind("threads", "carrousel").key).toBe("ig-square");
    expect(formatForChannelKind("facebook", "carrousel").key).toBe("ig-square");
  });

  test("Vidéo Facebook → 16:9 ; autres → 9:16", () => {
    expect(formatForChannelKind("facebook", "video").key).toBe("video-16-9");
    expect(formatForChannelKind("tiktok", "video").key).toBe("video-9-16");
    expect(formatForChannelKind("instagram", "video").key).toBe("video-9-16");
  });

  test("Facebook autorisé classique + vidéo", () => {
    expect(channelsAllowedForKind("classique")).toContain("facebook");
    expect(channelsAllowedForKind("carrousel")).toContain("facebook");
    expect(channelsAllowedForKind("video")).toContain("facebook");
    expect(channelsAllowedForKind("classique")).not.toContain("tiktok");
  });

  test("canal principal + labels", () => {
    expect(resolvePrimaryChannel(["facebook", "instagram"])).toBe("facebook");
    expect(channelLabels(["facebook", "instagram"])).toBe(
      "Facebook / Instagram"
    );
  });

  test("couleurs hex + fallback", () => {
    expect(normalizeHexColor("#5b6bc0", DEFAULT_TITLE_COLOR)).toBe("#5B6BC0");
    expect(normalizeHexColor("#abc", DEFAULT_TITLE_COLOR)).toBe("#AABBCC");
    expect(normalizeHexColor("nope", DEFAULT_TITLE_COLOR)).toBe(
      DEFAULT_TITLE_COLOR
    );
  });

  test("résolution scène en situation (kit ours-canon)", () => {
    expect(resolveSceneKey({ sceneKey: "scene-repas" })).toBe("scene-repas");
    expect(resolveSceneKey({ poseKey: "encourage" })).toBe("scene-cognitif");
    expect(resolveSceneKey({ themeSlug: "fauteuil" })).toBe(
      "scene-fauteuil-freins"
    );
    expect(resolveSceneSrc({ sceneKey: "scene-habillage" })).toContain(
      "scenes-referentiel/scene-habillage.png"
    );
    expect(resolveSceneSrc({ sceneKey: "declinaison-fauteuil" })).toContain(
      "declinaison-fauteuil.png"
    );
  });
});
