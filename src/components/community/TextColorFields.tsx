"use client";

import {
  DEFAULT_SUBTITLE_COLOR,
  DEFAULT_TITLE_COLOR,
  TEXT_COLOR_PRESETS,
} from "@/lib/community/scenes";

/** Sélecteurs couleur titre / sous-titre (presets + color picker) */
export function TextColorFields({
  defaultTitleColor = DEFAULT_TITLE_COLOR,
  defaultSubtitleColor = DEFAULT_SUBTITLE_COLOR,
}: {
  defaultTitleColor?: string;
  defaultSubtitleColor?: string;
}) {
  return (
    <fieldset className="rounded-2xl border border-cream-dark/80 p-3 text-sm">
      <legend className="px-1 font-semibold">Couleurs du texte</legend>
      <p className="mb-2 text-xs text-text-muted">
        Choisissez comme sur les posts type Alan — titre et sous-titre
        indépendants.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <ColorField
          name="titleColor"
          label="Titre"
          defaultValue={defaultTitleColor}
        />
        <ColorField
          name="subtitleColor"
          label="Sous-titre"
          defaultValue={defaultSubtitleColor}
        />
      </div>
    </fieldset>
  );
}

function ColorField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-semibold text-text-muted">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          name={name}
          defaultValue={defaultValue}
          className="h-10 w-14 cursor-pointer rounded-lg border border-cream-dark bg-white"
          onChange={(e) => {
            const preset = e.currentTarget
              .closest("label")
              ?.querySelector<HTMLSelectElement>("select");
            if (preset && [...preset.options].some((o) => o.value === e.target.value)) {
              preset.value = e.target.value;
            }
          }}
        />
        <select
          className="min-w-0 flex-1 rounded-xl border border-cream-dark px-2 py-2 text-xs"
          defaultValue={
            TEXT_COLOR_PRESETS.some((p) => p.value === defaultValue)
              ? defaultValue
              : DEFAULT_TITLE_COLOR
          }
          onChange={(e) => {
            const input = e.currentTarget
              .closest("label")
              ?.querySelector<HTMLInputElement>(`input[name="${name}"]`);
            if (input) input.value = e.target.value;
          }}
        >
          {TEXT_COLOR_PRESETS.map((p) => (
            <option key={`${name}-${p.value}`} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}
