# POLY — Suite régionale : vues, budgets et références par pièces

28 octobre 2026. Branche locale `feat/regional-body-bridge-20261028`, suite de `b7a7d9c`. Base préservée : PR #21, `59d7571ca780f74dcfa9b261b13515f5f49ffb59`.

## Fait

Le parcours régional réutilise désormais l'inspecteur détaillé, les relations documentaires de marche, la consultation native de l'œil droit, l'illustration lumineuse et sa lecture P1, CerebrA et la référence de main. Les références restent distinctes : aucune identité HRA n'est attribuée aux surfaces d'une autre bibliothèque.

Un second banc local affiche une pièce des membres ou du tronc à partir d'un bloc vérifié, sans charger le fichier JSON monolithique d'environ 93 Mo. Il dispose d'un catalogue séparé et ne crée pas de contexte WebGL avant la sélection d'une pièce.

Aucun push, aucune PR supplémentaire, aucune fusion et aucune publication. Les générateurs écrivent dans des dossiers de travail extérieurs au site. Le serveur est limité à `127.0.0.1`.

## Références et budgets distincts

| Parcours | Source conservée | Chargement et limite logicielle |
|---|---|---|
| Corps HRA régional | 918 identités, 13 blocs d'origine | Cache d'octets bruts borné ; identité, positions, normales et indices source inchangés |
| Consultation de l'œil droit | Cornée 358, cristallin 350, rétine 336 du même atlas | Présence et contexte requis ; aucune chronologie physiologique |
| Illustration lumineuse et P1 | Tracé graphique et contrat documentaire existants | Matériaux restaurés, sessions libérables, sauvegardes compatibles conservées |
| CerebrA | 17 surfaces du repère MNI152NLin2009cSym | À la demande ; 10 707 096 octets de buffers CPU propres ; budget 12 Mio par défaut, 8 Mio refusés avant téléchargement géométrique |
| Main BodyParts3D | 76 pièces, 39 589 sommets dans la source | À la demande ; borne conservatrice de buffers géométriques 3 401 772 octets ; budget 4 Mio ; namespace `hand:` |
| Référence membres/tronc | 458 surfaces musculaires et 68 os du fichier existant | Catalogue puis un seul bloc source résident de 4 Mio maximum ; une seule pièce affichée |

Les budgets ci-dessus ne sont **pas des limites de RAM totale ou de mémoire GPU physique**. Ils excluent notamment le catalogue interprété, les tableaux JSON, les objets du moteur, certains buffers transitoires, les copies d'affichage et les allocations du navigateur/pilote. Ils s'appliquent à une page, pas à l'ensemble des onglets.

## Corrections de rendu et de cycle de vie

### Une seule instance de Three.js par scène

Le raccord précédent mélangeait l'URL du moteur sans paramètre et celle utilisée par les modules historiques. Cela instancie deux fois le module, avec des compteurs d'identifiants indépendants. Le moteur indexe certaines ressources par identifiant numérique : deux géométries différentes peuvent alors entrer en collision.

Le laboratoire utilise maintenant la même URL que les composants historiques. Un audit distingue les géométries réellement partagées des objets différents portant le même identifiant. Les tests vérifient l'unicité du moteur chargé et des identifiants dans les scènes. La vue lumineuse initialise bien ses objets distincts et les compteurs/libérations ont été requalifiés après cette correction ; les anciens compteurs seuls n'offraient pas cette garantie.

La boucle de rendu vérifie aussi la perte réelle du contexte et ne réémet pas une erreur de compilation survenue pendant une perte de contexte. Les autres erreurs ne sont pas masquées. Les commandes de fermeture de la vue lumineuse restent accessibles dans une barre interne fixe lors du défilement de P1.

### Apparence conservée par identité et génération

`body-source-material-session.mjs` conserve uniquement les identifiants source, UUID de génération du matériau et valeurs d'apparence. Il ne conserve pas les Mesh ou Material. Il ne restaure jamais une ancienne apparence sur un nouveau matériau créé après rechargement de la même pièce.

