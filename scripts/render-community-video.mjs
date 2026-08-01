/**
 * Rendu Remotion hors route serverless courte (AD-7).
 * Usage local :
 *   npm run community:render-video
 *   npm run community:render-video -- --composition=ProchePlusShortFacebook
 *
 * Différé CI/worker Vercel : brancher ce script sur un job dédié + upload Blob.
 * Le Player admin et les compositions in-repo restent la voie preview MVP.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const compositionArg = args.find((a) => a.startsWith("--composition="));
const composition = compositionArg
  ? compositionArg.split("=")[1]
  : "ProchePlusShort";

const outDir = path.join(process.cwd(), "tmp", "community-renders");
fs.mkdirSync(outDir, { recursive: true });

const outFile = path.join(outDir, `procheplus-short-${Date.now()}.mp4`);

console.log(`[community:render-video] Composition ${composition}…`);
console.log(
  "Assurez-vous que `@remotion/cli` est installé et que Chrome headless est disponible."
);

try {
  execSync(
    `npx remotion render src/remotion/index.ts ${composition} "${outFile}"`,
    { stdio: "inherit", shell: true }
  );
  console.log(`[community:render-video] OK → ${outFile}`);
  console.log(
    "Ensuite : uploader vers Vercel Blob et renseigner CommunityPublication.videoBlobUrl."
  );
} catch (err) {
  console.error(
    "[community:render-video] Échec local — preview Player reste disponible dans Community."
  );
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
}
