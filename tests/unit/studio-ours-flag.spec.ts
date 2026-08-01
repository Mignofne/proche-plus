import { test, expect } from "@playwright/test";
import { isStudioOursEnabled } from "../../src/lib/community/mascot-gen/studio-flag";

test.describe("Studio Ours — feature flag admin", () => {
  test("masqué par défaut sans clé OpenAI", () => {
    const prevFlag = process.env.MASCOT_GEN_STUDIO_ENABLED;
    const prevOpenAi = process.env.OPENAI_API_KEY;
    const prevMascot = process.env.MASCOT_GEN_OPENAI_API_KEY;
    delete process.env.MASCOT_GEN_STUDIO_ENABLED;
    delete process.env.OPENAI_API_KEY;
    delete process.env.MASCOT_GEN_OPENAI_API_KEY;
    try {
      expect(isStudioOursEnabled()).toBe(false);
    } finally {
      if (prevFlag === undefined) delete process.env.MASCOT_GEN_STUDIO_ENABLED;
      else process.env.MASCOT_GEN_STUDIO_ENABLED = prevFlag;
      if (prevOpenAi === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = prevOpenAi;
      if (prevMascot === undefined) delete process.env.MASCOT_GEN_OPENAI_API_KEY;
      else process.env.MASCOT_GEN_OPENAI_API_KEY = prevMascot;
    }
  });

  test("activé si OPENAI_API_KEY est définie", () => {
    const prevFlag = process.env.MASCOT_GEN_STUDIO_ENABLED;
    const prevOpenAi = process.env.OPENAI_API_KEY;
    delete process.env.MASCOT_GEN_STUDIO_ENABLED;
    process.env.OPENAI_API_KEY = "sk-test";
    try {
      expect(isStudioOursEnabled()).toBe(true);
    } finally {
      if (prevFlag === undefined) delete process.env.MASCOT_GEN_STUDIO_ENABLED;
      else process.env.MASCOT_GEN_STUDIO_ENABLED = prevFlag;
      if (prevOpenAi === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = prevOpenAi;
    }
  });

  test("override MASCOT_GEN_STUDIO_ENABLED=true sans clé", () => {
    const prevFlag = process.env.MASCOT_GEN_STUDIO_ENABLED;
    const prevOpenAi = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    process.env.MASCOT_GEN_STUDIO_ENABLED = "true";
    try {
      expect(isStudioOursEnabled()).toBe(true);
    } finally {
      if (prevFlag === undefined) delete process.env.MASCOT_GEN_STUDIO_ENABLED;
      else process.env.MASCOT_GEN_STUDIO_ENABLED = prevFlag;
      if (prevOpenAi === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = prevOpenAi;
    }
  });
});
