import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.clinicalNote.deleteMany();
  await prisma.comprehensionCheck.deleteMany();
  await prisma.caregiverFeedback.deleteMany();
  await prisma.transmissionMessage.deleteMany();
  await prisma.transmission.deleteMany();
  await prisma.visitProfessional.deleteMany();
  await prisma.visit.deleteMany();
  await prisma.question.deleteMany();
  await prisma.educationalObjective.deleteMany();
  await prisma.patientCaregiver.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.caregiver.deleteMany();
  await prisma.professional.deleteMany();
  await prisma.user.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.establishment.deleteMany();

  const passwordHash = await bcrypt.hash("demo1234", 10);

  const establishment = await prisma.establishment.create({
    data: {
      name: "Centre de rééducation Val-de-Marne",
    },
  });

  const proUser = await prisma.user.create({
    data: {
      email: "pro@procheplus.demo",
      firstName: "Sophie",
      lastName: "Durand",
      passwordHash,
      onboardingDone: true,
      professional: {
        create: {
          role: "ergotherapeute",
          establishmentId: establishment.id,
        },
      },
    },
    include: { professional: true },
  });

  const caregiverUser = await prisma.user.create({
    data: {
      email: "jean.martin@demo.fr",
      phone: "+33612345678",
      firstName: "Jean",
      lastName: "Martin",
      passwordHash,
      onboardingDone: false,
      caregiver: {
        create: { status: "actif" },
      },
    },
    include: { caregiver: true },
  });

  const patient = await prisma.patient.create({
    data: {
      firstName: "Marie",
      lastName: "Martin",
      autonomyLevel: "semi_autonome_eleve",
      establishmentId: establishment.id,
    },
  });

  await prisma.patientCaregiver.create({
    data: {
      patientId: patient.id,
      caregiverId: caregiverUser.caregiver!.id,
      relationship: "conjoint",
      isPrimary: true,
    },
  });

  const objective = await prisma.educationalObjective.create({
    data: {
      patientId: patient.id,
      skill: "transfert",
      status: "en_cours",
      instructions:
        "Lors du transfert, donnez votre consigne puis attendez que votre proche initie le mouvement.",
      nextStep: "Participer davantage au repositionnement lors de la prochaine visite",
      isCurrent: true,
    },
  });

  const visit = await prisma.visit.create({
    data: {
      patientId: patient.id,
      date: new Date(),
      professionals: {
        create: {
          professionalId: proUser.professional!.id,
        },
      },
    },
  });

  const transmission = await prisma.transmission.create({
    data: {
      visitId: visit.id,
      objectiveId: objective.id,
      professionalId: proUser.professional!.id,
      messages: {
        create: [
          {
            section: "a_retenir",
            content:
              "Laissez votre proche commencer le mouvement avant de l'aider.",
          },
          {
            section: "a_essayer",
            content:
              "Lors du prochain transfert, donnez votre consigne puis attendez.",
          },
          {
            section: "a_eviter",
            content: "Ne tirez pas votre proche par le bras.",
          },
          {
            section: "a_revoir_ensemble",
            content: "Le moment où vous devez intervenir.",
          },
        ],
      },
    },
  });

  await prisma.clinicalNote.create({
    data: {
      professionalId: proUser.professional!.id,
      patientId: patient.id,
      content:
        "Observation clinique interne : vigilance posturale à maintenir, non partagée avec la famille.",
    },
  });

  await prisma.resource.createMany({
    data: [
      {
        category: "Transfert",
        title: "Comment aider mon proche à se lever ?",
        content:
          "Placez-vous face à lui, donnez une consigne courte, attendez qu'il initie le mouvement avant d'assister légèrement.",
      },
      {
        category: "Mobilité",
        title: "Encourager le changement de position",
        content:
          "Proposez un changement de position en expliquant pourquoi, laissez-le participer au geste.",
      },
      {
        category: "Sécurité",
        title: "Prévenir les chutes",
        content:
          "Vérifiez le chemin, retirez les obstacles, utilisez les aides techniques prescrites.",
      },
    ],
  });

  console.log("Seed OK");
  console.log("  Pro: pro@procheplus.demo / demo1234");
  console.log("  Aidant: jean.martin@demo.fr / demo1234");
  console.log(`  Transmission: ${transmission.id}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
