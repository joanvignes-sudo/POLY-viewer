# POLY — Convergence et reprise nocturne, 28 octobre 2026

Développement local sur `feat/regional-body-bridge-20261028`. Aucun push, fusion ou déploiement. Les données source restent préservées.

## Les quatre raccordements logiciels annoncés

| Travail | Résultat exécuté et testé |
|---|---|
| Sélection spatiale, cadrage et retour | Toucher/clic sur les triangles visibles ; identité source exacte ; cadrage de la surface inspectée et retour au cadrage précédent ; les glissements/pincements ne sélectionnent pas volontairement une nouvelle pièce |
| Déformations des résidents musculaires/osseux | Mode source distinct du placement illustratif ; recette historique de placement, calibration par proxies et déformations de tronc, membres et os réutilisées ; phase et lecture de marche, repos et restauration des coordonnées source |
| Parcours nerveux dans un repère compatible | Lecture manuelle et courbe de l'étape choisie uniquement avec la pièce chargée et le mode illustratif ; déformation commune aux surfaces et courbes ; retrait/libération au changement de fiche, de mode ou de contexte |
| Accès commun conservant l'existant | `anatomy.html` propose léger, HRA régional, références par pièces et corps historique ; aucune géométrie au chargement de cette page ; liens ajoutés aux parcours concernés |

Les sauvegardes locales reprennent maintenant groupes, focus et phase illustrative après contrôle de source ; aucun maillage ni tracé nerveux n'est rechargé automatiquement à l'ouverture. Les commandes d'anciens groupes deviennent inertes et ne capturent plus les tableaux géométriques des anciennes pièces.

## Liste initiale : état réel

| Priorité | État logiciel | Qualification ou périmètre restant |
|---|---|---|
| Audit rendu/sélection/mémoire | Réalisé et étendu sur les parcours raccordés | Compléter la matrice des fonctions historiques encore distinctes pendant les reprises nocturnes |
| Interface lecteur 13 blocs / fonctions historiques | Adaptateur et parcours régional fonctionnels | Le corps historique demeure un parcours disponible ; son remplacement automatique n'est pas effectué |
| Identités, coordonnées, références | Conservation et contrôles source en place | Aucun recalage individuel entre bibliothèques n'est établi |
| Libération/récupération WebGL | Corps, atlas, références, groupes et courbes testés | Restitution de mémoire physique et comportement du pilote à mesurer sur appareils |
| Recherche, inspection, tactile | Raccordés aux parcours régionaux et par pièces | Étendre les interactions selon les écarts concrets relevés, sans déplacer arbitrairement les modèles indépendants |
| Marche et déformations | Rig historique, sampler et transformations de référence raccordés | Illustration graphique ; aucune validation biomécanique individuelle |
| Une structure / groupe local | HRA et groupes muscle–os vérifiés, budget combiné 4 Mio, maximum 16 pièces | Ajouter d'autres groupes seulement avec dépendances explicites et budget qualifié |
| Performance et limites | Budgets, compteurs et essais serveur documentés | Téléphone physique : CPU/GPU, fréquence d'images, batterie, température |

## Tests et preuve

- **101 tests Node : PASS ; 21 tests Python : PASS.**
- **11 suites navigateur disposent de résultats réussis** sur les composants actuels. Les neuf suites historiques/HRA sont passées lors de la passe séquentielle ; les deux suites de référence ont été répétées après les dernières modifications de leur parcours.
- Le nouveau parcours d'interactions a réussi trois exécutions consécutives après ajout du diagnostic de disponibilité. Un échec intermédiaire de rechargement a été conservé : voir limite ci-dessous.
- Tests nouveaux : vrais triangles sélectionnés au pointeur/toucher, focus/retour et sauvegarde de focus, phase/restauration source, courbe illustrative compatible, sauvegarde de phase, pause d'animation en page masquée, perte de contexte d'un groupe, données de marche altérées refusées.
- Tests du catalogue : manifeste absent puis reprise, transfert de métadonnées volontairement bloqué puis réellement annulé et relancé sans WebGL.
- Essai du vrai serveur sans interception : biceps et radius, deux surfaces, une courbe, 726 000 octets de blocs source et 76 572 octets de buffers d'affichage des surfaces en mode posture. Le compteur d'affichage des surfaces exclut les petits buffers de la courbe, les métadonnées, les temporaires, les objets et la mémoire GPU physique.

