/**
 * Pure resolver for mode-visite patient selection.
 * - 0 proches → empty
 * - 1 proche → auto (foreign patientId → unauthorized)
 * - N>1 without patientId → pick
 * - N>1 with owned patientId → selected
 * - N>1 with foreign patientId → unauthorized
 */
export function resolveVisitPatientSelection(input: {
  ownedPatientIds: string[];
  requestedPatientId?: string | null;
}):
  | { status: "empty" }
  | { status: "auto"; patientId: string }
  | { status: "pick" }
  | { status: "selected"; patientId: string }
  | { status: "unauthorized" } {
  const owned = input.ownedPatientIds;
  const requested = input.requestedPatientId?.trim() || null;

  if (owned.length === 0) return { status: "empty" };

  if (owned.length === 1) {
    const only = owned[0]!;
    if (requested && requested !== only) {
      return { status: "unauthorized" };
    }
    return { status: "auto", patientId: only };
  }

  if (!requested) return { status: "pick" };
  if (!owned.includes(requested)) return { status: "unauthorized" };
  return { status: "selected", patientId: requested };
}
