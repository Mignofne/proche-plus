import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CommunityPageShell } from "@/components/community/CommunityPageShell";
import { SurfaceRaised } from "@/components/community/SurfaceRaised";
import { ButtonLink } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/Card";
import {
  createAppVersionAction,
  inviteBetaTesterAction,
  updateBetaTesterStatusAction,
} from "../actions";

export default async function CommunityBetaPage() {
  const [versions, leads, testers, notifications] = await Promise.all([
    prisma.communityAppVersion.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.communityBetaLead.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { consents: true, tester: true },
    }),
    prisma.communityBetaTester.findMany({
      orderBy: { createdAt: "desc" },
      include: { lead: true, appVersion: true },
    }),
    prisma.communityFounderNotification.findMany({
      where: { readAt: null },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <CommunityPageShell
      title="Programme bêta"
      subtitle="Versions Preview, inbox leads, invitations — hors base patients"
    >
      {notifications.length > 0 ? (
        <SurfaceRaised className="border-sun/40 bg-sun/10">
          <SectionTitle>Rappels fondateur</SectionTitle>
          <ul className="mt-2 space-y-1 text-sm">
            {notifications.map((n) => (
              <li key={n.id}>
                <strong>{n.title}</strong> — {n.body}
              </li>
            ))}
          </ul>
        </SurfaceRaised>
      ) : null}

      <SurfaceRaised>
        <SectionTitle>Versions d’app (Vercel Preview)</SectionTitle>
        <p className="mt-2 text-sm text-text-muted">
          Chaque version doit être isolée de la base prod patients (AD-9). Ne
          partagez jamais une Preview branchée sur Neon prod.
        </p>
        <form action={createAppVersionAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            name="label"
            required
            placeholder="Libellé (ex. bêta mars)"
            className="rounded-2xl border border-cream-dark px-4 py-3"
          />
          <input
            name="previewUrl"
            required
            placeholder="https://….vercel.app"
            className="rounded-2xl border border-cream-dark px-4 py-3"
          />
          <input
            name="notes"
            placeholder="Notes internes"
            className="rounded-2xl border border-cream-dark px-4 py-3 sm:col-span-2"
          />
          <button
            type="submit"
            className="touch-target rounded-2xl bg-teal px-6 py-3 font-semibold text-white sm:col-span-2"
          >
            Enregistrer la version
          </button>
        </form>
        <ul className="mt-4 space-y-2 text-sm">
          {versions.length === 0 ? (
            <li className="text-text-muted">
              Aucune version — créez-en une avant d’inviter.
            </li>
          ) : (
            versions.map((v) => (
              <li key={v.id} className="rounded-xl bg-cream px-3 py-2">
                <strong>{v.label}</strong> · {v.type} ·{" "}
                <a className="text-teal underline" href={v.previewUrl} target="_blank" rel="noreferrer">
                  {v.previewUrl}
                </a>
                {v.notes ? <span className="block text-text-muted">{v.notes}</span> : null}
              </li>
            ))
          )}
        </ul>
      </SurfaceRaised>

      <SurfaceRaised>
        <SectionTitle>Inbox candidatures</SectionTitle>
        {leads.length === 0 ? (
          <p className="mt-2 text-sm text-text-muted">
            Les candidatures de{" "}
            <Link className="text-teal underline" href="/beta">
              /beta
            </Link>{" "}
            apparaîtront ici.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {leads.map((lead) => (
              <li key={lead.id} className="rounded-xl border border-cream-dark p-3 text-sm">
                <div className="font-semibold">
                  {lead.firstName} · {lead.email} · {lead.profile}
                </div>
                <div className="text-text-muted">
                  Statut {lead.status}
                  {lead.newsletterOptIn ? " · newsletter oui" : " · newsletter non"}
                </div>
                {lead.motivation ? <p className="mt-1">{lead.motivation}</p> : null}
                {!lead.tester && versions[0] ? (
                  <form action={inviteBetaTesterAction} className="mt-2 flex flex-wrap gap-2">
                    <input type="hidden" name="leadId" value={lead.id} />
                    <select
                      name="appVersionId"
                      className="rounded-xl border border-cream-dark px-3 py-2"
                      defaultValue={versions[0].id}
                    >
                      {versions.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="touch-target rounded-xl bg-sun px-4 py-2 font-semibold"
                    >
                      Inviter
                    </button>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </SurfaceRaised>

      <SurfaceRaised>
        <SectionTitle>Bêta-testeurs</SectionTitle>
        {testers.length === 0 ? (
          <p className="mt-2 text-sm text-text-muted">
            Aucun testeur — invitez depuis l’inbox.
          </p>
        ) : (
          <ul className="mt-3 space-y-3 text-sm">
            {testers.map((t) => (
              <li key={t.id} className="rounded-xl bg-cream p-3">
                <div className="font-semibold">
                  {t.lead.firstName} · {t.status} · {t.appVersion.label}
                </div>
                <a className="text-teal underline" href={t.appVersion.previewUrl}>
                  Lien version
                </a>
                {t.status === "revoque" ? (
                  <p className="mt-1 text-terracotta">
                    Ne plus partager ce lien / invalidez la Preview si besoin.
                  </p>
                ) : null}
                <div className="mt-2 flex gap-2">
                  <form action={updateBetaTesterStatusAction}>
                    <input type="hidden" name="testerId" value={t.id} />
                    <input type="hidden" name="status" value="actif" />
                    <button type="submit" className="rounded-xl bg-teal px-3 py-2 text-white">
                      Actif
                    </button>
                  </form>
                  <form action={updateBetaTesterStatusAction}>
                    <input type="hidden" name="testerId" value={t.id} />
                    <input type="hidden" name="status" value="revoque" />
                    <button type="submit" className="rounded-xl bg-terracotta px-3 py-2 text-white">
                      Révoquer
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SurfaceRaised>

      <ButtonLink href="/beta" variant="ghost" size="sm">
        Ouvrir la landing publique /beta
      </ButtonLink>
    </CommunityPageShell>
  );
}
