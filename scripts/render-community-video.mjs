/**
 * Rendu Remotion hors route serverless courte (AD-7).
 *
 * Usage :
 *   npm run community:render-video
 *   npm run community:render-video -- --composition=ProchePlusShortFacebook
 *   npm run community:render-video -- --composition=ProchePlusStoryboard --props=./tmp/storyboard-props.json
 *   npm run community:render-video -- --composition=ProchePlusStoryboard --props=./tmp/props.json --slug=visite-gilet
 *
 * Différé CI/worker Vercel : brancher ce script sur un job dédié + upload Blob.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

function argValue(name) {
  const eq = args.find((a) => a.startsWith(`--${name}=`));
  if (eq) return eq.slice(name.length + 3);
  const idx = args.indexOf(`--${name}`);
  if (idx >= 0 && args[idx + 1] && !args[idx + 1].startsWith("--")) {
    return args[idx + 1];
  }
  return null;
}

const composition = argValue("composition") || "ProchePlusShort";
const propsPath = argValue("props");
const slug = argValue("slug");
const outOverride = argValue("out");

const outDir = path.join(process.cwd(), "tmp", "community-renders");
fs.mkdirSync(outDir, { recursive: true });

const stamp = slug
  ? `${slug.replace(/[^a-zA-Z0-9_-]+/g, "-")}-${Date.now()}`
  : `procheplus-short-${Date.now()}`;
const outFile = outOverride
  ? path.resolve(outOverride)
  : path.join(outDir, `${stamp}.mp4`);

fs.mkdirSync(path.dirname(outFile), { recursive: true });

const remotionArgs = [
  "npx remotion render src/remotion/index.ts",
  composition,
  `"${outFile}"`,
];

if (propsPath) {
  const resolved = path.resolve(propsPath);
  if (!fs.existsSync(resolved)) {
    console.error(`[community:render-video] Props introuvables : ${resolved}`);
    process.exit(1);
  }
  // Valider JSON tôt
  try {
    JSON.parse(fs.readFileSync(resolved, "utf8"));
  } catch (err) {
    console.error(`[community:render-video] Props JSON invalide : ${resolved}`);
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
  remotionArgs.push(`--props="${resolved}"`);
}

console.log(`[community:render-video] Composition ${composition}…`);
if (propsPath) console.log(`[community:render-video] Props ${path.resolve(propsPath)}`);
console.log(
  "Assurez-vous que `@remotion/cli` est installé et que Chrome headless est disponible."
);

try {
  execSync(remotionArgs.join(" "), { stdio: "inherit", shell: true });
  console.log(`[community:render-video] OK → ${outFile}`);
  console.log(
    "Ensuite : uploader vers Vercel Blob et renseigner CommunityPublication.videoBlobUrl si publication."
  );
} catch (err) {
  console.error(
    "[community:render-video] Échec local — preview Player reste disponible dans Community."
  );
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
}
