/**
 * Historique navigateur pour le Mode visite (bouton retour Android / iOS).
 * Les écrans check-in → thèmes → exercice sont des états React sur la même URL :
 * sans pushState, le retour saute directement au choix du proche.
 */

export const VISIT_HISTORY_KEY = "__prochePlusModeVisite" as const;

export type VisitHistoryScreen =
  | "checkin"
  | "themes"
  | "exercise"
  | "done"
  | "ended"
  | "blocked";

export type VisitHistoryState = {
  [VISIT_HISTORY_KEY]: 1;
  screen: VisitHistoryScreen;
  themeId?: string | null;
  doneMessage?: string | null;
};

export function isVisitHistoryState(
  state: unknown
): state is VisitHistoryState {
  return (
    typeof state === "object" &&
    state !== null &&
    (state as VisitHistoryState)[VISIT_HISTORY_KEY] === 1 &&
    typeof (state as VisitHistoryState).screen === "string"
  );
}

function currentUrl(): string {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

export function replaceVisitHistory(step: Omit<VisitHistoryState, typeof VISIT_HISTORY_KEY>) {
  const next: VisitHistoryState = { [VISIT_HISTORY_KEY]: 1, ...step };
  window.history.replaceState(next, "", currentUrl());
}

export function pushVisitHistory(step: Omit<VisitHistoryState, typeof VISIT_HISTORY_KEY>) {
  const next: VisitHistoryState = { [VISIT_HISTORY_KEY]: 1, ...step };
  window.history.pushState(next, "", currentUrl());
}
