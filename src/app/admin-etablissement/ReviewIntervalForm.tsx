"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { updateEstablishmentReviewInterval } from "@/app/pro/actions";

export function ReviewIntervalForm({ currentDays }: { currentDays: number }) {
  const router = useRouter();
  const [days, setDays] = useState(currentDays);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <Card className="mt-3">
      <SectionTitle>Revue périodique du profil d&apos;autonomie</SectionTitle>
      <p className="mt-2 text-sm text-text-muted">
        Intervalle entre deux questions à l&apos;aidant (« Est-ce que la situation
        de votre proche a changé ? »). Les signaux exercice restent immédiats.
      </p>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Jours</span>
          <input
            type="number"
            min={7}
            max={90}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-28 rounded-xl border border-cream-dark bg-white px-4 py-3"
          />
        </label>
        <Button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await updateEstablishmentReviewInterval(days);
              setSaved(true);
              router.refresh();
            })
          }
        >
          {pending ? "Enregistrement…" : "Enregistrer"}
        </Button>
        {saved && (
          <span className="text-sm text-teal-dark">Intervalle mis à jour</span>
        )}
      </div>
    </Card>
  );
}
