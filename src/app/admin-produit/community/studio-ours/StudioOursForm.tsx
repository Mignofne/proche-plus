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
        <SectionTitle>Brief de scène</SectionTitle>
        <p className="mt-2 text-sm text-text-muted">
          Situation + émotion + lieu → <strong>prompt verrouillé</strong>{" "}
          (identité ours C-v3). En Phase 1, le bouton compose le prompt ; il
          n’illustre pas encore la scène (placeholder = planche identité).
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
            {pending ? "Composition du prompt…" : "Composer le prompt"}
          </Button>
        </div>
      </SurfaceRaised>

      {last ? (
        <SurfaceRaised className="space-y-3">
          <SectionTitle>
            {last.provider === "mock"
              ? "Résultat — prompt verrouillé"
              : "Résultat"}
          </SectionTitle>
          {providerNote ? (
            <p
              role="status"
              className="rounded-2xl border border-teal/30 bg-teal/10 px-4 py-3 text-sm text-teal-dark"
            >
              {providerNote}
            </p>
          ) : null}

          <div className="rounded-2xl border border-cream-dark bg-cream/40 p-4">
            <h3 className="text-sm font-semibold text-teal-dark">
              {last.provider === "mock"
                ? "Prompt positif (livrable Phase 1)"
                : "Prompt positif"}
            </h3>
            <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap text-xs text-text">
              {last.promptPositive}
            </pre>
          </div>

          <details className="rounded-2xl border border-cream-dark bg-cream/40 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-teal-dark">
              Prompt négatif
            </summary>
            <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap text-xs text-text">
              {last.promptNegative}
            </pre>
          </details>

          {last.imageUrl ? (
            last.provider === "mock" ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-text-muted">
                  Placeholder visuel — planche canon C-v3
                </p>
                <p className="text-xs text-text-muted">
                  Ce n’est pas une illustration de votre situation. L’image de
                  scène arrivera quand un provider réel sera branché.
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={last.imageUrl}
                  alt="Placeholder : planche identité canon C-v3, pas la scène demandée"
                  className="w-full max-w-md rounded-2xl border border-cream-dark bg-cream object-contain"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-teal-dark">
                  Illustration générée
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={last.imageUrl}
                  alt="Illustration de la scène générée"
                  className="w-full max-w-md rounded-2xl border border-cream-dark bg-cream object-contain"
                />
              </div>
            )
          ) : null}

          <p className="text-xs text-text-muted">
            id <code>{last.id}</code> · provider <code>{last.provider}</code> ·{" "}
            {last.identityVersion}
          </p>
        </SurfaceRaised>
      ) : null}

      {history.length > 0 ? (
        <SurfaceRaised>
          <SectionTitle>Historique récent</SectionTitle>
          <p className="mt-1 text-xs text-text-muted">
            En Phase 1 (mock), chaque entrée = prompt enregistré ; l’aperçu
            image reste la planche identité.
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {history.map((h) => {
              const situation = h.brief?.situation ?? "";
              return (
                <li
                  key={h.id}
                  className="rounded-2xl border border-cream-dark px-3 py-2"
                >
                  <span className="font-medium text-teal-dark">
                    {h.status ?? "unknown"}
                  </span>
                  {" · "}
                  <span className="text-text-muted">
                    {situation.slice(0, 80) || "(sans situation)"}
                    {situation.length > 80 ? "…" : ""}
                  </span>
                  <span className="block text-xs text-text-muted">
                    {h.createdAt
                      ? new Date(h.createdAt).toLocaleString("fr-FR")
                      : "—"}{" "}
                    · {h.provider ?? "—"}
                  </span>
                </li>
              );
            })}
          </ul>
        </SurfaceRaised>
      ) : null}
    </div>
  );
}
