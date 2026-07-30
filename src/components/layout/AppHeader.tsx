import Link from "next/link";
import { cn } from "@/lib/utils";

export function AppHeader({
  title,
  backHref,
  className,
}: {
  title: string;
  backHref?: string;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex items-center gap-3 border-b border-cream-dark bg-cream/95 px-4 py-3 backdrop-blur",
        className
      )}
    >
      {backHref && (
        <Link
          href={backHref}
          className="touch-target flex items-center text-teal font-semibold"
          aria-label="Retour"
        >
          ←
        </Link>
      )}
      <h1 className="flex-1 text-lg font-bold text-teal-dark">{title}</h1>
    </header>
  );
}
