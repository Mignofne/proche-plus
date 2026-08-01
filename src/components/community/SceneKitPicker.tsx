"use client";

import { useState } from "react";
import {
  SCENE_OPTIONS,
  type SceneKey,
} from "@/lib/community/scenes";

/** Sélecteur visuel du kit scènes référentiel (ours-canon) */
export function SceneKitPicker({
  name = "sceneKey",
  defaultValue = "scene-communication",
}: {
  name?: string;
  defaultValue?: SceneKey;
}) {
  const [selected, setSelected] = useState<SceneKey>(defaultValue);

  return (
    <fieldset className="rounded-2xl border border-cream-dark/80 p-3 text-sm">
      <legend className="px-1 font-semibold">
        Scène ours (kit référentiel C-v3)
      </legend>
      <p className="mb-3 text-xs text-text-muted">
        Même kit que{" "}
        <a
          href="/admin-produit/community/ours-canon"
          className="font-semibold text-teal underline"
        >
          Canon ours
        </a>{" "}
        / Studio Ours — pour les posts en situation, pas médaillon.
      </p>
      <input type="hidden" name={name} value={selected} />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {SCENE_OPTIONS.map((s) => {
          const active = s.value === selected;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => setSelected(s.value)}
              className={`overflow-hidden rounded-xl border text-left transition ${
                active
                  ? "border-teal ring-2 ring-teal/40"
                  : "border-cream-dark hover:border-teal/40"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.src}
                alt={s.label}
                className="aspect-square w-full object-cover bg-cream"
              />
              <span className="block px-2 py-1.5 text-[11px] font-semibold leading-tight text-text">
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
