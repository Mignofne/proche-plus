import { cn } from "@/lib/utils";
import { COMMUNITY_UI } from "@/lib/community/ui-tokens";

/** Carte surface-raised Community (UX-DR12) — boutons parent ≥ 48 px via touch-target. */
export function SurfaceRaised({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(COMMUNITY_UI.surfaceRaised, className)} {...props}>
      {children}
    </div>
  );
}
