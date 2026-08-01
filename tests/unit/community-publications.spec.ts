import { test, expect } from "@playwright/test";
import {
  canTransition,
  channelsAllowedForKind,
  assertChannelsForKind,
  assertRightsGate,
  applyTemplateVariables,
} from "../../src/lib/community/publications";

test.describe("Community publications Semi", () => {
  test("transitions d’états AD-5", () => {
    expect(canTransition("draft", "scheduled")).toBe(true);
    expect(canTransition("scheduled", "ready")).toBe(true);
    expect(canTransition("ready", "published")).toBe(true);
    expect(canTransition("published", "draft")).toBe(false);
  });

  test("TikTok refusé pour classique et carrousel ; Facebook ok", () => {
    expect(channelsAllowedForKind("classique")).toEqual([
      "instagram",
      "threads",
      "facebook",
    ]);
    expect(channelsAllowedForKind("carrousel")).toEqual([
      "instagram",
      "threads",
      "facebook",
    ]);
    expect(channelsAllowedForKind("video")).toEqual([
      "instagram",
      "threads",
      "tiktok",
      "facebook",
    ]);
    expect(() =>
      assertChannelsForKind("classique", ["tiktok"])
    ).toThrow(/TikTok/);
    expect(() =>
      assertChannelsForKind("carrousel", ["tiktok"])
    ).toThrow(/TikTok/);
    expect(() =>
      assertChannelsForKind("classique", ["facebook"])
    ).not.toThrow();
  });

  test("CAP-11 bloque témoignage attribuable sans attestation", () => {
    expect(() =>
      assertRightsGate({
        isTestimonial: true,
        isAttributable: true,
        hasAttestation: false,
      })
    ).toThrow(/CAP-11/);
    expect(() =>
      assertRightsGate({
        isTestimonial: true,
        isAttributable: true,
        hasAttestation: true,
      })
    ).not.toThrow();
  });

  test("variables template", () => {
    expect(applyTemplateVariables("Bonjour {{marque}}", { marque: "Proche+" })).toBe(
      "Bonjour Proche+"
    );
  });
});
