"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mascot } from "@/components/mascot/Mascot";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

export function SiteHeader({
  title = "Proche+",
  subtitle,
  nav = [],
  variant = "public",
}: {
  title?: string;
  subtitle?: string;
  nav?: NavItem[];
  variant?: "public" | "app";
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const publicNav: NavItem[] =
    variant === "public"
      ? [
          { href: "/connexion?role=aidant", label: "Espace aidant" },
          { href: "/connexion?role=pro", label: "Espace professionnel" },
          { href: "/connexion?role=fondateur", label: "Admin produit" },
        ]
      : nav;

  return (
    <header className="sticky top-0 z-20 border-b border-cream-dark bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Mascot pose="welcome" size="sm" className="animate-mascot-float" />
          <div>
            <p className="font-bold text-teal-dark">{title}</p>
            {subtitle && (
              <p className="text-xs text-text-muted">{subtitle}</p>
            )}
          </div>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          {publicNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={cn(
                "touch-target rounded-xl px-3 py-2 text-sm font-semibold text-teal transition-colors hover:bg-teal/10",
                pathname.startsWith(item.href.split("?")[0]) &&
                  "bg-teal/10 text-teal-dark"
              )}
            >
              {item.label}
            </Link>
          ))}
          {variant === "app" && (
            <Link href="/" className="text-sm text-text-muted hover:text-teal">
              Déconnexion
            </Link>
          )}
        </nav>

        <button
          type="button"
          className="touch-target flex h-12 w-12 items-center justify-center rounded-xl border border-cream-dark bg-white md:hidden"
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-xl" aria-hidden>
            {open ? "✕" : "☰"}
          </span>
        </button>
      </div>

      {open && (
        <div className="animate-fade-in border-t border-cream-dark bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {publicNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onClick={() => setOpen(false)}
                className="touch-target rounded-xl px-3 py-3 font-semibold text-teal hover:bg-teal/10"
              >
                {item.label}
              </Link>
            ))}
            {variant === "app" && (
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="touch-target rounded-xl px-3 py-3 text-text-muted"
              >
                Déconnexion
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
