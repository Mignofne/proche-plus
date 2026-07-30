import type { AutonomyLevel } from "@prisma/client";

/** Mapping Patient.autonomyLevel ↔ code A–E (specs §10.3) */
export const AUTONOMY_ENUM_TO_CODE: Record<AutonomyLevel, string> = {
  autonome: "A",
  semi_autonome_faible: "B",
  semi_autonome_eleve: "C",
  dependant: "D",
  grabataire: "E",
};

export const AUTONOMY_CODE_TO_ENUM: Record<string, AutonomyLevel> = {
  A: "autonome",
  B: "semi_autonome_faible",
  C: "semi_autonome_eleve",
  D: "dependant",
  E: "grabataire",
};

export function parseJsonStringArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return value
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }
}

export function toJsonStringArray(items: string[]): string {
  return JSON.stringify(items.map((s) => s.trim()).filter(Boolean));
}
