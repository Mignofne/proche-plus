export const microcopy = {
  loading: "On accorde les violons, une seconde…",
  transmissionReceived:
    "Message reçu 5 sur 5, comme à la bonne époque du poste à galène",
  objectiveReached:
    "Bravo ! Aujourd'hui, c'était un peu votre 'Champs-Élysées' à vous",
  feedbackDifficult:
    "Pas de souci, même les plus grands ont eu leurs couplets ratés. On regarde ça ensemble.",
  visitReminder:
    "Petit rappel, en douceur — pas de tube à la radio sans un peu de répétition !",
  morningGreeting:
    "Aujourd'hui il fait beau — direction la chambre de votre proche !",
  takeYourTime: "Prenez votre temps, on n'est pas à la seconde près.",
  welcomeBack:
    "Content de vous revoir ! On reprend tranquillement là où on en était.",
  notDoingForThem: "Vous n'êtes pas là pour faire à sa place.",
} as const;

export type MicrocopyKey = keyof typeof microcopy;

export function getMicrocopy(
  key: MicrocopyKey,
  soberMode = false
): string {
  if (soberMode) {
    const sober: Partial<Record<MicrocopyKey, string>> = {
      loading: "Chargement en cours…",
      transmissionReceived: "Message bien reçu.",
      objectiveReached: "Bravo, objectif atteint.",
      feedbackDifficult: "Merci pour votre retour. Nous en parlerons ensemble.",
      visitReminder: "Rappel : une visite est prévue prochainement.",
      morningGreeting: "Bonjour — voici votre accompagnement du jour.",
      takeYourTime: "Prenez votre temps.",
      welcomeBack: "Bon retour.",
      notDoingForThem: "Encouragez votre proche à faire le geste lui-même.",
    };
    return sober[key] ?? microcopy[key];
  }
  return microcopy[key];
}
