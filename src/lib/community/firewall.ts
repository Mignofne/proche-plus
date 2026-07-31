/**
 * Pare-feu AD-2 : le domain Community ne doit pas importer le clinique.
 * Utilisé par le test Playwright unitaire.
 */
import fs from "node:fs";
import path from "node:path";

const COMMUNITY_LIB_DIR = path.join(
  process.cwd(),
  "src",
  "lib",
  "community"
);

/** Chemins / symboles cliniques interdits dans lib/community */
export const FORBIDDEN_IMPORT_PATTERNS = [
  /@\/lib\/services\/aidant/,
  /@\/lib\/services\/autonomy/,
  /@\/lib\/exercises/,
  /@\/lib\/patient-profiles/,
  /@\/lib\/autonomy-profiles/,
  /@\/lib\/consignes-bibliotheque/,
  /@\/app\/aidant/,
  /@\/app\/pro\b/,
  /from\s+["'][^"']*Patient/,
  /from\s+["'][^"']*Transmission/,
  /prisma\.patient/i,
  /prisma\.transmission/i,
  /prisma\.visit\b/i,
  /prisma\.establishment/i,
];

export function listCommunityLibFiles(dir = COMMUNITY_LIB_DIR): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listCommunityLibFiles(full));
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

export function findFirewallViolations(
  files: string[] = listCommunityLibFiles()
): { file: string; pattern: string }[] {
  const violations: { file: string; pattern: string }[] = [];
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    // Ne scanner que les lignes d'import / require (évite faux positifs dans commentaires)
    const importLines = content
      .split("\n")
      .filter((line) => /^\s*(import|export)\s/.test(line) || /require\s*\(/.test(line))
      .join("\n");
    for (const pattern of FORBIDDEN_IMPORT_PATTERNS) {
      if (pattern.test(importLines)) {
        violations.push({ file, pattern: String(pattern) });
      }
    }
  }
  return violations;
}
