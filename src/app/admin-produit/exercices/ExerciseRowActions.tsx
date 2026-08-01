"use client";

import Link from "next/link";
import { useTransition } from "react";
import {
  deleteExercise,
  validateExercise,
} from "../actions";

export function ExerciseRowActions({
  id,
  status,
}: {
  id: string;
  status: "brouillon" | "publie" | "archive";
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-2 flex flex-wrap gap-2 text-sm">
      <Link
        href={`/admin-produit/exercices/${id}`}
        className="rounded-lg border border-cream-dark px-3 py-1.5 font-medium text-teal hover:border-teal"
      >
        Lire / modifier
      </Link>
      {status === "brouillon" && (
        <button
          type="button"
          disabled={pending}
          className="rounded-lg bg-teal px-3 py-1.5 font-semibold text-white disabled:opacity-50"
          onClick={() =>
            startTransition(async () => {
              await validateExercise(id);
            })
          }
        >
          Valider
        </button>
      )}
      {status !== "archive" && (
        <button
          type="button"
          disabled={pending}
          className="rounded-lg border border-terracotta/40 px-3 py-1.5 font-medium text-terracotta disabled:opacity-50"
          onClick={() => {
            if (
              !confirm(
                "Archiver cet exercice ? Il ne sera plus proposé aux aidants."
              )
            ) {
              return;
            }
            startTransition(async () => {
              await deleteExercise(id);
            });
          }}
        >
          Supprimer
        </button>
      )}
    </div>
  );
}
