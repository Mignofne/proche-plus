"use client";

import { useEffect, useState } from "react";
import { Mascot } from "@/components/mascot/Mascot";
import { Card, SectionTitle } from "@/components/ui/Card";
import { AppHeader } from "@/components/layout/AppHeader";
import { AUTONOMY_LABELS } from "@/lib/constants";
import { getMicrocopy } from "@/lib/microcopy";

type VisitModeData = {
  caregiver: {
    patients: Array<{
      patient: {
        firstName: string;
        autonomyLevel: string;
        objectives: Array<{
          nextStep: string | null;
          instructions: string;
        }>;
      };
    }>;
  };
  transmissions: Array<{
    messages: Array<{ section: string; content: string }>;
  }>;
};

const VERBAL_GUIDANCE = [
  "Posez vos mains sur les accoudoirs.",
  "Poussez avec vos jambes.",
  "Attendez — prenez votre temps.",
  "Bien — vous pouvez continuer.",
];

export default function ModeVisitePage() {
  const [data, setData] = useState<VisitModeData | null>(null);

  useEffect(() => {
    fetch("/api/aidant")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const patient = data?.caregiver.patients[0]?.patient;
  const objective = patient?.objectives[0];
  const messages = data?.transmissions[0]?.messages ?? [];

  const aEssayer = messages.filter((m) => m.section === "a_essayer");
  const aEviter = messages.filter((m) => m.section === "a_eviter");

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-cream pb-8">
      <AppHeader title="Mode visite" backHref="/aidant" />
      <main className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-3">
          <Mascot pose="patience" size="sm" />
          <p className="text-sm italic text-text-muted">
            {getMicrocopy("takeYourTime")}
          </p>
        </div>

        {patient && (
          <Card>
            <SectionTitle>Objectif du jour</SectionTitle>
            <p className="mt-2">
              {objective?.nextStep ?? "Participer à la réadaptation"}
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Niveau : {AUTONOMY_LABELS[patient.autonomyLevel]}
            </p>
          </Card>
        )}

        <Card>
          <SectionTitle>Ce que je peux faire</SectionTitle>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {(aEssayer.length > 0
              ? aEssayer.map((m) => m.content)
              : [objective?.instructions ?? "Encourager et guider verbalement"]
            ).map((text, i) => (
              <li key={i}>{text}</li>
            ))}
          </ul>
        </Card>

        <Card className="border-terracotta/30">
          <SectionTitle>Ce que je ne dois pas faire</SectionTitle>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {(aEviter.length > 0
              ? aEviter.map((m) => m.content)
              : ["Réaliser un transfert sans supervision"]
            ).map((text, i) => (
              <li key={i}>{text}</li>
            ))}
          </ul>
        </Card>

        <Card>
          <SectionTitle>Guidance verbale</SectionTitle>
          <p className="mt-1 text-sm text-text-muted">
            Un seul verbe d&apos;action par phrase, dans l&apos;ordre du geste :
          </p>
          <ol className="mt-3 space-y-2">
            {VERBAL_GUIDANCE.map((phrase, i) => (
              <li
                key={i}
                className="rounded-xl bg-cream px-4 py-3 font-medium"
              >
                {i + 1}. {phrase}
              </li>
            ))}
          </ol>
          <p className="mt-4 rounded-xl bg-teal/10 p-3 text-sm font-medium text-teal-dark">
            {getMicrocopy("notDoingForThem")}
          </p>
        </Card>
      </main>
    </div>
  );
}
