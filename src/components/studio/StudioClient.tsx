"use client";

import { useDeferredValue, useMemo, useRef, useState, useTransition } from "react";
import { PostCanvas } from "@/components/studio/PostCanvas";
import { Button } from "@/components/ui/Button";
import {
  parseBearDescription,
  SCENE_PRESETS,
  type StudioSceneId,
} from "@/lib/studio/parse-scene";
import { cn } from "@/lib/utils";

const DEFAULT_BG = "#F6D5B8";
const DEFAULT_TEXT = "#5B6BE0";

async function exportSvgAsPng(svg: SVGSVGElement, filename: string) {
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);
  const blob = new Blob(
    [`<?xml version="1.0" encoding="UTF-8"?>${source}`],
    { type: "image/svg+xml;charset=utf-8" }
  );
  const url = URL.createObjectURL(blob);

  const width = 1080;
  const height = 1350;

  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas indisponible");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        canvas.toBlob((png) => {
          if (!png) {
            reject(new Error("Export PNG échoué"));
            return;
          }
          const a = document.createElement("a");
          a.href = URL.createObjectURL(png);
          a.download = filename;
          a.click();
          URL.revokeObjectURL(a.href);
          resolve();
        }, "image/png");
      } catch (e) {
        URL.revokeObjectURL(url);
        reject(e);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Impossible de rasteriser l’aperçu"));
    };
    img.src = url;
  });
}

export function StudioClient() {
  const [title, setTitle] = useState(
    "« T’es pas obligé·e d’être fort·e tout le temps »"
  );
  const [subtitle, setSubtitle] = useState(
    "Ça, c’est un espace de sécurité. Pas juste une phrase."
  );
  const [description, setDescription] = useState(
    "sur le canapé, un peu triste, besoin de réconfort"
  );
  const [background, setBackground] = useState(DEFAULT_BG);
  const [textColor, setTextColor] = useState(DEFAULT_TEXT);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportOk, setExportOk] = useState(false);
  const [isPending, startTransition] = useTransition();
  const canvasRef = useRef<SVGSVGElement>(null);

  const deferredDescription = useDeferredValue(description);
  const parsed = useMemo(
    () => parseBearDescription(deferredDescription),
    [deferredDescription]
  );

  function applyPreset(_sceneId: StudioSceneId, example: string) {
    startTransition(() => {
      setDescription(example);
    });
  }

  async function handleExport() {
    setExportError(null);
    setExportOk(false);
    const node = canvasRef.current;
    if (!node) {
      setExportError("Aperçu introuvable");
      return;
    }
    try {
      await exportSvgAsPng(node, `proche-plus-post-${parsed.scene}.png`);
      setExportOk(true);
    } catch (e) {
      setExportError(
        e instanceof Error ? e.message : "Export impossible pour le moment"
      );
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
      <section className="order-2 lg:order-1">
        <div className="mx-auto max-w-md">
          <PostCanvas
            ref={canvasRef}
            title={title}
            subtitle={subtitle}
            background={background}
            textColor={textColor}
            parsed={parsed}
          />
          <p
            className={cn(
              "mt-3 text-center text-sm transition-opacity",
              parsed.matched ? "text-teal-dark" : "text-text-muted"
            )}
            aria-live="polite"
          >
            {isPending ? "Mise à jour…" : parsed.label}
            {!parsed.matched && description.trim()
              ? " — scène par défaut (ajoute un mot-clé)"
              : null}
          </p>
        </div>
      </section>

      <section className="order-1 flex flex-col gap-5 lg:order-2">
        <div>
          <h1 className="text-2xl font-bold text-teal-dark">Studio posts</h1>
          <p className="mt-1 text-sm text-text-muted">
            Compose un post façon carousel, et décline ton ours en le décrivant.
          </p>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Titre</span>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={2}
            className="rounded-2xl border border-cream-dark bg-white px-4 py-3 text-base outline-none ring-teal focus:ring-2"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Sous-titre</span>
          <textarea
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            className="rounded-2xl border border-cream-dark bg-white px-4 py-3 text-base outline-none ring-teal focus:ring-2"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold">
            Décris ton ours — « je veux qu’il soit comme ça »
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Ex. assis au bureau avec une lampe allumée"
            className="rounded-2xl border border-cream-dark bg-white px-4 py-3 text-base outline-none ring-teal focus:ring-2"
          />
        </label>

        <div>
          <p className="mb-2 text-sm font-semibold">Exemples rapides</p>
          <div className="flex flex-wrap gap-2">
            {SCENE_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id, p.example)}
                className={cn(
                  "rounded-xl border border-cream-dark bg-white px-3 py-2 text-left text-sm font-semibold text-teal transition-colors hover:bg-teal/10",
                  parsed.scene === p.id &&
                    "border-teal bg-teal/10 text-teal-dark"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Fond</span>
            <input
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="h-12 w-full cursor-pointer rounded-xl border border-cream-dark bg-white p-1"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Texte</span>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="h-12 w-full cursor-pointer rounded-xl border border-cream-dark bg-white p-1"
            />
          </label>
        </div>

        <Button type="button" onClick={handleExport} fullWidth>
          Exporter en PNG
        </Button>

        {exportOk && (
          <p className="text-sm font-semibold text-teal-dark" role="status">
            PNG téléchargé.
          </p>
        )}
        {exportError && (
          <p className="text-sm font-semibold text-terracotta" role="alert">
            {exportError}
          </p>
        )}
      </section>
    </div>
  );
}
