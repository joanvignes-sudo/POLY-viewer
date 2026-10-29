# POLY — Guide nerf–muscle régional indépendant

29 octobre 2026. Module qualitatif existant raccordé à la véritable référence de main, sans faux pilote nerveux.

## Séparation des dépendances

L’audit distingue `neuromuscular-guide.js`, qui utilise la sélection et les buffers de la main, et `nerve-linked-pilot.js`, qui dépend des itinéraires, mesures documentaires et commandes de `human-nerves.js`. Le premier est maintenant raccordé ; le second reste explicitement historique.

Une fois la main BodyParts3D chargée, un bouton ouvre le guide à la demande. Le même module et les mêmes conditions de culture sont conservés : référence, blocage présynaptique et blocage postsynaptique, avec leurs étapes d’arrêt existantes. La préparation humaine en culture et sa distinction avec un muscle intrinsèque de la main restent visibles dans la section de preuve. Les délais biologiques, emplacement de jonction et force restent `null`.

La lecture est pédagogique et indépendante des itinéraires, de la marche et du journal. Son schéma de fibre est symbolique, sans force transmise à la main. Le repère optionnel au centre d’une surface musculaire reste explicitement distinct d’une plaque motrice localisée ; il est caché en l’absence de centre musculaire connu.

## Source et cycle de vie

Un lecteur borné vérifie l’empreinte de texte, avec seules les fins de ligne Git normalisées. Il est utilisé aussi par le module classique. Le fichier et ses observations ne sont pas modifiés. Une source corrompue est refusée sans retirer la main déjà vérifiée. Les requêtes sont annulables, avec délai explicite de 30 s et aucune relance automatique.

Le module possède désormais une pause et une destruction explicites : écouteur de fermeture de la main détaché, panneau/commandes/style retirés, halo retiré et géométrie/matériau détruits, centres numériques effacés. Le lecteur régional détruit le guide avant la référence de main et lors d’une perte WebGL ou d’une sortie ; un rechargement ne duplique pas les commandes. Le masquage suspend la lecture et annule un chargement en cours.

## Vérification

- 136 tests Node réussis ; source LF/CRLF, observations et inconnues conservées, altération et annulation refusées.
- Nouvelle suite navigateur réussie sur ordinateur et émulation mobile : chargement explicitement demandé, trois conditions et étapes terminales exactes, horloge pédagogique, pause au masquage, retrait/rechargement et refus d’un guide altéré avec main conservée.
- Parcours classique `attachments-browser` réussi après changement du lecteur source partagé. La régression main est consignée dans le checkpoint.
- Premiers essais de la nouvelle suite corrigés : ouverture nécessaire de la section de preuve avant lecture visible ; suppression d’une tentative de sélection d’os dans une liste réservée aux muscles. Aucun défaut anatomique n’a été masqué pour faire passer ces assertions.
- Un essai a également expiré après 45 s en attendant l’affichage initial du laboratoire, avant utilisation du guide. Journal conservé dans `work/regional-neuromuscular-browser-validated.log`. Diagnostic des requêtes en attente ajouté pour les incidents suivants. Exécution isolée ultérieure réussie dans `work/regional-neuromuscular-browser-isolated.log` : cela ne prouve pas que la cause du délai est corrigée.

Le pilote nerveux global, les ateliers osseux et les recalages restent des chantiers distincts. Aucune insertion, plaque motrice, latence, activation ou force n’est inventée pour leur substituer un adaptateur. Aucune mesure de téléphone physique ni validation biologique n’est produite.

Régression main : les deux cas ordinateur/mobile ont atteint leur fin ; le cas final d’annulation a expiré après 30 s au démarrage, avant demande de main. Journal `work/neuromuscular-hand-regression.log` conservé. La suite complète n’est donc pas annoncée réussie sur cette reprise.
