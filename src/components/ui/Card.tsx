import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-cream-dark bg-white p-5 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn("text-lg font-bold text-teal-dark", className)}>
      {children}
    </h2>
  );
}

export function BackButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="touch-target inline-flex items-center gap-2 text-teal font-medium"
      aria-label="Retour"
    >
      ← Retour
    </a>
  );
}
