import { test, expect } from "@playwright/test";
import {
  DEFAULT_STORYBOARD_BEAT_FRAMES,
  REMOTION_STORYBOARD_ID,
  getStoryboardRenderInstructions,
  storyboardDurationInFrames,
} from "../../src/lib/community/video/remotion";

test.describe("Remotion storyboard helpers", () => {
  test("durée = somme des beats (défaut 60 fps-frames)", () => {
    expect(storyboardDurationInFrames([])).toBe(DEFAULT_STORYBOARD_BEAT_FRAMES);
    expect(
      storyboardDurationInFrames([
        { sceneSrc: "/a.png" },
        { sceneSrc: "/b.png", durationInFrames: 90 },
      ])
    ).toBe(DEFAULT_STORYBOARD_BEAT_FRAMES + 90);
  });

  test("instructions CLI pointent la composition storyboard", () => {
    const cmd = getStoryboardRenderInstructions("tmp/demo-props.json");
    expect(cmd).toContain(REMOTION_STORYBOARD_ID);
    expect(cmd).toContain("--props=tmp/demo-props.json");
  });
});
