"use client";

/**
 * Questions Studio Ours (situation · émotion · lieu) + choix scène kit.
 * Branché sur le flux Nouveau post — même brief que studio-ours.
 */

import { useEffect, useMemo, useState } from "react";
import {
  EMOTION_OPTIONS,
  LIEU_OPTIONS,
  REFERENTIEL_THEMES,
} from "@/lib/community/mascot-gen/constants";
import {
  SCENE_OPTIONS,
  mapSceneBriefToSceneKey,
  type SceneKey,
} from "@/lib/community/scenes";
import type { SceneBrief } from "@/lib/community/mascot-gen/types";
import { cn } from "@/lib/utils";

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "border-teal bg-teal/10 text-teal-dark"
          : "border-cream-dark bg-white text-text-muted hover:border-teal/40"
      )}
    >
      {children}
    </button>
  );
}

export function OursSituationFields({
  defaultSceneKey = "scene-communication",
}: {
  defaultSceneKey?: SceneKey;
}) {
  const [situation, setSituation] = useState("");
  const [emotion, setEmotion] = useState("rassurant");
  const [emotionCustom, setEmotionCustom] = useState("");
  const [lieu, setLieu] = useState("salon");
  const [lieuCustom, setLieuCustom] = useState("");
  const [themeSlug, setThemeSlug] = useState("");
  const [sceneKey, setSceneKey] = useState<SceneKey>(defaultSceneKey);
  const [sceneTouched, setSceneTouched] = useState(false);

  const brief: SceneBrief = useMemo(
    () => ({
      situation,
      emotion,
      emotionCustom: emotion === "custom" ? emotionCustom : null,
      lieu,
      lieuCustom: lieu === "custom" ? lieuCustom : null,
      themeSlug: themeSlug || null,
    }),
    [situation, emotion, emotionCustom, lieu, lieuCustom, themeSlug]
  );

  const suggested = mapSceneBriefToSceneKey(brief, sceneKey);

  useEffect(() => {
    if (!sceneTouched) {
      setSceneKey(suggested);
    }
  }, [suggested, sceneTouched]);

  return (
    <fieldset className="space-y-4 rounded-2xl border border-cream-dark/80 p-3 text-sm">
      <legend className="px-1 font-semibold">
        Situation de l’ours
      </legend>
      <p className="text-xs text-text-muted">
        Situation · émotion · lieu — on mappe vers une scène du kit référentiel.
      </p>

      <input type="hidden" name="situation" value={situation} />
      <input type="hidden" name="emotion" value={emotion} />
      <input type="hidden" name="emotionCustom" value={emotionCustom} />
      <input type="hidden" name="lieu" value={lieu} />
      <input type="hidden" name="lieuCustom" value={lieuCustom} />
      <input type="hidden" name="referentielThemeSlug" value={themeSlug} />
      <input type="hidden" name="sceneKey" value={sceneKey} />

      <label className="block space-y-1">
        <span className="text-xs font-semibold text-teal-dark">Situation</span>
        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          rows={3}
          placeholder='ex. « exerce les freins du fauteuil, tranquillement »'
          className="w-full rounded-2xl border border-cream-dark px-4 py-3"
        />
      </label>

      <div className="space-y-2">
        <span className="text-xs font-semibold text-teal-dark">Émotion</span>
        <div className="flex flex-wrap gap-2">
          {EMOTION_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              active={emotion === opt.value}
              onClick={() => setEmotion(opt.value)}
            >
              {opt.label}
            </Chip>
          ))}
          <Chip
            active={emotion === "custom"}
            onClick={() => setEmotion("custom")}
          >
            Autre…
          </Chip>
        </div>
        {emotion === "custom" ? (
          <input
            value={emotionCustom}
            onChange={(e) => setEmotionCustom(e.target.value)}
            placeholder="Émotion libre"
            className="w-full rounded-2xl border border-cream-dark px-4 py-3"
          />
        ) : null}
      </div>

      <div className="space-y-2">
        <span className="text-xs font-semibold text-teal-dark">Lieu</span>
        <div className="flex flex-wrap gap-2">
          {LIEU_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              active={lieu === opt.value}
              onClick={() => setLieu(opt.value)}
            >
              {opt.label}
            </Chip>
          ))}
          <Chip active={lieu === "custom"} onClick={() => setLieu("custom")}>
            Autre…
          </Chip>
        </div>
        {lieu === "custom" ? (
          <input
            value={lieuCustom}
            onChange={(e) => setLieuCustom(e.target.value)}
            placeholder="Lieu libre"
            className="w-full rounded-2xl border border-cream-dark px-4 py-3"
          />
        ) : null}
      </div>

      <label className="block space-y-1">
        <span className="text-xs font-semibold text-teal-dark">
          Thème référentiel{" "}
          <span className="font-normal text-text-muted">(oriente la scène)</span>
        </span>
        <select
          value={themeSlug}
          onChange={(e) => {
            setThemeSlug(e.target.value);
            setSceneTouched(false);
          }}
          className="w-full rounded-2xl border border-cream-dark px-4 py-3"
        >
          <option value="">— Aucun —</option>
          {REFERENTIEL_THEMES.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      <div className="space-y-2">
        <span className="text-xs font-semibold text-teal-dark">
          Scène kit proposée{" "}
          <span className="font-normal text-text-muted">
            (modifiable)
          </span>
        </span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SCENE_OPTIONS.map((s) => {
            const active = s.value === sceneKey;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => {
                  setSceneKey(s.value);
                  setSceneTouched(true);
                }}
                className={cn(
                  "overflow-hidden rounded-xl border text-left transition",
                  active
                    ? "border-teal ring-2 ring-teal/40"
                    : "border-cream-dark hover:border-teal/40"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt={s.label}
                  className="aspect-square w-full bg-cream object-cover"
                />
                <span className="block px-2 py-1.5 text-[11px] font-semibold leading-tight text-text">
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </fieldset>
  );
}
