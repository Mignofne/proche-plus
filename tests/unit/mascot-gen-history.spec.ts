import { test, expect } from "@playwright/test";
import { mkdtemp, chmod, rm, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import {
  saveGeneration,
  listGenerations,
} from "../../src/lib/community/mascot-gen/history";

test.describe("Studio Ours — historique fichier", () => {
  test("saveGeneration ne throw pas si le dossier est en lecture seule", async () => {
    const root = await mkdtemp(join(tmpdir(), "mascot-gen-ro-"));
    await mkdir(join(root, "keep"), { recursive: true });
    await chmod(root, 0o555);
    const prev = process.env.MASCOT_GEN_DATA_DIR;
    process.env.MASCOT_GEN_DATA_DIR = join(root, "child", "mascot-gen");

    try {
      const record = await saveGeneration({
        provider: "mock",
        status: "succeeded",
        identityVersion: "bear-stylized-sheet@c-v3",
        brief: {
          situation: "exerce les freins",
          emotion: "rassurant",
          lieu: "salon",
        },
        promptPositive: "test",
        promptNegative: "neg",
        width: 1024,
        height: 1024,
      });

      expect(record.id).toBeTruthy();
      expect(record.brief.situation).toBe("exerce les freins");
      const list = await listGenerations(5);
      expect(Array.isArray(list)).toBe(true);
    } finally {
      if (prev === undefined) delete process.env.MASCOT_GEN_DATA_DIR;
      else process.env.MASCOT_GEN_DATA_DIR = prev;
      await chmod(root, 0o755);
      await rm(root, { recursive: true, force: true });
    }
  });

  test("listGenerations ignore les JSON corrompus / incomplets", async () => {
    const dataDir = await mkdtemp(join(tmpdir(), "mascot-gen-ok-"));
    const prev = process.env.MASCOT_GEN_DATA_DIR;
    process.env.MASCOT_GEN_DATA_DIR = dataDir;

    try {
      await writeFile(join(dataDir, "bad.json"), "{not-json", "utf8");
      await writeFile(
        join(dataDir, "incomplete.json"),
        JSON.stringify({ id: "x" }),
        "utf8"
      );
      await writeFile(
        join(dataDir, "good.json"),
        JSON.stringify({
          id: "good-1",
          createdAt: "2026-08-01T10:00:00.000Z",
          provider: "mock",
          status: "succeeded",
          identityVersion: "bear-stylized-sheet@c-v3",
          brief: { situation: "ok", emotion: "calme", lieu: "chambre" },
          promptPositive: "p",
          promptNegative: "n",
          width: 1024,
          height: 1024,
        }),
        "utf8"
      );

      const list = await listGenerations(10);
      expect(list).toHaveLength(1);
      expect(list[0].id).toBe("good-1");
      expect(list[0].brief.situation).toBe("ok");
    } finally {
      if (prev === undefined) delete process.env.MASCOT_GEN_DATA_DIR;
      else process.env.MASCOT_GEN_DATA_DIR = prev;
      await rm(dataDir, { recursive: true, force: true });
    }
  });

  test("saveGeneration persiste et listGenerations le retrouve", async () => {
    const dataDir = await mkdtemp(join(tmpdir(), "mascot-gen-rw-"));
    const prev = process.env.MASCOT_GEN_DATA_DIR;
    process.env.MASCOT_GEN_DATA_DIR = dataDir;

    try {
      const saved = await saveGeneration({
        provider: "mock",
        status: "succeeded",
        identityVersion: "bear-stylized-sheet@c-v3",
        brief: {
          situation: "aide au transfert",
          emotion: "encourage",
          lieu: "chambre",
        },
        promptPositive: "pos",
        promptNegative: "neg",
        width: 1024,
        height: 1024,
        imageUrl: "/community-assets/ours-canon/canon-c-v3.png",
      });

      const list = await listGenerations(5);
      expect(list.some((r) => r.id === saved.id)).toBe(true);
    } finally {
      if (prev === undefined) delete process.env.MASCOT_GEN_DATA_DIR;
      else process.env.MASCOT_GEN_DATA_DIR = prev;
      await rm(dataDir, { recursive: true, force: true });
    }
  });
});
