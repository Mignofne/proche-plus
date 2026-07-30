import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      professional: { include: { establishment: true } },
      caregiver: {
        include: {
          patients: {
            include: {
              patient: {
                include: {
                  objectives: { where: { isCurrent: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    largeText: user.largeText,
    soberMode: user.soberMode,
    onboardingDone: user.onboardingDone,
    role: session.role,
    professional: user.professional,
    caregiver: user.caregiver,
  });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await request.json();
  const data: Record<string, boolean> = {};

  if (typeof body.largeText === "boolean") data.largeText = body.largeText;
  if (typeof body.soberMode === "boolean") data.soberMode = body.soberMode;
  if (typeof body.onboardingDone === "boolean")
    data.onboardingDone = body.onboardingDone;

  const user = await prisma.user.update({
    where: { id: session.userId },
    data,
  });

  return NextResponse.json({
    largeText: user.largeText,
    soberMode: user.soberMode,
    onboardingDone: user.onboardingDone,
  });
}
