"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { deleteTheme, saveTheme } from "../actions";

type ThemeRow = {
  id: string;
  label: string;
  slug: string;
  icon: string | null;
  displayOrder: number;
  active: boolean;
};

export function ThemeManager({ themes }: { themes: ThemeRow[] }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<ThemeRow | "new" | null>(null);

  function submit(formData: FormData) {
    setError("");
    startTransition(async () => {
      try {
        await saveTheme({
          id: editing && editing !== "new" ? editing.id : undefined,
          label: String(formData.get("label") || ""),
          slug: String(formData.get("slug") || ""),
          icon: String(formData.get("icon") || ""),
          displayOrder: Number(formData.get("displayOrder") || 0),
          active: formData.get("active") === "on",
        });
        setEditing(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  function remove(id: string) {
    if (!confirm("Supprimer ou désactiver ce thème ?")) return;
    setError("");
    startTransition(async () => {
      try {
        await deleteTheme(id);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur");
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-text-muted">{themes.length} thème(s)</p>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={pending}
          onClick={() => setEditing("new")}
        >
          + Ajouter un thème
        </Button>
      </div>

      {error && <p className="text-sm text-terracotta">{error}</p>}

      {editing && (
        <form
          action={submit}
          className="space-y-3 rounded-2xl border border-teal/30 bg-teal/5 p-4"
        >
          <p className="font-medium">
            {editing === "new" ? "Nouveau thème" : `Modifier · ${editing.label}`}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              Libellé
              <input
                name="label"
                required
                defaultValue={editing === "new" ? "" : editing.label}
                className="mt-1 w-full rounded-xl border border-cream-dark bg-white p-2"
              />
            </label>
            <label className="block text-sm">
              Slug (optionnel)
              <input
                name="slug"
                defaultValue={editing === "new" ? "" : editing.slug}
                placeholder="auto depuis le libellé"
                className="mt-1 w-full rounded-xl border border-cream-dark bg-white p-2"
              />
            </label>
            <label className="block text-sm">
              Icône
              <input
                name="icon"
                defaultValue={editing === "new" ? "" : editing.icon ?? ""}
                className="mt-1 w-full rounded-xl border border-cream-dark bg-white p-2"
              />
            </label>
            <label className="block text-sm">
              Ordre
              <input
                name="displayOrder"
                type="number"
                defaultValue={
                  editing === "new"
                    ? themes.length + 1
                    : editing.displayOrder
                }
                className="mt-1 w-full rounded-xl border border-cream-dark bg-white p-2"
              />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="active"
              defaultChecked={editing === "new" ? true : editing.active}
            />
            Actif (visible côté aidant)
          </label>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={pending}>
              Enregistrer
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setEditing(null)}
            >
              Annuler
            </Button>
          </div>
        </form>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        {themes.map((t) => (
          <div
            key={t.id}
            className="flex items-start justify-between gap-2 rounded-2xl border border-cream-dark bg-white p-3"
          >
            <div>
              <p className="font-medium">
                {t.icon ? `${t.icon} ` : ""}
                {t.label}
                {!t.active && (
                  <span className="ml-2 text-xs text-terracotta">inactif</span>
                )}
              </p>
              <p className="text-xs text-text-muted">
                {t.slug} · ordre {t.displayOrder}
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                className="text-sm text-teal"
                disabled={pending}
                onClick={() => setEditing(t)}
              >
                Modifier
              </button>
              <button
                type="button"
                className="text-sm text-terracotta"
                disabled={pending}
                onClick={() => remove(t.id)}
              >
                Suppr.
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
