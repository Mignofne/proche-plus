"use client";

import { createContext, useContext, type ReactNode } from "react";

type VisitSessionValue = {
  checkInId: string | null;
};

const VisitSessionContext = createContext<VisitSessionValue>({
  checkInId: null,
});

export function VisitSessionProvider({
  checkInId,
  children,
}: {
  checkInId: string | null;
  children: ReactNode;
}) {
  return (
    <VisitSessionContext.Provider value={{ checkInId }}>
      {children}
    </VisitSessionContext.Provider>
  );
}

export function useVisitSession() {
  return useContext(VisitSessionContext);
}
