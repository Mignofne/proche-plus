import {
  HEALTH_DISCLAIMER_BODY,
  HEALTH_DISCLAIMER_TITLE,
} from "@/lib/community/health-disclaimer";

export { HEALTH_DISCLAIMER_BODY, HEALTH_DISCLAIMER_TITLE };

export function HealthDisclaimer({
  className,
  compact,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <aside
      className={
        className ??
        "rounded-2xl border border-terracotta/30 bg-terracotta/5 p-4 text-sm leading-relaxed text-text"
      }
      role="note"
      aria-label={HEALTH_DISCLAIMER_TITLE}
    >
      <p className="font-bold text-terracotta">{HEALTH_DISCLAIMER_TITLE}</p>
      <p className={compact ? "mt-1" : "mt-2"}>{HEALTH_DISCLAIMER_BODY}</p>
    </aside>
  );
}
