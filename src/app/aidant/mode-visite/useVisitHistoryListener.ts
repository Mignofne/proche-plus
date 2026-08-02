"use client";

import { useEffect, useRef } from "react";
import {
  isVisitHistoryState,
  type VisitHistoryState,
} from "./visitHistory";

/**
 * Écoute le bouton retour (popstate) et délègue à onBack.
 * Ignore les états hors Mode visite pour laisser la navigation Next.js se faire.
 */
export function useVisitHistoryListener(
  onBack: (state: VisitHistoryState) => void
) {
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  useEffect(() => {
    function handlePopState(event: PopStateEvent) {
      if (!isVisitHistoryState(event.state)) return;
      onBackRef.current(event.state);
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
}
