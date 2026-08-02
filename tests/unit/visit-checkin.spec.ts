import { test, expect } from "@playwright/test";
import {
  shouldBlockVisit,
  labelForCheckInScore,
  VISIT_CHECKIN_BLOCK_THRESHOLD,
} from "../../src/lib/visit-checkin";

test.describe("visit check-in threshold", () => {
  test("ne bloque pas si fatigue et douleur ≤ 5", () => {
    expect(shouldBlockVisit(0, 0)).toBe(false);
    expect(shouldBlockVisit(4, 4)).toBe(false);
    expect(shouldBlockVisit(4, 2)).toBe(false);
  });

  test("bloque si fatigue OU douleur ≥ 6", () => {
    expect(VISIT_CHECKIN_BLOCK_THRESHOLD).toBe(6);
    expect(shouldBlockVisit(6, 0)).toBe(true);
    expect(shouldBlockVisit(0, 6)).toBe(true);
    expect(shouldBlockVisit(8, 10)).toBe(true);
  });

  test("libellés paliers", () => {
    expect(labelForCheckInScore(0)).toBe("Aucune");
    expect(labelForCheckInScore(6)).toBe("Importante");
    expect(labelForCheckInScore(10)).toBe("Maximale");
  });
});
