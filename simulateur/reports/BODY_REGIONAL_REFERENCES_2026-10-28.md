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
