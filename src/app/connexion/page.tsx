"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";

function roleLabel(role: string | null) {
  if (role === "pro" || role === "admin")
    return "Espace professionnel (soin + pilotage établissement si habilité)";
  if (role === "fondateur") return "Admin produit (fondateurs)";
  return "Espace aidant — démo Jean Martin";
}

function defaultEmail(role: string | null) {
  if (role === "pro") return "pro@procheplus.demo";
  if (role === "admin") return "admin@procheplus.demo";
  if (role === "fondateur") return "fondateur@procheplus.demo";
  return "jean.martin@demo.fr";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleHint = searchParams.get("role");
  const [email, setEmail] = useState(defaultEmail(roleHint));
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erreur de connexion");
        setLoading(false);
        return;
      }

      const target =
        data.role === "caregiver" && !data.onboardingDone
          ? "/aidant/onboarding"
          : (data.redirectTo ?? "/");

      router.replace(target);
      router.refresh();
    } catch {
      setError("Connexion impossible. Réessaie.");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col gap-6 p-6">
      <div className="flex flex-col items-center gap-4 pt-8">
        <Mascot pose="welcome" />
        <h1 className="text-2xl font-bold text-teal-dark">Connexion</h1>
        <p className="text-center text-sm text-text-muted">
          {roleLabel(roleHint)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="font-medium">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="touch-target rounded-xl border border-cream-dark bg-white px-4 py-3"
            required
            autoComplete="email"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-medium">Mot de passe</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="touch-target rounded-xl border border-cream-dark bg-white px-4 py-3"
            required
            autoComplete="current-password"
          />
        </label>

        {error && (
          <p className="rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
            {error}
          </p>
        )}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"}
        </Button>
      </form>

      <a href="/" className="text-center text-sm text-teal">
        ← Retour à l&apos;accueil
      </a>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="p-6">Chargement…</main>}>
      <LoginForm />
    </Suspense>
  );
}
