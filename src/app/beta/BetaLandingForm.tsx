"use client";

import { useState } from "react";
import Link from "next/link";
import { HealthDisclaimer } from "@/components/community/HealthDisclaimer";
import { Button } from "@/components/ui/Button";
import { SurfaceRaised } from "@/components/community/SurfaceRaised";

export function BetaLandingForm() {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      email: String(fd.get("email") || ""),
      firstName: String(fd.get("firstName") || ""),
      profile: String(fd.get("profile") || ""),
      motivation: String(fd.get("motivation") || "") || null,
      consentBeta: fd.get("consentBeta") === "on",
      consentNewsletter: fd.get("consentNewsletter") === "on",
    };
    try {
      const res = await fetch("/api/community/beta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.");
        return;
      }
      setOk(true);
    } catch {
      setError("Une erreur est survenue. Réessayez plus tard.");
    } finally {
      setPending(false);
    }
  }

  if (ok) {
    return (
      <SurfaceRaised>
        <h2 className="text-xl font-bold text-teal-dark">Candidature reçue</h2>
        <p className="mt-2 text-text-muted">
          Merci. Un fondateur vous recontactera dans le cadre du programme bêta.
        </p>
      </SurfaceRaised>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <HealthDisclaimer compact />
      <p className="text-sm text-text-muted">
        Cadre légal :{" "}
        <Link className="text-teal underline" href="/cgu">
          CGU
        </Link>
        ,{" "}
        <Link className="text-teal underline" href="/mentions-legales">
          mentions
        </Link>
        ,{" "}
        <Link className="text-teal underline" href="/politique-de-confidentialite">
          confidentialité
        </Link>
        ,{" "}
        <Link className="text-teal underline" href="/conditions-etablissement">
          conditions établissement
        </Link>
        . Mesure d’audience : Vercel Analytics (voir privacy).
      </p>

      <label className="block text-sm font-medium">
        Prénom
        <input
          name="firstName"
          required
          className="mt-1 w-full rounded-2xl border border-cream-dark bg-white px-4 py-3"
        />
      </label>
      <label className="block text-sm font-medium">
        Email
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-2xl border border-cream-dark bg-white px-4 py-3"
        />
      </label>
      <label className="block text-sm font-medium">
        Profil
        <select
          name="profile"
          required
          className="mt-1 w-full rounded-2xl border border-cream-dark bg-white px-4 py-3"
          defaultValue=""
        >
          <option value="" disabled>
            Choisir…
          </option>
          <option value="aidant">Aidant / proche</option>
          <option value="pro">Professionnel</option>
          <option value="autre">Autre</option>
        </select>
      </label>
      <label className="block text-sm font-medium">
        Motivation (optionnel)
        <textarea
          name="motivation"
          rows={3}
          className="mt-1 w-full rounded-2xl border border-cream-dark bg-white px-4 py-3"
        />
      </label>

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          name="consentBeta"
          className="mt-1 h-5 w-5"
          required
        />
        <span>
          J’accepte d’être recontacté(e) dans le cadre du programme bêta Proche+
          (obligatoire, non pré-coché).
        </span>
      </label>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="consentNewsletter" className="mt-1 h-5 w-5" />
        <span>
          Je m’inscris à la newsletter mensuelle (optionnel, indépendant de la
          candidature).
        </span>
      </label>

      {error ? <p className="text-sm text-terracotta">{error}</p> : null}
      <Button type="submit" disabled={pending} fullWidth>
        {pending ? "Envoi…" : "Candidater à la bêta"}
      </Button>
    </form>
  );
}
