import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, homePathForRole, type AppRole } from "@/lib/auth";

const BCRYPT_ROUNDS = 8;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: String(email).trim().toLowerCase() },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        passwordHash: true,
        onboardingDone: true,
        isPlatformAdmin: true,
        professional: { select: { role: true } },
        caregiver: {
          select: {
            id: true,
            _count: { select: { patients: true } },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    // Migrate older cost-10 hashes to 8 without blocking the response.
    if (bcrypt.getRounds(user.passwordHash) > BCRYPT_ROUNDS) {
      void (async () => {
        const nextHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
        await prisma.user.update({
          where: { id: user.id },
          data: { passwordHash: nextHash },
        });
      })().catch(() => undefined);
    }

    let role: AppRole | null = null;
    if (user.isPlatformAdmin) {
      role = "admin_produit";
    } else if (user.professional?.role === "admin_etablissement") {
      role = "admin_etablissement";
    } else if (user.professional) {
      role = "professional";
    } else if (user.caregiver) {
      role = "caregiver";
    }

    if (!role) {
      return NextResponse.json({ error: "Compte invalide" }, { status: 403 });
    }

    await createSession({ userId: user.id, role });

    const needsOnboarding =
      role === "caregiver" &&
      (!user.onboardingDone ||
        !user.caregiver ||
        user.caregiver._count.patients === 0);

    return NextResponse.json({
      role,
      redirectTo: needsOnboarding
        ? "/aidant/onboarding"
        : homePathForRole(role),
      onboardingDone: user.onboardingDone,
      needsOnboarding,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json(
      { error: "Connexion temporairement indisponible. Réessaie." },
      { status: 500 }
    );
  }
}
