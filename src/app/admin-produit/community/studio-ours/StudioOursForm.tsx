"use client";

import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { SurfaceRaised } from "@/components/community/SurfaceRaised";
import { SectionTitle } from "@/components/ui/Card";
import {
  EMOTION_OPTIONS,
  LIEU_OPTIONS,
  REFERENTIEL_THEMES,
} from "@/lib/community/mascot-gen/constants";
import {
  SAFEGUARD_LIST_FR,
  validateSceneBrief,
} from "@/lib/community/mascot-gen/safeguards";
import type {
  MascotGenerationRecord,
  SceneBrief,
} from "@/lib/community/mascot-gen/types";
import { generateOursSceneAction } from "./actions";
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

export function StudioOursForm({
  initialHistory,
}: {
  initialHistory: MascotGenerationRecord[];
}) {
  const [situation, setSituation] = useState("");
  const [emotion, setEmotion] = useState<string>("rassurant");
  const [emotionCustom, setEmotionCustom] = useState("");
  const [lieu, setLieu] = useState<string>("salon");
  const [lieuCustom, setLieuCustom] = useState("");
  const [themeSlug, setThemeSlug] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const [last, setLast] = useState<MascotGenerationRecord | null>(null);
  const [providerNote, setProviderNote] = useState<string | null>(null);
  const [history, setHistory] = useState(initialHistory);
  const [pending, startTransition] = useTransition();

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

  function onGenerate() {
    setClientError(null);
    setProviderNote(null);
    const v = validateSceneBrief(brief);
    if (!v.ok) {
      setClientError(v.message);
      return;
    }
    startTransition(async () => {
      const result = await generateOursSceneAction(brief);
      if (!result.ok) {
        setClientError(result.message);
        return;
      }
      setLast(result.record);
      setProviderNote(result.providerNote);
      setHistory((prev) => [result.record, ...prev].slice(0, 12));
    });
  }

  return (
    <div className="space-y-6">
      <SurfaceRaised>
        <SectionTitle>Garde-fous verrouillés</SectionTitle>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text-muted">
          {SAFEGUARD_LIST_FR.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </SurfaceRaised>

      <SurfaceRaised>
        <SectionTitle>Composer une scène</SectionTitle>
        <p className="mt-2 text-sm text-text-muted">
          Situation + émotion + lieu → prompt verrouillé (canon C-v3). Phase 1 =
          provider mock (aperçu prompt + placeholder).
        </p>

        <div className="mt-4 space-y-4">
          <label className="block space-y-1">
            <span className="text-sm font-semibold text-teal-dark">
              Situation
            </span>
            <textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              rows={3}
              placeholder='ex. « exerce les freins du fauteuil »'
              className="w-full rounded-2xl border border-cream-dark px-4 py-3"
            />
          </label>

          <div className="space-y-2">
            <span className="text-sm font-semibold text-teal-dark">Émotion</span>
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
            <span className="text-sm font-semibold text-teal-dark">Lieu</span>
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
              <Chip
                active={lieu === "custom"}
                onClick={() => setLieu("custom")}
              >
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
            <span className="text-sm font-semibold text-teal-dark">
              Thème référentiel{" "}
              <span className="font-normal text-text-muted">(optionnel)</span>
            </span>
            <select
              value={themeSlug}
              onChange={(e) => setThemeSlug(e.target.value)}
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

          {clientError ? (
            <p
              role="alert"
              className="rounded-2xl border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta"
            >
              {clientError}
            </p>
          ) : null}

          <Button type="button" onClick={onGenerate} disabled={pending}>
            {pending ? "Génération…" : "Générer"}
          </Button>
        </div>
      </SurfaceRaised>

      {last ? (
        <SurfaceRaised className="space-y-3">
          <SectionTitle>Résultat</SectionTitle>
          {providerNote ? (
            <p className="text-sm text-text-muted">{providerNote}</p>
          ) : null}
          {last.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={last.imageUrl}
              alt="Aperçu génération (placeholder mock = canon C-v3)"
              className="w-full max-w-md rounded-2xl border border-cream-dark bg-cream object-contain"
            />
          ) : null}
          <details open className="rounded-2xl border border-cream-dark bg-cream/40 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-teal-dark">
              Aperçu prompt (positif)
            </summary>
            <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap text-xs text-text">
              {last.promptPositive}
            </pre>
          </details>
          <details className="rounded-2xl border border-cream-dark bg-cream/40 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-teal-dark">
              Prompt négatif
            </summary>
            <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap text-xs text-text">
              {last.promptNegative}
            </pre>
          </details>
          <p className="text-xs text-text-muted">
            id <code>{last.id}</code> · provider <code>{last.provider}</code> ·{" "}
            {last.identityVersion}
          </p>
        </SurfaceRaised>
      ) : null}

      {history.length > 0 ? (
        <SurfaceRaised>
          <SectionTitle>Historique récent</SectionTitle>
          <ul className="mt-3 space-y-2 text-sm">
            {history.map((h) => (
              <li
                key={h.id}
                className="rounded-2xl border border-cream-dark px-3 py-2"
              >
                <span className="font-medium text-teal-dark">{h.status}</span>
                {" · "}
                <span className="text-text-muted">
                  {h.brief.situation.slice(0, 80)}
                  {h.brief.situation.length > 80 ? "…" : ""}
                </span>
                <span className="block text-xs text-text-muted">
                  {new Date(h.createdAt).toLocaleString("fr-FR")} ·{" "}
                  {h.provider}
                </span>
              </li>
            ))}
          </ul>
        </SurfaceRaised>
      ) : null}
    </div>
  );
}
