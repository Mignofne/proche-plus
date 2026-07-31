import { test, expect } from "@playwright/test";
import {
  findFirewallViolations,
  listCommunityLibFiles,
} from "../../src/lib/community/firewall";
import { COMMUNITY_BRAND, COMMUNITY_UI } from "../../src/lib/community/ui-tokens";

test.describe("Community firewall AD-2", () => {
  test("lib/community n’importe pas le domaine clinique", () => {
    const files = listCommunityLibFiles();
    expect(files.length).toBeGreaterThan(0);
    const violations = findFirewallViolations(files);
    expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
  });
});

test.describe("Community UI tokens", () => {
  test("expose la palette Proche+", () => {
    expect(COMMUNITY_BRAND.teal.toLowerCase()).toBe("#2a9d8f");
    expect(COMMUNITY_BRAND.cream.toLowerCase()).toBe("#faf7f2");
    expect(COMMUNITY_UI.surfaceRaised).toContain("surface-raised");
    expect(COMMUNITY_UI.touchTarget).toBe("touch-target");
  });
});
