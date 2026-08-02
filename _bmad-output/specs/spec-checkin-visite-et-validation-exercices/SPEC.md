---
id: SPEC-checkin-visite-et-validation-exercices
companions:
  - checkin-visite.md
  - exercise-publication-statuses.md
  - ../../../docs/project-context.md
sources: []
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Check-in visite (fatigue/douleur) et validation catalogue exercices IA

## Why

**Pain to solve.** Aujourd’hui le mode visite enchaîne proche → thèmes → exercices sans vérifier l’état du proche ; un aidant peut démarrer alors que fatigue ou douleur rendent l’effort inadapté. En parallèle, les brouillons IA du référentiel sont importés comme `publie` avec une « validation » fictive, alors qu’un admin produit doit vraiment les valider avant exposition. Il faut un garde-fou bienveillant côté visite, un historique de visites immédiatement accessible, et une vraie porte de revue côté catalogue.

## Capabilities

- **CAP-1**
  - **intent:** L’aidant peut déclarer, à chaque entrée en mode visite et après sélection du proche (auto si un seul), le niveau de fatigue et de douleur du proche en paliers discrets, avant tout thème ou exercice.
  - **success:** Après choix (ou auto-sélection) du proche, l’écran check-in fatigue + douleur est obligatoire ; thèmes/exercices inaccessibles tant que les deux paliers ne sont pas renseignés.

- **CAP-2**
  - **intent:** Le système peut empêcher la poursuite des exercices de la visite lorsque fatigue **ou** douleur dépasse le seuil (> 5), avec un message bienveillant invitant à revenir pour une prochaine visite.
  - **success:** Si l’un des scores est ≥ 6, aucun thème ni exercice n’est proposé ; l’aidant voit une clôture « à bientôt pour la prochaine visite » et quitte sans outcome d’exercice.

- **CAP-3**
  - **intent:** L’aidant et le professionnel peuvent retrouver le check-in (et le fait que la visite a été stoppée ou poursuivie) dans « Mes dernières visites » et dans la timeline patient / logs côté pro.
  - **success:** Chaque check-in persisté apparaît dans « Mes dernières visites » et comme événement timeline + entrée de log pour le patient concerné.

- **CAP-4**
  - **intent:** L’admin produit peut identifier rapidement les exercices d’origine IA, les filtrer en statut `a_valider`, et les promouvoir explicitement vers `publie` avec horodatage et auteur de validation réels.
  - **success:** Un exercice `a_valider` porte un label IA visible en liste ; l’action « Valider & publier » le passe en `publie` avec `validatedBy` / `validatedAt` renseignés ; sans cette action il n’est jamais visible aidant ni pro.

- **CAP-5**
  - **intent:** L’import du référentiel peut mapper les lignes « Brouillon IA — à valider… » vers `a_valider` (et jamais vers `publie` automatiquement).
  - **success:** Après sync CSV, une ligne « Brouillon IA — à valider… » absente en base est créée en `a_valider` avec provenance IA ; zéro création auto en `publie` pour ce statut CSV.

- **CAP-6**
  - **intent:** L’aidant peut ouvrir « Mes dernières visites » depuis l’accueil dès qu’il est connecté, sans que la transmission déjà lue encombre cet accueil.
  - **success:** Lien « Mes dernières visites » toujours visible sur l’accueil aidant ; le bouton permanent « Dernière transmission » disparaît ; une transmission non lue reste visible uniquement via la carte « Nouveau message » ; une transmission déjà lue reste joignable depuis le détail d’une visite dans l’historique.

## Constraints

- Check-in **à chaque** entrée mode visite (pas de skip « déjà fait aujourd’hui »).
- Placement : **immédiatement après** résolution du proche (picker ou auto-sélection) ; **avant** choix de thème.
- Seuil : fatigue **OU** douleur > 5 (paliers `{0,2,4,6,8,10}` ; déclenchement si ≥ 6) — libellés dans `checkin-visite.md`.
- Blocage **hard** : pas de contournement « continuer quand même ».
- Ton bienveillant, non alarmiste ; pas de jargon médical.
- Accueil aidant : **Mode visite** reste le CTA principal ; « Mes dernières visites » est un accès secondaire **persistant** (jamais enfoui derrière une visite en cours).
- Transmission sur l’accueil : **uniquement si non lue** (carte « Nouveau message ») — retirer le CTA permanent « Dernière transmission ».
- Seul `admin_produit` valide/publie le catalogue ; les pros cliniques n’ont pas ce droit.
- `a_valider` et `brouillon` restent invisibles pour aidant **et** pro (activation patient, mode visite, transitions) ; seul `publie` est consommable.
- `validatedBy` / `validatedAt` ne sont posés que lors d’une validation humaine explicite vers `publie` — jamais par l’import CSV pour les brouillons IA.
- Compatibilité brownfield : étendre `ExercisePublicationStatus` (aujourd’hui `brouillon | publie | archive`) sans casser les flux existants `publie`.

## Non-goals

- Diagnostic médical, scoring clinique, ou recommandation thérapeutique au-delà du stop bienveillant.
- Validation catalogue par les professionnels de terrain / experts APA dans l’app (hors admin produit).
- Génération d’exercices par IA **in-app** (le flux reste CSV/référentiel → import → revue admin).
- Curseur continu 0–10 ou saisie libre numérique pour fatigue/douleur.
- Soft-bypass du blocage (continuer malgré seuil).
- Remplacer Mode visite ou la carte transmission non lue par l’historique sur l’accueil.

## Success signal

Un aidant dont le proche est trop fatigué ou douloureux est stoppé avant tout exercice avec un message « à bientôt », retrouve ce check-in dans « Mes dernières visites » depuis l’accueil, et n’est plus sollicité par un bouton « Dernière transmission » une fois le message lu ; un exercice brouillon IA n’apparaît jamais en mode visite tant qu’un admin produit ne l’a pas validé et publié.

## Assumptions

- Une seule spec couvre check-in visite + statut catalogue + historique accueil (réponses A+B dans le même fil).
- Label IA = provenance stockée sur l’exercice (boolean ou enum), badge admin uniquement.
- Empty state « Mes dernières visites » : message simple + CTA Mode visite (pas de faux historique).