Les captures sont atomiques, les surfaces absentes sont ignorées à la restauration et les états sont libérés. Une apparence déjà appliquée ne déclenche plus `needsUpdate` à chaque image : cela évite une invalidation répétée des shaders. Les overlays documentaires masqués ne recalculent plus leurs courbes de rendu inutilement.

### Illustration de l'œil et P1

`eye-light.js` résout les trois surfaces requises parmi les résidents. Il ferme la session si la portée ou la génération des pièces change, libère ses ressources graphiques et restaure les matériaux restants. Les pauses documentaires reprennent correctement l'animation de présentation après leur sortie.

`p1-eye-controls.mjs` dispose d'une libération explicite, annule une lecture réseau en attente et rend les anciennes commandes inertes. Les checkpoints de `localStorage` ne sont pas effacés : une reprise exige toujours le même contrat. Le temps biologique demeure inconnu ; les phases 0 et 5 désignent des positions du cycle graphique hérité de huit secondes, jamais une latence ou une vitesse de photon. La réfraction et la réponse électrique ne sont pas calculées.

### CerebrA à la demande

Les métadonnées et le binaire sont vérifiés avant la construction. Le plan de buffers tient compte du binaire retenu par les indices, des positions de base, de la copie d'affichage et des normales. La mesure des ArrayBuffer retenus correspond au plan de 10 707 096 octets ; elle ne mesure pas la RAM complète.

Le composant historique ne retient plus les maillages cérébraux HRA : les masques sont résolus par identifiant/génération. L'éviction et le rechargement HRA, le changement de référence, la fermeture et la perte de contexte restaurent ou libèrent correctement les ressources. Le cortex, les sélections et l'écartement graphique des hémisphères sont conservés. Ce dernier reste une manipulation d'exploration, pas une déformation physiologique.

CerebrA demeure une référence distincte, placée graphiquement dans la scène HRA sans recalage individuel. Les coordonnées MNI et citations du fichier ne sont pas transformées en observations d'un participant.

### Main indépendante du pilote nerveux

Le composant de main conserve ses côtés, filtres, sources et qualifications des attaches. Dans le laboratoire, il peut fonctionner sans pilote nerveux : aucun état neuronal artificiel n'est créé pour satisfaire une dépendance logicielle. Les commandes nécessitant ce pilote ne sont pas exposées.

La référence est identifiée par `hand:` et reste distincte du HRA. Les observations humaines de population restent présentées comme telles, sans délai affecté à l'avatar ni contraction simulée. La rotation, le zoom tactile et le plafond de résolution pour pointeur grossier sont qualifiés. Le petit renderer possède son propre contexte ; sa perte ne déclenche pas un faux état du contexte principal.

La fermeture libère ce renderer ; le déchargement retire aussi les géométries, matériaux, styles, commandes et écouteurs. Les anciennes commandes ne pilotent pas une nouvelle instance. CerebrA et la référence de main sont mutuellement exclusifs afin de ne pas accumuler implicitement leurs ressources. Cela ne garantit pas une restitution physique immédiate de mémoire par le pilote.

## Référence volumineuse : résultat concret du découpage

Le fichier existant `forearm-motor-reference.json.gz` contient en réalité les références de membres et de tronc : 458 surfaces musculaires et 68 os. Sa taille décompressée est **92 965 454 octets**. Le charger intégralement dans le nouveau parcours mobile annulerait une grande partie du bénéfice du chargement régional.

`build_reference_source_chunks.py` produit donc un format candidat séparé :

- **46 blocs**, sans couper une pièce, supprimer de sommet ou réordonner de triangle ;
- positions en **float64 little-endian**, pour conserver les nombres issus de `JSON.parse` sans les quantifier prématurément en float32 ; indices en uint32 ;
- catalogue décompressé de **1 170 399 octets**, contenant tous les autres champs source, y compris observations, limites, qualifications et licences ;
- **74 469 464 octets** géométriques bruts au total, alignements compris ; plus grand bloc : **4,191,216 octets** ; total gzip des blocs : **31,115,993 octets** ;
- pointeurs JSON, collections et identifiants originaux conservés. Les clés `parts/…` et `bones/…` évitent de confondre ces indices avec ceux du HRA ;
- vérification Python et comparaison indépendante JavaScript de toutes les valeurs IEEE754 et indices des **526 pièces** contre le fichier original.

