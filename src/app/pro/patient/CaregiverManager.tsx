"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { deleteCaregiverLink, upsertCaregiver } from "@/app/pro/actions";

type LinkRow = {
  id: string;
  relationship: string;
  caregiver: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string | null;
      phone: string | null;
    };
  };
};

export function CaregiverManager({
  patientId,
  links,
}: {
  patientId: string;
  links: LinkRow[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("conjoint");
  const [pending, startTransition] = useTransition();

  function startCreate() {
    setEditingId("new");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setRelationship("conjoint");
  }

  function startEdit(link: LinkRow) {
    setEditingId(link.id);
    setFirstName(link.caregiver.user.firstName);
    setLastName(link.caregiver.user.lastName);
    setEmail(link.caregiver.user.email ?? "");
    setPhone(link.caregiver.user.phone ?? "");
    setRelationship(link.relationship);
  }

  function save() {
    startTransition(async () => {
      await upsertCaregiver({
        patientId,
        caregiverLinkId: editingId === "new" ? undefined : editingId ?? undefined,
        firstName,
        lastName,
        email,
        phone,
        relationship,
      });
      setEditingId(null);
      router.refresh();
    });
  }

  function remove(linkId: string) {
    if (!confirm("Retirer cet aidant du patient ?")) return;
    startTransition(async () => {
      await deleteCaregiverLink(linkId, patientId);
      router.refresh();
    });
  }

  return (
    <Card className="mt-6">
      <div className="flex items-center justify-between gap-3">
        <SectionTitle>Aidants</SectionTitle>
        <Button size="sm" variant="secondary" onClick={startCreate}>
          Ajouter
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <div
            key={link.id}
            className="flex flex-col gap-2 rounded-xl border border-cream-dark bg-cream p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">
                {link.caregiver.user.firstName} {link.caregiver.user.lastName}
              </p>
              <p className="text-sm text-text-muted">
                {link.relationship} · {link.caregiver.user.email}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => startEdit(link)}>
                Modifier
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => remove(link.id)}
                disabled={pending}
              >
                Retirer
              </Button>
            </div>
          </div>
        ))}
        {!links.length && (
          <p className="text-sm text-text-muted">Aucun aidant lié.</p>
        )}
      </div>

      {editingId && (
        <div className="mt-4 space-y-3 rounded-xl border border-teal/30 bg-white p-4">
          <p className="font-semibold text-teal-dark">
            {editingId === "new" ? "Nouvel aidant" : "Modifier l'aidant"}
          </p>
          <input
            placeholder="Prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-xl border border-cream-dark px-4 py-3"
          />
          <input
            placeholder="Nom"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-xl border border-cream-dark px-4 py-3"
          />
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-cream-dark px-4 py-3"
          />
          <input
            placeholder="Téléphone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-cream-dark px-4 py-3"
          />
          <input
            placeholder="Lien (conjoint, fille…)"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="w-full rounded-xl border border-cream-dark px-4 py-3"
          />
          <div className="flex gap-2">
            <Button onClick={save} disabled={pending || !email.trim()} fullWidth>
              Enregistrer
            </Button>
            <Button variant="ghost" onClick={() => setEditingId(null)} fullWidth>
              Annuler
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
