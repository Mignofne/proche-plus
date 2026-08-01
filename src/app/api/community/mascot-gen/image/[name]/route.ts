import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import { tmpImagePath } from "@/lib/community/mascot-gen/image-store";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * Sert une image générée stockée sous /tmp (ou .data) quand Blob est absent.
 * Réservé admin_produit (fondateur).
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ name: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "admin_produit") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { name } = await ctx.params;
  const safe = name.replace(/[^a-zA-Z0-9._-]/g, "");
  if (!safe || safe !== name) {
    return NextResponse.json({ error: "Nom invalide" }, { status: 400 });
  }

  const match = safe.match(/^(.+)\.(png|jpg|jpeg|webp)$/i);
  if (!match) {
    return NextResponse.json({ error: "Extension invalide" }, { status: 400 });
  }
  const sceneId = match[1];
  const ext = match[2].toLowerCase();
  const mime =
    ext === "jpg" || ext === "jpeg"
      ? "image/jpeg"
      : ext === "webp"
        ? "image/webp"
        : "image/png";

  try {
    const bytes = await readFile(tmpImagePath(sceneId, ext === "jpeg" ? "jpg" : ext));
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Image introuvable" }, { status: 404 });
  }
}