Les empreintes de l'entrée restent :

```text
gzip : d619f1fcb6f85ec38b11cfe92d86a3460eb0454b35791c11128353b4c619bde4
JSON : 64ec70f74fb6af18333d6f53b46ac736d59331221c54213737a35b26a1c0f81a
```

Ce format n'est pas une promesse de réduire le total de tous les téléchargements : son bénéfice est de pouvoir demander une petite partie et éviter le chargement monolithique. Les fichiers générés restent dans `work/reference-chunks`, hors du dépôt et du site.

`reference-source-reader.mjs` vérifie manifeste, catalogue, empreintes, plages, alignements, identités et indices. Il refuse les builds non vérifiés, les manifestes marqués publiés, les fichiers altérés et un bloc dépassant le budget du demandeur. Les empreintes sont contrôlées relativement au manifeste local maîtrisé : l'authentification d'un manifeste distribué reste à qualifier avant toute diffusion.

`reference-region-lab.html` est utilisable : recherche de catalogue sans WebGL, filtres de collection/côté, lecture d'un seul bloc, affichage d'une seule pièce, rotation/zoom et provenance. La copie float32 d'affichage est explicitement distinguée des nombres float64 source. Le cadrage calculé ne devient pas une coordonnée anatomique individuelle. La page ne reconstruit ni liaisons manquantes ni insertions.

Les transferts abandonnés sont interrompus, les réponses anciennes ne changent pas la sélection récente, et une perte de contexte libère pièce et bloc. Le catalogue peut rester disponible pour une nouvelle sélection. Ce banc ne remplace pas encore tous les contrôles de l'ancien atelier des membres.

## Intégrité des textes et transferts

Un contrôle de portabilité a identifié la différence LF/CRLF des checkouts Git. `source-text-integrity.mjs` normalise seulement les fins de ligne pour vérifier les métadonnées texte, sans réécrire les nombres JSON. Il refuse les modifications de contenu. Les empreintes LF du dépôt sont utilisées pour le réseau documentaire et CerebrA. Les gzip et géométries binaires restent vérifiés octet pour octet sans normalisation.

`bounded-fetch.mjs` borne les réponses déclarées et les octets réellement lus, et annule les flux en attente. La décompression est également bornée. Une opération de calcul déjà engagée peut terminer après annulation ; ses résultats ne sont pas installés après invalidation. Les buffers temporaires restent hors des budgets résidents annoncés.

## Testé sur les sources stabilisées

**80 tests Node, 21 tests Python et 10 suites navigateur : PASS.**

Les suites navigateur finales ont été exécutées séquentiellement :

```text
attachments-browser.cjs
body-startup-browser.cjs
body-light-browser.cjs
body-region-browser.cjs
body-regional-features-browser.cjs
body-regional-specialists-browser.cjs
body-regional-optics-browser.cjs
body-regional-brain-browser.cjs
body-regional-hand-browser.cjs
reference-region-browser.cjs
```

Bureau et mobile tactile émulé sous Chrome/SwiftShader : corps classique, recherche/inspection, récupération, blocs HRA corrompus, annulation, vue native de l'œil, P1/sauvegardes, CerebrA, main gauche/droite, pincement, contextes privés, génération de matériaux, unicité du moteur et des géométries, catalogue partiel, sélection musculaire/osseuse et absence de téléchargement monolithique dans les nouveaux parcours.

Le nouveau lecteur de référence a aussi été testé via le **vrai serveur local, sans interception** : `parts/0`, bloc `reference-045`, 1 111 848 octets de bloc résidents, 54 168 octets de copies d'affichage, une géométrie et DPR 1 dans le format mobile émulé. Une capture locale est fournie dans `POLY-reference-part-mobile.png`.

