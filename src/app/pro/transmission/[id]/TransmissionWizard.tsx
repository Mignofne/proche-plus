"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Mascot } from "@/components/mascot/Mascot";
import {
  MESSAGE_SECTION_LABELS,
  SKILL_LABELS,
  STATUS_LABELS,
} from "@/lib/constants";
import {
  CONSIGNES_PAR_THEME,
  SECTION_OPTIONS,
  THEME_OPTIONS,
  type ConsigneSection,
  type SelectedConsigne,
} from "@/lib/consignes-bibliotheque";

const STATUSES = Object.keys(STATUS_LABELS);

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
};

export function TransmissionWizard({ patient }: { patient: Patient }) {
  const router = useRouter();
  const patientId = patient.id;
  const [step, setStep] = useState(0);
  const [themes, setThemes] = useState<string[]>(["transfert"]);
  const [status, setStatus] = useState("en_cours");
  const [selected, setSelected] = useState<SelectedConsigne[]>([]);
  const [activeTheme, setActiveTheme] = useState("transfert");
  const [customSection, setCustomSection] =
    useState<ConsigneSection>("a_essayer");
  const [customText, setCustomText] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!themes.includes(activeTheme) && themes[0]) {
      setActiveTheme(themes[0]);
    }
  }, [themes, activeTheme]);

  const bySection = useMemo(() => {
    const map: Record<ConsigneSection, SelectedConsigne[]> = {
      a_retenir: [],
      a_essayer: [],
      a_eviter: [],
      a_revoir_ensemble: [],
    };
    for (const c of selected) map[c.section].push(c);
    return map;
  }, [selected]);

  function toggleTheme(id: string) {
    setThemes((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        const next = prev.filter((t) => t !== id);
        setSelected((sels) => sels.filter((s) => s.theme !== id));
        return next;
      }
      return [...prev, id];
    });
  }

  function toggleLibraryConsigne(theme: string, consigneId: string) {
    const item = CONSIGNES_PAR_THEME[theme]?.find((c) => c.id === consigneId);
    if (!item) return;
    const key = `${theme}:${consigneId}`;
    setSelected((prev) => {
      if (prev.some((s) => s.key === key)) {
        return prev.filter((s) => s.key !== key);
      }
      return [
        ...prev,
        {
          key,
          theme,
          section: item.section,
          content: item.text,
          source: "library",
        },
      ];
    });
  }

  function addCustomConsigne() {
    if (!customText.trim() || !activeTheme) return;
    const key = `custom:${activeTheme}:${Date.now()}`;
    setSelected((prev) => [
      ...prev,
      {
        key,
        theme: activeTheme,
        section: customSection,
        content: customText.trim(),
        source: "custom",
      },
    ]);
    setCustomText("");
  }

  function removeConsigne(key: string) {
    setSelected((prev) => prev.filter((s) => s.key !== key));
  }

  async function send() {
    if (!selected.length) return;
    setSending(true);

    const primaryTheme = themes[0] ?? "autre";
    const instructions = selected.map((s) => s.content).join("\n");
    const messages = selected.map((s) => ({
      section: s.section,
      theme: s.theme,
      content: s.content,
    }));

    await fetch("/api/pro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_transmission",
        patientId,
        skill: primaryTheme,
        status,
        instructions,
        nextStep,
        messages,
      }),
    });

    router.push(`/pro/patient/${patientId}`);
    router.refresh();
  }

  const steps = [
    "Thématiques",
    "Statut",
    "Consignes par thème",
    "Objectif visite",
    "Aperçu",
  ];

  const libraryForActive = CONSIGNES_PAR_THEME[activeTheme] ?? [];

  return (
    <div className="min-h-dvh bg-cream">
      <header className="border-b border-cream-dark bg-white px-6 py-4">
        <div className="mx-auto max-w-2xl">
          <Link href={`/pro/patient/${patientId}`} prefetch className="text-teal">
            ← Annuler
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <Mascot pose="encourage" size="sm" />
            <div>
              <h1 className="text-xl font-bold">
                Transmission — {patient.firstName} {patient.lastName}
              </h1>
              <p className="text-sm text-text-muted">
                Étape {step + 1}/{steps.length} : {steps[step]}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl p-6">
        {step === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-text-muted">
              Choisissez une ou plusieurs thématiques travaillées aujourd&apos;hui.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {THEME_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTheme(t.id)}
                  className={`touch-target rounded-xl border p-3 text-sm font-medium ${
                    themes.includes(t.id)
                      ? "border-teal bg-teal/10 text-teal-dark"
                      : "border-cream-dark bg-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`touch-target rounded-xl border p-4 text-left font-medium ${
                  status === s
                    ? "border-teal bg-teal/10"
                    : "border-cream-dark bg-white"
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {themes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActiveTheme(t)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    activeTheme === t
                      ? "bg-teal text-white"
                      : "bg-cream-dark text-text-muted"
                  }`}
                >
                  {SKILL_LABELS[t]}
                </button>
              ))}
            </div>

            <Card>
              <SectionTitle>
                Bibliothèque — {SKILL_LABELS[activeTheme]}
              </SectionTitle>
              <div className="mt-3 flex flex-col gap-2">
                {libraryForActive.map((c) => {
                  const key = `${activeTheme}:${c.id}`;
                  const checked = selected.some((s) => s.key === key);
                  return (
                    <label
                      key={c.id}
                      className="flex items-start gap-3 rounded-xl border border-cream-dark bg-white p-3"
                    >
                      <input
                        type="checkbox"
                        className="mt-1 h-5 w-5"
                        checked={checked}
                        onChange={() =>
                          toggleLibraryConsigne(activeTheme, c.id)
                        }
                      />
                      <span>
                        <span className="text-xs font-semibold text-teal">
                          {MESSAGE_SECTION_LABELS[c.section]}
                        </span>
                        <span className="mt-1 block text-sm">{c.text}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </Card>

            <Card>
              <SectionTitle>Ajouter une consigne libre</SectionTitle>
              <p className="mt-1 text-sm text-text-muted">
                Thème : {SKILL_LABELS[activeTheme]}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SECTION_OPTIONS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCustomSection(s.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      customSection === s.id
                        ? "bg-sun text-text"
                        : "bg-cream-dark text-text-muted"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Ex. : Dites « Glissez vers l’avant », attendez 5 s…"
                className="mt-3 min-h-24 w-full rounded-xl border border-cream-dark bg-white p-4"
              />
              <Button
                className="mt-3"
                variant="secondary"
                onClick={addCustomConsigne}
                disabled={!customText.trim()}
                fullWidth
              >
                Ajouter cette consigne
              </Button>
            </Card>

            {selected.length > 0 && (
              <Card>
                <SectionTitle>
                  Consignes sélectionnées ({selected.length})
                </SectionTitle>
                <ul className="mt-3 space-y-2">
                  {selected.map((s) => (
                    <li
                      key={s.key}
                      className="flex items-start justify-between gap-2 rounded-xl bg-cream p-3 text-sm"
                    >
                      <span>
                        <span className="font-semibold text-teal">
                          {SKILL_LABELS[s.theme]} ·{" "}
                          {MESSAGE_SECTION_LABELS[s.section]}
                        </span>
                        <span className="mt-1 block">{s.content}</span>
                      </span>
                      <button
                        type="button"
                        className="shrink-0 text-terracotta"
                        onClick={() => removeConsigne(s.key)}
                      >
                        Retirer
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-text-muted">
              Objectif clair pour la prochaine visite (ce que l&apos;aidant doit
              retenir en une phrase).
            </p>
            <input
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              placeholder="Ex. : Aider à se repositionner dans le fauteuil — sans le soulever"
              className="rounded-xl border border-cream-dark bg-white p-4"
            />
          </div>
        )}

        {step === 4 && (
          <Card>
            <SectionTitle>Aperçu — message pour l&apos;aidant</SectionTitle>
            {nextStep && (
              <p className="mt-3 rounded-xl bg-teal/10 p-3 font-medium">
                Objectif : {nextStep}
              </p>
            )}
            {SECTION_OPTIONS.map((section) => {
              const items = bySection[section.id];
              if (!items.length) return null;
              return (
                <div key={section.id} className="mt-4">
                  <p className="text-sm font-bold text-teal">{section.label}</p>
                  <ul className="mt-2 list-disc space-y-2 pl-5 text-sm">
                    {items.map((item) => (
                      <li key={item.key}>
                        <span className="text-text-muted">
                          [{SKILL_LABELS[item.theme]}]
                        </span>{" "}
                        {item.content}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {!selected.length && (
              <p className="mt-3 text-sm text-terracotta">
                Aucune consigne — revenez à l&apos;étape précédente.
              </p>
            )}
          </Card>
        )}

        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
              Précédent
            </Button>
          )}
          {step < steps.length - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              fullWidth
              disabled={step === 2 && selected.length === 0}
            >
              Suivant
            </Button>
          ) : (
            <Button
              onClick={send}
              disabled={sending || selected.length === 0}
              fullWidth
            >
              {sending ? "Envoi…" : "Envoyer à l'aidant"}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
