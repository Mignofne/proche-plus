"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const fieldClass =
  "mt-1.5 w-full rounded-2xl border border-teal/20 bg-white/90 px-4 py-3 text-base text-text shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-text-muted/60 focus:border-teal focus:ring-2 focus:ring-teal/25";

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
      <div
        className="animate-soft-pop rounded-3xl border border-teal/20 bg-white/80 px-6 py-8 text-center shadow-sm backdrop-blur-sm"
        role="status"
      >
        <p className="font-[family-name:var(--font-beta-display)] text-2xl font-semibold text-teal-dark">
          Merci — vous êtes sur la liste.
        </p>
        <p className="mt-3 text-text-muted">
          On vous écrit une seule fois, dès l&apos;ouverture des tests. Votre
          avis compte vraiment.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="animate-fade-up space-y-5 rounded-3xl border border-teal/15 bg-white/75 p-5 shadow-[0_12px_40px_-18px_rgb(31_122_111/0.35)] backdrop-blur-sm sm:p-7"
      noValidate={false}
    >
      {/* Primary CTA row — founder copy */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="block flex-1 text-left text-sm font-medium text-text">
          Votre email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="vous@email.fr"
            className={fieldClass}
          />
        </label>
        <Button
          type="submit"
          disabled={pending}
          size="lg"
          className="animate-cta-glow shrink-0 sm:mb-0.5"
        >
          {pending ? "Envoi…" : "Je participe au test"}
        </Button>
      </div>

      <p className="text-center text-sm text-text-muted">
        On vous écrit une seule fois, dès l&apos;ouverture des tests. Votre avis
        compte vraiment.
      </p>

      {/* RGPD / beta-program required fields */}
      <div className="grid gap-4 border-t border-teal/10 pt-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-text">
          Prénom
          <input
            name="firstName"
            required
            autoComplete="given-name"
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-medium text-text">
          Profil
          <select
            name="profile"
            required
            className={fieldClass}
            defaultValue="aidant"
          >
            <option value="aidant">Aidant / proche</option>
            <option value="pro">Professionnel</option>
            <option value="autre">Autre</option>
          </select>
        </label>
      </div>

      <label className="block text-sm font-medium text-text">
        Motivation{" "}
        <span className="font-normal text-text-muted">(optionnel)</span>
        <textarea name="motivation" rows={2} className={fieldClass} />
      </label>

      <label className="flex items-start gap-3 text-sm leading-snug text-text">
        <input
          type="checkbox"
          name="consentBeta"
          className="mt-0.5 h-5 w-5 shrink-0 accent-teal"
          required
        />
        <span>
          J&apos;accepte d&apos;être recontacté(e) dans le cadre du programme
          bêta Proche+ (obligatoire).
        </span>
      </label>
      <label className="flex items-start gap-3 text-sm leading-snug text-text">
        <input
          type="checkbox"
          name="consentNewsletter"
          className="mt-0.5 h-5 w-5 shrink-0 accent-teal"
        />
        <span>
          Je m&apos;inscris à la newsletter mensuelle (optionnel, indépendant de
          la candidature).
        </span>
      </label>

      <p className="text-xs leading-relaxed text-text-muted">
        Cadre légal :{" "}
        <Link className="text-teal underline" href="/cgu">
          CGU
        </Link>
        ,{" "}
        <Link className="text-teal underline" href="/mentions-legales">
          mentions
        </Link>
        ,{" "}
        <Link
          className="text-teal underline"
          href="/politique-de-confidentialite"
        >
          confidentialité
        </Link>
        ,{" "}
        <Link className="text-teal underline" href="/conditions-etablissement">
          conditions établissement
        </Link>
        . Audience : Vercel Analytics.
      </p>

      {error ? (
        <p className="text-sm font-medium text-terracotta" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