Les échecs de développement ont conduit à corriger la double instance Three.js, la course de perte de contexte et l'accessibilité du bouton de fermeture P1 pendant le défilement. Des délais d'initialisation ont aussi été observés dans des exécutions intermédiaires en évolution ou en concurrence ; ils ne servent pas de preuve de validation. La pression mémoire et l'exécution simultanée de plusieurs scènes lourdes restent à mesurer. Les compteurs logiciels et une passe finale verte ne constituent pas une garantie matérielle.

Les nouvelles étapes sont ajoutées au workflow existant, mais **aucun run GitHub Actions n'a été déclenché**, puisque rien n'a été envoyé sur GitHub.

## Aperçus locaux

- Corps et vues raccordées : `http://127.0.0.1:8124/simulateur/web/body-region-lab.html`
- Pièces des membres/tronc : `http://127.0.0.1:8124/simulateur/web/reference-region-lab.html`

Recharger l'onglet pour utiliser les nouveaux modules. Le processus d'aperçu est lancé sur la machine locale ; il ne publie pas le site et n'est pas accessible depuis un téléphone distant.

Le serveur conserve deux racines de fichiers générés séparées, avec des chemins autorisés explicites. Pour le relancer depuis le dépôt :

```powershell
python simulateur/scripts/serve_body_region_preview.py --chunks-root ../body-chunks --reference-chunks-root ../reference-chunks --port 8124
```

Pour reproduire depuis des dossiers neufs, les générateurs refusant tout écrasement :

```powershell
python simulateur/scripts/build_body_source_chunks.py --output-root ../body-chunks-fresh --verify
python simulateur/scripts/build_reference_source_chunks.py --output-root ../reference-chunks-fresh --verify
$env:POLY_CHUNKS_ROOT=(Resolve-Path ../body-chunks-fresh).Path
$env:POLY_REFERENCE_CHUNKS_ROOT=(Resolve-Path ../reference-chunks-fresh).Path
node --test simulateur/tests/*.test.mjs
python -m unittest discover -s simulateur/tests -p 'test_*.py'
```

Les tests navigateur nécessitent Playwright et Chrome/Chromium, avec `POLY_BASE_URL` pointant vers un serveur du dépôt. Les fixtures fournissent alors les blocs temporaires. Les reçus JSON des parcours sont conservés dans les outputs de cette conversation.

## Expérimental et restant à faire

1. Le corps historique et son site public ne sont pas remplacés. Le nouvel atelier régional réutilise davantage de vues, mais la convergence complète des interactions de l'ancien workbench reste à terminer.
2. L'ancien atelier complet des membres conserve son chargement monolithique ; le découpage et le lecteur par pièces offrent maintenant un chemin réel pour sa migration. Il faut encore raccorder ses sélections, dépendances osseuses, trajets nerveux et états sauvegardés aux résidents, sans commandes pointant vers des ressources libérées.
3. Le pilote nerveux détaillé n'est pas inventé pour la main régionale. Les correspondances individuelles, insertions, forces, contacts, activations et latences manquantes restent inconnus ou non modélisés.
4. Aucun téléphone physique n'était accessible pour mesurer pic CPU/GPU, fréquence d'images réelle, batterie ou température. L'émulation tactile sur un ordinateur n'est pas cette qualification.
5. Les manifestes sont des artefacts locaux contrôlés. Authentification, conditions de distribution et revue scientifique des libellés restent requises avant une diffusion approuvée. La conservation des données ou un test informatique réussi ne vaut pas validation biologique.

Les travaux précédents, données originales et décisions scientifiques sont conservés. Les inconnues ne sont pas comblées par des coordonnées, causes ou chronologies nouvelles.

## Récupération du code

Le bundle `POLY-suite-regionale-20261028.bundle` contient tous les commits locaux depuis la PR #21, sans les blocs générés. Il nécessite le commit de base `59d7571ca780f74dcfa9b261b13515f5f49ffb59` dans le dépôt de destination.

```powershell
git bundle verify CHEMIN/POLY-suite-regionale-20261028.bundle
git fetch CHEMIN/POLY-suite-regionale-20261028.bundle feat/regional-body-bridge-20261028:feat/regional-body-bridge-20261028
```

