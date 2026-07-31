/**
 * Sync Brevo (AD-6). No-op gracieux si BREVO_API_KEY absente (dev).
 * Utilise l’API REST Contacts (SDK v6 surface différente).
 */

export type BrevoSyncResult =
  | { ok: true; skipped?: boolean; contactId?: string }
  | { ok: false; error: string };

export async function syncNewsletterContact(params: {
  email: string;
  firstName: string;
  attributes?: Record<string, string>;
}): Promise<BrevoSyncResult> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.info(
      "[community/brevo] BREVO_API_KEY absente — sync newsletter ignorée (dev)."
    );
    return { ok: true, skipped: true };
  }

  try {
    const listId = process.env.BREVO_NEWSLETTER_LIST_ID;
    const body: Record<string, unknown> = {
      email: params.email,
      updateEnabled: true,
      attributes: {
        PRENOM: params.firstName,
        SOURCE: "procheplus-beta-landing",
        CONSENT_NEWSLETTER: "true",
        ...params.attributes,
      },
    };
    if (listId) {
      body.listIds = [Number(listId)];
    }

    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok && res.status !== 204) {
      const text = await res.text();
      // 400 duplicate sometimes — treat update as soft ok if already exists
      if (res.status === 400 && /already|duplicate|exist/i.test(text)) {
        return { ok: true };
      }
      console.error("[community/brevo] sync failed:", res.status, text);
      return { ok: false, error: `Brevo HTTP ${res.status}` };
    }

    let contactId = "";
    try {
      const json = (await res.json()) as { id?: string | number };
      contactId = String(json.id ?? "");
    } catch {
      /* 204 */
    }
    return { ok: true, contactId };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erreur sync Brevo inconnue";
    console.error("[community/brevo] sync failed:", message);
    return { ok: false, error: message };
  }
}
