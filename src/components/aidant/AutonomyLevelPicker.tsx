"use client";

import { CAREGIVER_AUTONOMY_OPTIONS } from "@/lib/autonomy-profiles";
import type { AutonomyLevel } from "@prisma/client";

type AutonomyLevelPickerProps = {
  value: AutonomyLevel | null;
  onChange: (level: AutonomyLevel) => void;
  patientFirstName?: string;
};

export function AutonomyLevelPicker({
  value,
  onChange,
  patientFirstName,
}: AutonomyLevelPickerProps) {
  const name = patientFirstName ?? "votre proche";

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-teal-dark">
          Quelle situation décrit le mieux {name} aujourd&apos;hui&nbsp;?
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Une seule réponse — ce n&apos;est pas un diagnostic, l&apos;équipe
          confirmera ensuite.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {CAREGIVER_AUTONOMY_OPTIONS.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`flex min-h-[8rem] flex-col gap-2 rounded-2xl border p-4 text-left transition-colors touch-target ${
                selected
                  ? "border-teal bg-teal/10 shadow-sm ring-2 ring-teal/40"
                  : "border-cream-dark bg-white hover:border-teal/40"
              }`}
              aria-pressed={selected}
            >
              <span className="text-sm font-bold text-teal-dark">
                {opt.shortLabel}
              </span>
              <span className="text-sm leading-snug">{opt.sentence}</span>
              <span className="mt-auto text-xs leading-snug text-text-muted">
                {opt.example}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
