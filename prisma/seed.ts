import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedExerciseCatalog } from "./seed-exercises";

const prisma = new PrismaClient();

async function main() {
  await prisma.exerciseAttempt.deleteMany();
  await prisma.professionalAlert.deleteMany();
  await prisma.patientExercise.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.theme.deleteMany();
  await prisma.autonomyScale.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.clinicalNote.deleteMany();
  await prisma.caregiverAction.deleteMany();
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

  const passwordHash = await bcrypt.hash("demo1234", 8);

  const establishment = await prisma.establishment.create({
    data: { name: "Centre de rééducation Val-de-Marne" },
  });

  await prisma.establishment.create({
    data: { name: "Centre Loire (cloisonné — aucune donnée croisée)" },
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

  await prisma.user.create({
    data: {
      email: "admin@procheplus.demo",
      firstName: "Claire",
      lastName: "Moreau",
      passwordHash,
      onboardingDone: true,
      professional: {
        create: {
          role: "admin_etablissement",
          establishmentId: establishment.id,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "fondateur@procheplus.demo",
      firstName: "Alex",
      lastName: "Fondateur",
      passwordHash,
      onboardingDone: true,
      isPlatformAdmin: true,
    },
  });

  const caregiverUser = await prisma.user.create({
    data: {
      email: "jean.martin@demo.fr",
      phone: "+33612345678",
      firstName: "Jean",
      lastName: "Martin",
      passwordHash,
      onboardingDone: true,
      caregiver: { create: { status: "actif" } },
    },
    include: { caregiver: true },
  });

  const invitedUser = await prisma.user.create({
    data: {
      email: "invite@demo.fr",
      firstName: "Paul",
      lastName: "Bernard",
      passwordHash,
      onboardingDone: false,
      caregiver: { create: { status: "invite" } },
    },
    include: { caregiver: true },
  });

  const patient = await prisma.patient.create({
    data: {
      firstName: "Marie",
      lastName: "Martin",
      autonomyLevel: "semi_autonome_eleve",
      girLevel: 4,
      establishmentId: establishment.id,
    },
  });

  const patientSansTx = await prisma.patient.create({
    data: {
      firstName: "Henri",
      lastName: "Bernard",
      autonomyLevel: "semi_autonome_faible",
      girLevel: 5,
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

  await prisma.patientCaregiver.create({
    data: {
      patientId: patientSansTx.id,
      caregiverId: invitedUser.caregiver!.id,
      relationship: "fils",
      isPrimary: true,
    },
  });

  const objective = await prisma.educationalObjective.create({
    data: {
      patientId: patient.id,
      skill: "transfert",
      status: "en_cours",
      instructions:
        "1) Dites « Glissez un peu vers l’avant ».\n2) Attendez qu’il bouge.\n3) Si besoin, guidez le bassin d’une main sans tirer les bras.\n4) Félicitez le moindre effort.",
      nextStep:
        "Aider votre proche à se repositionner dans le fauteuil — sans le soulever à sa place",
      isCurrent: true,
    },
  });

  const visit = await prisma.visit.create({
    data: {
      patientId: patient.id,
      date: new Date(),
      professionals: {
        create: { professionalId: proUser.professional!.id },
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
            theme: "fauteuil",
            content:
              "Le but : qu’il bouge un peu tout seul dans le fauteuil. Vous guidez avec la voix d’abord, les mains ensuite — et seulement si besoin.",
          },
          {
            section: "a_essayer",
            theme: "fauteuil",
            content:
              "Une fois pendant la visite : demandez-lui de glisser les fesses vers l’avant du fauteuil. Phrase : « Glissez un peu vers moi ». Comptez jusqu’à 5 avant d’aider.",
          },
          {
            section: "a_eviter",
            theme: "fauteuil",
            content:
              "Ne le tirez pas par les bras ou les aisselles. Ne le soulevez pas d’un coup pour le « remettre droit ».",
          },
          {
            section: "a_revoir_ensemble",
            theme: "transfert",
            content:
              "Si ça bloque ou si vous avez peur qu’il glisse : arrêtez, mettez le frein du fauteuil, et reparlez-en avec l’équipe.",
          },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      caregiverId: caregiverUser.caregiver!.id,
      professionalId: proUser.professional!.id,
      text: "Puis-je l'aider à se lever si le kiné n'est pas dans la chambre ?",
      status: "en_attente",
    },
  });

  await prisma.clinicalNote.create({
    data: {
      professionalId: proUser.professional!.id,
      patientId: patient.id,
      content:
        "Observation clinique interne : vigilance posturale — jamais visible côté famille.",
    },
  });

  await prisma.resource.createMany({
    data: [
      {
        category: "Transfert",
        title: "Comment aider mon proche à se lever ?",
        content:
          "Placez-vous face à lui, donnez une consigne courte, attendez qu'il initie le mouvement.",
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

  const { idByKey } = await seedExerciseCatalog(prisma);

  // Marie (niveau C) : parcours Fauteuil C1 activé pour la démo aidant
  const fauteuilC1 = idByKey.get("fauteuil-C1");
  if (fauteuilC1) {
    await prisma.patientExercise.create({
      data: {
        patientId: patient.id,
        exerciseId: fauteuilC1,
        currentStatus: "actif",
        activatedById: proUser.professional!.id,
        activatedAt: new Date(),
        isCurrent: true,
      },
    });
  }

  console.log("Seed OK");
  console.log("  Aidant: jean.martin@demo.fr / demo1234");
  console.log("  Pro: pro@procheplus.demo / demo1234");
  console.log("  Admin établissement: admin@procheplus.demo / demo1234");
  console.log("  Admin produit: fondateur@procheplus.demo / demo1234");
  console.log(`  Transmission: ${transmission.id}`);
  console.log("  Exercice actif démo: Fauteuil / C / Faire un demi-tour");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
