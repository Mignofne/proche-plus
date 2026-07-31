"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Mascot } from "@/components/mascot/Mascot";
import { dismissCaregiverAutonomyAlert } from "@/app/aidant/actions";
import { AUTONOMY_LABELS } from "@/lib/constants";

type AlertItem = {
  id: string;
  type: string;
  message: string;
  proposedLevel: string | null;
};

export function CaregiverAutonomyAlerts({ alerts }: { alerts: AlertItem[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (!alerts.length) return null;

  return (
    <div className="flex flex-col gap-3">
      {alerts.map((alert) => (
        <Card key={alert.id} className="border-teal/30 bg-teal/5">
          <div className="flex items-start gap-3">
            <Mascot
              pose={
                alert.type === "proposition_upgrade" ? "celebrate" : "vigilance"
              }
              size="sm"
            />
            <div className="flex-1">
              <SectionTitle>
                {alert.type === "proposition_upgrade"
                  ? "Niveau peut-être trop bas ?"
                  : "Niveau à revoir ?"}
              </SectionTitle>
              <p className="mt-2 text-sm">{alert.message}</p>
              {alert.proposedLevel && (
                <p className="mt-1 text-sm text-text-muted">
                  Proposition : {AUTONOMY_LABELS[alert.proposedLevel]}
                </p>
              )}
              <p className="mt-2 text-xs text-text-muted">
                L&apos;équipe en est informée. Vous pouvez continuer à utiliser
                l&apos;app.
              </p>
              <Button
                className="mt-3"
                variant="ghost"
                size="sm"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await dismissCaregiverAutonomyAlert(alert.id);
                    router.refresh();
                  })
                }
              >
                J&apos;ai compris
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