Ces commandes ne fusionnent et ne publient rien.

## Suite — fiches, relations osseuses et reprise volontaire

Le lecteur par pièces propose maintenant la fiche documentaire sans créer de contexte WebGL ni demander un bloc géométrique. Tous les champs source de la pièce sont consultables, ainsi que les observations humaines dont l'itinéraire est explicitement lié. Les valeurs nulles et les limites restent visibles.

Les relations osseuses permettent la navigation muscle → os et os → muscle en remplaçant la pièce affichée. La résolution exige la famille osseuse explicitement déclarée et le même côté connu ; aucune correspondance de côté absent ni de nom ressemblant n'est inventée. Le passage controlatéral n'est proposé que par un identifiant source explicite. Les anciennes commandes documentaires deviennent inertes après changement de fiche ou libération.

La mémorisation locale conserve uniquement l'identifiant source, l'empreinte du JSON et trois paramètres bornés de caméra. Après rechargement de la page, aucun bloc et aucun contexte WebGL ne sont restaurés automatiquement. Le bouton de reprise valide la même source et une pièce existante ; l'effacement est disponible. Un stockage indisponible n'empêche pas la consultation.

Validation de cette suite : **86 tests Node réussis**, puis suite navigateur de référence répétée après la dernière modification sur bureau et mobile tactile émulé. Elle couvre aussi les fiches sans géométrie, navigation osseuse aller/retour, reprise de caméra après rechargement sans transfert automatique et effacement. Les 21 tests Python et les neuf autres suites navigateur restent ceux de la passe précédente ; leurs sources ne sont pas modifiées par cette suite. Aucun nouveau run distant, push, merge ou déploiement.

## Suite — groupes locaux et parcours nerveux documentaires

Le lecteur peut désormais afficher ensemble un muscle et les os de même côté explicitement associés par les relations du catalogue. `reference-selection.mjs` planifie les blocs uniques avant tout transfert et refuse un ensemble dépassant **4 Mio de blocs décompressés** ou **16 pièces**. Les blocs déjà présents sont réutilisés. Les autres blocs sont lus séquentiellement ; un échec ou une annulation n'installe pas un groupe partiel. La construction des nouvelles géométries précède le retrait des anciennes.

Cette limite est celle des blocs source de la sélection installée : pendant un remplacement, les anciens blocs et les temporaires des nouveaux peuvent coexister. Les copies float32 et les normales d'affichage, le catalogue, les métadonnées nerveuses et la mémoire du pilote restent hors budget. Masquer le contexte osseux ne libère pas ses ressources ; changer de sélection ou libérer le groupe les retire. Les identités de toutes les pièces chargées sont accessibles séparément et la sauvegarde locale conserve aussi les clés du groupe. Les anciennes sauvegardes d'une pièce restent compatibles.

La source nerveuse existante est lue seulement sur demande, avec empreintes gzip et brute vérifiées, plafonds de transfert et décompression : 106 864 octets compressés, 995 357 octets bruts, 575 routes et 458 itinéraires. Les 458 itinéraires ont été résolus contre leurs étapes et références. Le panneau propose une lecture manuelle des étapes avec directions documentaires, provenance, jonctions et limite terminale. Aucun temps de lecture ne devient un délai biologique. Les points dessinés dans le repère HRA ne sont pas superposés aux coordonnées BodyParts3D non recalées de ce lecteur.

Un changement de fiche annule le transfert nerveux et rend les anciennes commandes inertes ; une réponse tardive ne remplace pas la nouvelle fiche. Les observations spécifiques à des pièces exigent à la fois un identifiant de pièce et un chemin autorisé explicites. Les interactions humaines documentées sont consultables avec leur protocole complet et leur côté déclaré ; elles ne deviennent ni une activation ni une inhibition mesurée de la surface affichée. Les filtres comprennent les côtés U/B et les régions non renseignées, sans les réaffecter par défaut à l'avant-bras.

