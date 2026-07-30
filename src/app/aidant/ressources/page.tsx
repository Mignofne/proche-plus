"use client";

import { useEffect, useState } from "react";
import { Card, SectionTitle } from "@/components/ui/Card";
import { AppHeader } from "@/components/layout/AppHeader";

type Resource = { id: string; category: string; title: string; content: string };

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selected, setSelected] = useState<Resource | null>(null);

  useEffect(() => {
    fetch("/api/resources")
      .then((r) => r.json())
      .then((d) => setResources(d.resources));
  }, []);

  const byCategory = resources.reduce(
    (acc, r) => {
      (acc[r.category] ??= []).push(r);
      return acc;
    },
    {} as Record<string, Resource[]>
  );

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-cream pb-8">
      <AppHeader title="Bibliothèque de conseils" backHref="/aidant" />
      <main className="flex flex-col gap-4 p-4">
        {selected ? (
          <Card>
            <SectionTitle>{selected.title}</SectionTitle>
            <p className="mt-3">{selected.content}</p>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-4 text-teal"
            >
              ← Retour à la liste
            </button>
          </Card>
        ) : (
          Object.entries(byCategory).map(([category, items]) => (
            <div key={category}>
              <h2 className="mb-2 font-bold text-teal-dark">{category}</h2>
              <div className="flex flex-col gap-2">
                {items.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelected(r)}
                    className="touch-target rounded-xl border border-cream-dark bg-white p-4 text-left"
                  >
                    {r.title}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
