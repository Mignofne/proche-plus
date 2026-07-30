import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, homePathForRole, type AppRole } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email et mot de passe requis" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { professional: true, caregiver: true },
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

  return NextResponse.json({
    role,
    redirectTo: homePathForRole(role),
    onboardingDone: user.onboardingDone,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
}
