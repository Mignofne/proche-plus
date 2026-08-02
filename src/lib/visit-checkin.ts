/** Paliers discrets fatigue / douleur (échelle 0–10). */
export const VISIT_CHECKIN_LEVELS = [
  { value: 0, label: "Aucune" },
  { value: 2, label: "Légère" },
  { value: 4, label: "Modérée" },
  { value: 6, label: "Importante" },
  { value: 8, label: "Très importante" },
  { value: 10, label: "Maximale" },
] as const;

export type VisitCheckInScore = (typeof VISIT_CHECKIN_LEVELS)[number]["value"];

/** Seuil « > 5 » : déclenchement dès 6. */
export const VISIT_CHECKIN_BLOCK_THRESHOLD = 6;

export function shouldBlockVisit(
  fatigueScore: number,
  painScore: number
): boolean {
  return (
    fatigueScore >= VISIT_CHECKIN_BLOCK_THRESHOLD ||
    painScore >= VISIT_CHECKIN_BLOCK_THRESHOLD
  );
}

export function labelForCheckInScore(score: number): string {
  return (
    VISIT_CHECKIN_LEVELS.find((l) => l.value === score)?.label ?? String(score)
  );
}