Validation de cette passe : **95 tests Node réussis** et suite navigateur de référence réussie après stabilisation, sur bureau et mobile tactile émulé. Elle ajoute : groupes bornés, consultation des identités chargées, masquage sans fausse libération, reprise volontaire d'un groupe, retrait des géométries de contexte, conservation de la pièce précédente après corruption d'un bloc du groupe, source nerveuse corrompue refusée, transfert nerveux abandonné réellement interrompu et absence d'installation tardive. Les tests Python et les neuf autres suites navigateur ne sont pas répétés ici : leurs résultats précédents sont conservés et leurs composants ne sont pas modifiés.

Vérification complémentaire sur le vrai serveur local, sans interception : biceps droit `parts/38` et radius droit `bones/6`, blocs `reference-019` et `reference-013`, **726 000 octets** source résidents, **51 048 octets** de copies positions/normales d'affichage, deux géométries, aucune collision d'identifiant, DPR 1 en émulation mobile. Capture : `POLY-reference-group-mobile.png` ; reçu : `POLY_GROUP_REAL_SERVER_RESULTS.json`. L'angle de caméra initial a été amélioré après inspection visuelle. Ces compteurs ne sont toujours pas une mesure de mémoire GPU physique ou de performance d'un téléphone.

Cette section remplace la limitation historique « une seule pièce/un seul bloc » décrite plus haut. Le parcours par pièce reste disponible. Le pilote nerveux 3D complet, le recalage entre références et les déformations de tout l'atelier historique ne sont pas déclarés raccordés.

## Suite — sélection, postures, courbes compatibles et entrée commune

Les quatre raccordements logiciels annoncés dans la liste précédente sont réalisés dans les parcours expérimentaux. Les détails et limites courantes sont consolidés dans `BODY_CONVERGENCE_CHECKLIST_2026-10-28.md`.

Le lecteur par pièces sélectionne maintenant les surfaces visibles par raycasting sur les mêmes positions CPU que l'affichage, propose un cadrage et un retour, et sauvegarde le focus. Un mode distinct charge les petites entrées historiques vérifiées (calibration, marche et métadonnées du repère), réutilise exactement la recette de placement et les fonctions de déformation, puis calcule une copie d'affichage. Les nombres float64 source ne sont jamais réécrits. La restitution des coordonnées source supprime les bases de posture retenues. La marche reste une présentation, mise en pause lors du masquage de la page ; aucune activation, force ou précision biomécanique individuelle n'est revendiquée.

Les étapes nerveuses peuvent montrer une courbe documentaire dans ce repère illustratif avec une pièce correspondante déjà chargée. Une seule courbe d'étape est créée, jamais en superposition au mode source brut. Ses buffers, matériau et commandes sont libérés ou rendus inertes au changement de contexte. Les limites de jonction, provenance et arrêt terminal restent visibles ; aucune conduction ni entrée intramusculaire n'est calculée.

`anatomy.html` est une entrée commune sans WebGL, donnant accès aux parcours léger, HRA régional, références par pièces et corps historique. Le parcours historique et ses fonctions sont conservés ; il n'est pas remplacé automatiquement et le site public n'est pas modifié.

Validation courante : 101 tests Node, 21 tests Python et résultats réussis pour les 11 suites navigateur. Les neuf suites historiques/HRA sont passées lors du run consolidé ; les deux suites du lecteur de référence sont repassées après ses dernières modifications. Le parcours d'interactions a aussi réussi trois passages consécutifs. Les tests portent notamment sur le toucher d'un vrai triangle, le cadrage/retour et la reprise du focus, les phases/restaurations de copies d'affichage, les courbes compatibles, les refus de données altérées, les groupes et pertes de contexte. Toutes les routes documentaires source restent finies au repos et à la phase testée sans mutation de leurs points.

Un essai serveur réel sans interception affiche biceps/radius et une étape nerveuse : 726 000 octets de blocs source, 76 572 octets de copies et bases d'affichage des surfaces, trois géométries sans collision d'identifiant, DPR 1 en émulation mobile. Les compteurs de surfaces excluent les buffers propres de la courbe, les métadonnées et la mémoire physique. Capture : `POLY-reference-posture-mobile.png` ; reçu : `POLY_POSTURE_REAL_SERVER_RESULTS.json`.

