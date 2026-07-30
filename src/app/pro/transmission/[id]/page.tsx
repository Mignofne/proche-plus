"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import {
  PREDEFINED_INSTRUCTIONS,
  SKILL_LABELS,
  STATUS_LABELS,
} from "@/lib/constants";

const SKILLS = Object.keys(SKILL_LABELS);
const STATUSES = Object.keys(STATUS_LABELS);

type Patient = { id: string; firstName: string; lastName: string };

export default function CreateTransmissionPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [step, setStep] = useState(0);
  const [skill, setSkill] = useState("transfert");
  const [status, setStatus] = useState("en_cours");
  const [selectedInstructions, setSelectedInstructions] = useState<string[]>([]);
  const [customInstruction, setCustomInstruction] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [messages, setMessages] = useState({
    a_retenir: "",
    a_essayer: "",
    a_eviter: "",
    a_revoir_ensemble: "",
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("/api/pro")
      .then((r) => r.json())
      .then((data) => {
        const p = data.patients.find((x: Patient) => x.id === patientId);
        setPatient(p ?? null);
      });
  }, [patientId]);

  function toggleInstruction(inst: string) {
    setSelectedInstructions((prev) =>
      prev.includes(inst) ? prev.filter((i) => i !== inst) : [...prev, inst]
    );
  }

  async function send() {
    setSending(true);
    const instructions = [
      ...selectedInstructions,
      ...(customInstruction ? [customInstruction] : []),
    ].join(". ");

    const messageList = Object.entries(messages)
      .filter(([, content]) => content.trim())
      .map(([section, content]) => ({ section, content }));

    await fetch("/api/pro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_transmission",
        patientId,
        skill,
        status,
        instructions,
        nextStep,
        messages: messageList,
      }),
    });

    router.push("/pro");
  }

  if (!patient) return <main className="p-8">Chargement…</main>;

  const steps = [
    "Compétence",
    "Statut",
    "Consignes",
    "Message aidant",
    "Aperçu",
  ];

  return (
    <div className="min-h-dvh bg-cream">
      <header className="border-b border-cream-dark bg-white px-6 py-4">
        <div className="mx-auto max-w-2xl">
          <Link href="/pro" className="text-teal">
            ← Annuler
          </Link>
          <h1 className="mt-2 text-xl font-bold">
            Transmission — {patient.firstName} {patient.lastName}
          </h1>
          <p className="text-sm text-text-muted">
            Étape {step + 1}/{steps.length} : {steps[step]}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl p-6">
        {step === 0 && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SKILLS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSkill(s)}
                className={`touch-target rounded-xl border p-3 text-sm font-medium ${
                  skill === s
                    ? "border-teal bg-teal/10 text-teal-dark"
                    : "border-cream-dark bg-white"
                }`}
              >
                {SKILL_LABELS[s]}
              </button>
            ))}
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
            {PREDEFINED_INSTRUCTIONS.map((inst) => (
              <label
                key={inst}
                className="flex items-start gap-3 rounded-xl border border-cream-dark bg-white p-4"
              >
                <input
                  type="checkbox"
                  checked={selectedInstructions.includes(inst)}
                  onChange={() => toggleInstruction(inst)}
                  className="mt-1 h-5 w-5"
                />
                <span>{inst}</span>
              </label>
            ))}
            <textarea
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              placeholder="Consigne personnalisée…"
              className="rounded-xl border border-cream-dark bg-white p-4"
            />
            <input
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              placeholder="Objectif de la prochaine visite"
              className="rounded-xl border border-cream-dark bg-white p-4"
            />
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            {(
              [
                ["a_retenir", "À retenir"],
                ["a_essayer", "À essayer"],
                ["a_eviter", "À éviter"],
                ["a_revoir_ensemble", "À revoir ensemble"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex flex-col gap-2">
                <span className="font-medium">{label}</span>
                <textarea
                  value={messages[key]}
                  onChange={(e) =>
                    setMessages((m) => ({ ...m, [key]: e.target.value }))
                  }
                  className="rounded-xl border border-cream-dark bg-white p-4"
                  rows={2}
                />
              </label>
            ))}
          </div>
        )}

        {step === 4 && (
          <Card>
            <SectionTitle>Aperçu — message pour l&apos;aidant</SectionTitle>
            {Object.entries(messages)
              .filter(([, v]) => v.trim())
              .map(([section, content]) => (
                <div key={section} className="mt-3">
                  <p className="text-sm font-bold text-teal">{section}</p>
                  <p>{content}</p>
                </div>
              ))}
            {nextStep && (
              <p className="mt-4 text-sm">
                <strong>Prochaine visite :</strong> {nextStep}
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
            <Button onClick={() => setStep((s) => s + 1)} fullWidth>
              Suivant
            </Button>
          ) : (
            <Button onClick={send} disabled={sending} fullWidth>
              {sending ? "Envoi…" : "Envoyer à l'aidant"}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