## Limite de démarrage à investiguer

Une exécution consolidée a dépassé 45 secondes en attendant l'affichage du catalogue après un rechargement. La cause n'a pas été établie. Les passages suivants réussis ne prouvent pas sa correction. Le diagnostic du test identifie maintenant l'étape de démarrage et les refus explicites. L'interface permet d'annuler et relancer le catalogue ; cette relance est testée contre un transfert délibérément bloqué. Les reprises nocturnes doivent rechercher une reproduction et la cause, plutôt que masquer le problème par des retries silencieux.

## Travail nocturne autorisé

Relances horaires de ce chat actives jusqu'au **29 octobre 2026 à 08:00 Europe/Paris**. Checkpoint court : `work/POLY_NUIT_REPRISE.json` dans le dossier du chat. À poursuivre sans refaire les opérations closes : diagnostic du délai intermittent, audit des écarts historiques, performances et allocations des groupes les plus lourds permis, interactions/états encore manquants et tests pertinents.

Les mesures sur téléphone physique, les insertions individuelles et les validations expérimentales absentes ne peuvent pas être déclarées acquises par ces tests. La diffusion et la publication exigent toujours l'accord explicite de l'utilisateur.

Une autre passe de la suite de référence a été interrompue alors qu’elle ne produisait plus de résultat. Les attentes des requêtes de test détenues par une fixture sont maintenant bornées à 15 secondes avec diagnostic ; la passe suivante a réussi. Cette interruption ne sert pas de preuve de réussite ni de preuve de correction du démarrage.


## Reprise nocturne 1 — démarrage et CPU

Garde de chargement de 30 secondes avec annulation réelle, diagnostic par étape et relance volontaire ; la cause du délai intermittent historique reste non établie. Huit rechargements bureau/mobile émulé sont passés. Écriture des positions du tronc optimisée avec résultats float32 identiques octet par octet : médiane CPU locale 46.354 → 10.217 ms, soit 4.54× sur cette seule opération. Les normales, le rendu complet et le téléphone ne sont pas mesurés par ce benchmark. 106 tests Node et les trois suites navigateur ciblées passent ; les autres résultats antérieurs ne sont pas déclarés réexécutés. Détails et reproduction dans `BODY_NIGHT_01_2026-10-28.md`.


## Reprise nocturne 2 — navigation HRA et matrice des écarts

Six orientations, retour de cadrage borné et atténuation graphique volontaire au repos HRA sont raccordés. Les matériaux sont restaurés après chaque rendu ; cache et historique ne gardent pas de ressources de scène. 111 tests Node et sept suites navigateur HRA passent. La matrice `BODY_FEATURE_PARITY_2026-10-28.md` explicite les fonctions encore partielles ou historiques (activités/journal, chaînes génériques, pilotes et ateliers distincts). Le détail et les limites figurent dans `BODY_NIGHT_02_2026-10-28.md`. Aucun progrès de qualification physique ou de résolution de la cause du délai intermittent n’est revendiqué.


## Reprise nocturne 3 — journal déclaré autonome

Le journal 24 h dispose d’un parcours sans maillage, compatible avec la clé et le schéma historiques. Brouillons explicites, copies précédentes avant remplacement, refus des versions concurrentes détectées, imports/exports et conservation des champs inconnus et heures fractionnaires sont testés. Le résumé connu est reconstruit à l’export ; aucun effet biologique ni mouvement d’avatar n’est déduit. Les vérifications de stockage ne constituent pas une transaction entre pages. 121 tests Node et les suites navigateur journal/régional/références passent. Détails et limites dans `BODY_NIGHT_03_2026-10-28.md` ; les autres postures et modèles restent distincts.


## Reprise nocturne 4 — postures historiques communes

Course, assis, allongé et geste de repas sont disponibles manuellement dans le HRA régional. Un évaluateur commun remplace les formules privées du corps classique, avec 28 sorties de référence capturées dans son ancien commit. La fenêtre 0–6 s reste graphique ; aucun lien implicite avec le journal ou une horloge biologique. Picking déformé, cadrage/retour, pause et récupération WebGL sont testés. 124 tests Node et neuf suites navigateur passent. Détails dans `BODY_NIGHT_04_2026-10-29.md` ; le pont générique de chaînes et les autres limites ne sont pas déclarés clos.
