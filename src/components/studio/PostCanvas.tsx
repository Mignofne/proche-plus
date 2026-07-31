"use client";

import { forwardRef } from "react";
import { BearScene } from "@/components/studio/BearScene";
import type { ParsedScene } from "@/lib/studio/parse-scene";
import { cn } from "@/lib/utils";

export type PostCanvasProps = {
  title: string;
  subtitle: string;
  footer?: string;
  background: string;
  textColor: string;
  parsed: ParsedScene;
  className?: string;
};

/** Découpe le texte en lignes approximatives pour SVG. */
function wrapLines(text: string, maxChars: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const next = current ? `${current} ${w}` : w;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = w;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 5);
}

export const PostCanvas = forwardRef<SVGSVGElement, PostCanvasProps>(
  function PostCanvas(
    {
      title,
      subtitle,
      footer = "proche+",
      background,
      textColor,
      parsed,
      className,
    },
    ref
  ) {
    const displayTitle = title.trim() || "« Ton titre ici »";
    const titleLines = wrapLines(displayTitle, 28);
    const subtitleLines = wrapLines(subtitle, 36);
    const titleStartY = 88;
    const titleLineH = 42;
    const subtitleStartY = titleStartY + titleLines.length * titleLineH + 18;
    const subtitleLineH = 28;

    return (
      <svg
        ref={ref}
        viewBox="0 0 540 675"
        className={cn("aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-lg", className)}
        role="img"
        aria-label={`Post : ${displayTitle}`}
        data-studio-canvas
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="540" height="675" fill={background} />

        {titleLines.map((line, i) => (
          <text
            key={`t-${i}`}
            x="270"
            y={titleStartY + i * titleLineH}
            textAnchor="middle"
            fill={textColor}
            fontFamily="Nunito, system-ui, sans-serif"
            fontWeight="800"
            fontSize="34"
          >
            {line}
          </text>
        ))}

        {subtitleLines.map((line, i) => (
          <text
            key={`s-${i}`}
            x="270"
            y={subtitleStartY + i * subtitleLineH}
            textAnchor="middle"
            fill={textColor}
            fontFamily="Nunito, system-ui, sans-serif"
            fontWeight="600"
            fontSize="20"
            opacity="0.92"
          >
            {line}
          </text>
        ))}

        <BearScene
          nested
          x={70}
          y={300}
          width={400}
          height={300}
          scene={parsed.scene}
          mood={parsed.mood}
          bearCount={parsed.bearCount}
        />

        <g transform="translate(214 620)">
          <circle cx="12" cy="12" r="12" fill={textColor} opacity="0.18" />
          <ellipse cx="12" cy="13" rx="7" ry="6.5" fill={textColor} />
          <ellipse cx="7" cy="8" rx="2.5" ry="2.2" fill={textColor} />
          <ellipse cx="17" cy="8" rx="2.5" ry="2.2" fill={textColor} />
          <circle cx="9.5" cy="12" r="0.8" fill={background} />
          <circle cx="14.5" cy="12" r="0.8" fill={background} />
          <text
            x="32"
            y="17"
            fill={textColor}
            fontFamily="Nunito, system-ui, sans-serif"
            fontWeight="700"
            fontSize="16"
          >
            {footer}
          </text>
        </g>
      </svg>
    );
  }
);
