# POLY — Postures, activités et journée de 24 heures

Ouvrir la version locale : https://joanvignes-sudo.github.io/POLY-viewer/

## Utilisation

Dans « Vivre et bouger » : Debout, Marcher, Courir, Assis au fauteuil, Allongé au sol ou Manger. La posture assise affiche un fauteuil ; le repas ajoute une table, une assiette et un geste main–bouche ; la position allongée est sur le dos, au niveau du sol. La course possède un cycle illustratif avec une phase aérienne.

« Composer / rejouer 24 heures » ouvre le journal :

- Modifier le titre, les horaires, les activités et les détails des repas. Les heures vont de 00:00 à 24:00.
- Noter un événement vécu, son heure et son contexte : environnement, événement émotionnel, effort ressenti, repas/boisson ou observation libre.
- Utiliser le curseur pour voir l’activité de l’avatar à cette heure, ou lancer la lecture accélérée. La vitesse de lecture du journal est distincte de celle de l’animation.
- Lire les durées cumulées, les repas commencés et les événements déjà survenus. Les périodes non renseignées restent explicitement non renseignées.
- Ajouter une activité dans une période libre, en retirer une, importer ou exporter un journal JSON. Les chevauchements et les horaires invalides sont refusés.

Les modifications du programme sont conservées localement dans ce navigateur. L’export permet de sauvegarder un fichier indépendant. Le programme initial et le fichier data/journee-exemple-fictive.json sont des exemples fictifs modifiables, pas un programme recommandé.

## Évolution réellement calculée

Le journal calcule des temps à partir des intervalles saisis, le nombre de repas commencés et la liste des événements antérieurs à l’heure choisie. La posture suit l’activité déclarée. Les notes de vécu restent des informations enregistrées ; elles ne déclenchent pas une réponse physiologique supposée. Le sommeil est une durée déclarée, sans stades ni récupération calculés.

## Limites scientifiques et visuelles

- Postures et course : déformations géométriques illustratives. Aucun équilibre dynamique, contact, effort articulaire, force musculaire ou recalage individuel n’est résolu. La mise en place du fauteuil et le passage d’une activité à l’autre sont instantanés.
- Course : mouvement procédural distinct de la trajectoire OpenSim de marche. Le repère d’appui règle visuellement la hauteur ; il ne mesure ni ne résout une force au sol.
- Repas : geste de bras à deux segments et accessoires symboliques ; pas d’ingestion effective, déglutition, mastication, digestion, dosage alimentaire ou absorption calculée. L’assiette ne traduit pas la composition nutritionnelle du texte saisi.
- Fatigue, digestion, glycémie, hydratation, récupération et effets émotionnels restent null/non calculés dans les données exportées. Aucun pourcentage de santé ou indicateur physiologique n’est inventé.
- Les chaînes documentaires de marche stable sont masquées pour les autres activités ; elles ne deviennent pas automatiquement des chaînes validées de course, repos ou repas.
- Le rendu, les repères et la sélection partagent la transformation des postures. L’ouverture d’un organe enlève temporairement les accessoires et remet ses structures dans le repère anatomique de référence ; le retour restitue l’activité.

Les 918 structures et les travaux B–I sont préservés. Le référentiel I des délais neuromusculaires reste séparé de cette animation : aucun de ses chiffres ne sert de calibration humaine. Le raccordement physiologique devra être validé progressivement, en commençant par la boucle appui–retour sensoriel–ajustement.

## Vérification

26 assertions du modèle de journée : bornes, durées cumulées, transitions, lacunes, absence de prédictions biologiques, refus des chevauchements et des données invalides.

31 contrôles navigateur : postures, course, geste vers la bouche, pause, exploration d’organe, changement par heure, notes, cumul, édition, import/export, persistance locale et affichage mobile. Aucune erreur navigateur/compilation des shaders ; aucun chargement externe observé. Ces contrôles valident le logiciel et son comportement déclaré, pas la physiologie ou la biomécanique humaine.

Aucune publication, aucune modification de GitHub ou du site public, aucun envoi de journal.
