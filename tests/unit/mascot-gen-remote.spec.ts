import { test, expect } from "@playwright/test";
import {
  buildCompactScenePrompt,
  RemoteImageGenerationProvider,
} from "../../src/lib/community/mascot-gen/providers/remote";
import { resolveMascotGenProvider } from "../../src/lib/community/mascot-gen/providers";

test.describe("Studio Ours — provider remote", () => {
  test("défaut resolveMascotGenProvider = remote", () => {
    const prev = process.env.MASCOT_GEN_PROVIDER;
    delete process.env.MASCOT_GEN_PROVIDER;
    try {
      expect(resolveMascotGenProvider().id).toBe("remote");
      expect(resolveMascotGenProvider("mock").id).toBe("mock");
    } finally {
      if (prev === undefined) delete process.env.MASCOT_GEN_PROVIDER;
      else process.env.MASCOT_GEN_PROVIDER = prev;
    }
  });

  test("buildCompactScenePrompt extrait la SCENE et refuse le turnaround", () => {
    const compact = buildCompactScenePrompt({
      prompt: [
        "IDENTITY (LOCKED): adult plump brown bear",
        "",
        "SCENE: Situation: montre l’app. Emotion: Fier. Place: clinique.",
        "",
        "ART DIRECTION: warm cream",
      ].join("\n"),
      negativePrompt: "Lotso",
      width: 1024,
      height: 1024,
      identityVersion: "bear-stylized-sheet@c-v3",
      sceneId: "t1",
    });
    expect(compact).toMatch(/NOT a character turnaround/i);
    expect(compact).toMatch(/montre l’app/);
    expect(compact.length).toBeLessThan(2000);
  });

  test("persistGeneratedImage préfère fallbackPublicUrl hors Blob (pas /api tmp)", async () => {
    const prevBlob = process.env.BLOB_READ_WRITE_TOKEN;
    const prevVercel = process.env.VERCEL;
    delete process.env.BLOB_READ_WRITE_TOKEN;
    process.env.VERCEL = "1";
    try {
      const { persistGeneratedImage } = await import(
        "../../src/lib/community/mascot-gen/image-store"
      );
      const url = await persistGeneratedImage(
        Buffer.alloc(2048, 7),
        "image/png",
        "scene-x",
        { fallbackPublicUrl: "https://image.pollinations.ai/prompt/test?seed=1" }
      );
      expect(url).toBe("https://image.pollinations.ai/prompt/test?seed=1");
      expect(url.startsWith("/api/")).toBe(false);
    } finally {
      if (prevBlob === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
      else process.env.BLOB_READ_WRITE_TOKEN = prevBlob;
      if (prevVercel === undefined) delete process.env.VERCEL;
      else process.env.VERCEL = prevVercel;
    }
  });

  test("RemoteImageGenerationProvider génère via Pollinations (fetch mock)", async () => {
    const prevUrl = process.env.MASCOT_GEN_REMOTE_URL;
    const prevOpenAi = process.env.OPENAI_API_KEY;
    const prevMascotOpenAi = process.env.MASCOT_GEN_OPENAI_API_KEY;
    delete process.env.MASCOT_GEN_REMOTE_URL;
    delete process.env.OPENAI_API_KEY;
    delete process.env.MASCOT_GEN_OPENAI_API_KEY;

    const fakePng = Buffer.alloc(2048, 1);
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () =>
      new Response(fakePng, {
        status: 200,
        headers: { "content-type": "image/png" },
      })) as typeof fetch;

    try {
      const provider = new RemoteImageGenerationProvider();
      expect(await provider.isAvailable()).toBe(true);
      const result = await provider.generate({
        prompt: "SCENE: Situation: lit un livre. Emotion: Calme. Place: Salon.\n\nART DIRECTION: x",
        negativePrompt: "humans",
        width: 1024,
        height: 1024,
        identityVersion: "bear-stylized-sheet@c-v3",
        sceneId: `test-poll-${Date.now()}`,
      });
      expect(result.provider).toBe("remote");
      expect(result.meta.backend).toBe("pollinations");
      expect(result.imageUrl).toBeTruthy();
      expect(result.mimeType).toMatch(/image\//);
    } finally {
      globalThis.fetch = originalFetch;
      if (prevUrl === undefined) delete process.env.MASCOT_GEN_REMOTE_URL;
      else process.env.MASCOT_GEN_REMOTE_URL = prevUrl;
      if (prevOpenAi === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = prevOpenAi;
      if (prevMascotOpenAi === undefined) {
        delete process.env.MASCOT_GEN_OPENAI_API_KEY;
      } else {
        process.env.MASCOT_GEN_OPENAI_API_KEY = prevMascotOpenAi;
      }
    }
  });
});
