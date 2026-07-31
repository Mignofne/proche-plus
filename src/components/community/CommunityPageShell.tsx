import Link from "next/link";
import { Mascot } from "@/components/mascot/Mascot";
import { COMMUNITY_UI } from "@/lib/community/ui-tokens";
import { cn } from "@/lib/utils";

export function CommunityPageShell({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className={cn("min-h-dvh", COMMUNITY_UI.pageBg)}>
      <header className="border-b border-cream-dark bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Mascot pose="encourage" size="sm" />
            <div>
              <h1 className={cn("text-xl", COMMUNITY_UI.title)}>{title}</h1>
              {subtitle ? (
                <p className={cn("text-sm", COMMUNITY_UI.muted)}>{subtitle}</p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {actions}
            <Link href="/admin-produit/community" className="text-teal">
              Hub Community
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-6 p-6">{children}</main>
    </div>
  );
}