Échec intermédiaire conservé : attente du catalogue supérieure à 45 secondes après un rechargement dans la suite d'interactions. La cause reste non établie ; les réussites suivantes ne la résolvent pas. Un diagnostic de démarrage plus précis et une commande explicite d'annulation/relance du catalogue sont ajoutés. Le transfert bloqué puis annulé/repris est testé. Le travail nocturne reprend ce point en priorité et conserve les preuves, sans retrier silencieusement pour masquer un échec.

À la demande de l'utilisateur, une relance horaire de ce chat est active pour la nuit du 28 au 29 octobre, jusqu'à 08:00 Europe/Paris. Elle continue seulement les travaux locaux autorisés, avec checkpoint court et bilan à l'échéance. Aucun push, merge, déploiement, message externe ou sous-agent n'est autorisé. La qualification sur téléphone physique et la publication restent absentes.

Une autre passe de la suite de référence a été interrompue alors qu’elle ne produisait plus de résultat. Les attentes des requêtes de test détenues par une fixture sont maintenant bornées à 15 secondes avec diagnostic ; la passe suivante a réussi. Cette interruption ne sert pas de preuve de réussite ni de preuve de correction du démarrage.


## Reprise nocturne 1 — démarrage et CPU

Garde de chargement de 30 secondes avec annulation réelle, diagnostic par étape et relance volontaire ; la cause du délai intermittent historique reste non établie. Huit rechargements bureau/mobile émulé sont passés. Écriture des positions du tronc optimisée avec résultats float32 identiques octet par octet : médiane CPU locale 46.354 → 10.217 ms, soit 4.54× sur cette seule opération. Les normales, le rendu complet et le téléphone ne sont pas mesurés par ce benchmark. 106 tests Node et les trois suites navigateur ciblées passent ; les autres résultats antérieurs ne sont pas déclarés réexécutés. Détails et reproduction dans `BODY_NIGHT_01_2026-10-28.md`.


## Reprise nocturne 2 — navigation HRA et matrice des écarts

Six orientations, retour de cadrage borné et atténuation graphique volontaire au repos HRA sont raccordés. Les matériaux sont restaurés après chaque rendu ; cache et historique ne gardent pas de ressources de scène. 111 tests Node et sept suites navigateur HRA passent. La matrice `BODY_FEATURE_PARITY_2026-10-28.md` explicite les fonctions encore partielles ou historiques (activités/journal, chaînes génériques, pilotes et ateliers distincts). Le détail et les limites figurent dans `BODY_NIGHT_02_2026-10-28.md`. Aucun progrès de qualification physique ou de résolution de la cause du délai intermittent n’est revendiqué.


## Reprise nocturne 3 — journal déclaré autonome

Le journal 24 h dispose d’un parcours sans maillage, compatible avec la clé et le schéma historiques. Brouillons explicites, copies précédentes avant remplacement, refus des versions concurrentes détectées, imports/exports et conservation des champs inconnus et heures fractionnaires sont testés. Le résumé connu est reconstruit à l’export ; aucun effet biologique ni mouvement d’avatar n’est déduit. Les vérifications de stockage ne constituent pas une transaction entre pages. 121 tests Node et les suites navigateur journal/régional/références passent. Détails et limites dans `BODY_NIGHT_03_2026-10-28.md` ; les autres postures et modèles restent distincts.


## Reprise nocturne 4 — postures historiques communes

Course, assis, allongé et geste de repas sont disponibles manuellement dans le HRA régional. Un évaluateur commun remplace les formules privées du corps classique, avec 28 sorties de référence capturées dans son ancien commit. La fenêtre 0–6 s reste graphique ; aucun lien implicite avec le journal ou une horloge biologique. Picking déformé, cadrage/retour, pause et récupération WebGL sont testés. 124 tests Node et neuf suites navigateur passent. Détails dans `BODY_NIGHT_04_2026-10-29.md` ; le pont générique de chaînes et les autres limites ne sont pas déclarés clos.
