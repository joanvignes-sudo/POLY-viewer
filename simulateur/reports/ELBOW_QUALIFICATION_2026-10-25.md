# POLY — Coude : qualifications anatomiques, volumes et déformations

**Recherche du 25 octobre 2026 — pilote documentaire et géométrique, non validé cliniquement.**

## Pourquoi ce pilote

POLY v0.138.0 superpose des muscles BodyParts3D, un squelette Z-Anatomy et des organes HRA. La calibration des proportions est **graphique**, même si l'identité des objets est documentée. Transformer cette superposition en modèle physiologique demande trois validations **distinctes**, qui ne découlent pas les unes des autres.

Le registre `data/muscle-skeleton-interface.json` avait déjà des relations de **régions osseuses** documentées mais **0 coordonnées d'enthèses** et **0 transformations anatomiques validées**. Le présent pilote ne change pas ces décomptes.

## 1. Insertions et origines : ce qui est établi

| Interface | Fait documentaire | Référence | Statut dans POLY |
|---|---|---|---|
| Tendon distal du biceps → radius | Empreinte de la tubérosité radiale, orientation et dimensions variables ; étude de 30 radius cadavériques | Forthman et al. 2008, PMID 18325797, DOI 10.1016/j.jse.2007.11.002 | **Région documentée**, points d'insertion par chef inconnus, maillages non co-recalés |
| Tendon distal du triceps → ulna | Insertion sur l'olécrâne ; étude IRM/histologie de 12 coudes montrant une continuité terminale malgré une apparence bipartite en IRM | Belentani et al. 2009, PMID 18985338, DOI 10.1007/s00256-008-0605-6 | **Région documentée**, pas trois enthèses indépendantes déduites des trois surfaces musculaires |
| Carré pronateur ← ulna | Origine sur la face antérieure du quart distal de l'ulna | NCBI Bookshelf, NBK536975 | **Origine régionale documentée**, coordonnées natives inconnues |
| Carré pronateur → radius | Insertion sur la face antérieure du quart distal du radius | Étude morphométrique humaine, PMC12282155 | **Insertion régionale documentée**, coordonnées natives inconnues |

**Attention :** les géométries de plusieurs chefs musculaires ne suffisent pas à segmenter les tendons communs ou à placer des attaches exactes. Il faut des landmarks indépendamment sourcés sur les os *et* les tendons du même sujet ou d'un référentiel dont la registration est qualifiée.

Sources : https://pubmed.ncbi.nlm.nih.gov/18325797/ · https://pubmed.ncbi.nlm.nih.gov/18985338/ · https://www.ncbi.nlm.nih.gov/books/NBK536975/ · https://pmc.ncbi.nlm.nih.gov/articles/PMC12282155/

## 2. Rapports de volumes : obstacle mesuré

L'audit numérique traite **12 surfaces musculaires sources distinctes** : 4 du biceps (2 chefs × 2 côtés), 6 du triceps (3 chefs × 2 côtés) et 2 du carré pronateur (2 côtés). L'origine et l'insertion du pronateur partagent les **mêmes deux surfaces**, qui ne sont donc pas comptées deux fois.

Toutes les 12 surfaces ont **des arêtes de bord ouvertes** (`boundary_edge_count > 0`). La maquette ne permet pas d'intégrer leur enveloppe comme volume tissulaire fermé sans réparation contrôlée de la segmentation. Aucun volume clinique ni ratio de volume muscle/os n'a été produit.

Les rapports `bbox_muscle_to_bone_enclosure_ratio` archivés dans `data/elbow-surface-audit.json` sont seulement des rapports des **boîtes englobantes alignées dans le système de coordonnées source BodyParts3D** : ils servent à contrôler l'encombrement graphique. Ils ne sont ni des ratios physiologiques ni des rapports de volumes de tissus mesurés. Le squelette cible Z-Anatomy et les organes HRA proviennent de référentiels distincts. Une intersection apparentée dans l'avatar n'est donc **pas** une preuve d'adjacence anatomique.

Pour produire de vrais volumes, utiliser une segmentation 3D fermée en unités physiques, comparer à un référentiel IRM ou dissection, contrôler la reproductibilité et la définition des frontières. Revue méthodologique : https://pmc.ncbi.nlm.nih.gov/articles/PMC6264864/

## 3. Déformations : audit d'une flexion illustrative

Le moteur `web/rig.js` fait évoluer des sommets selon une pondération spatiale et la pose; il **ne contient pas les contraintes origine → tendon → enthèse**. Une flexion *illustrative* de **60 degrés au coude droit** a été appliquée aux mêmes maillages, puis les variations de longueurs **des arêtes triangulaires** ont été calculées relativement à la position initiale.

| Surface testée | RMS de variation relative d'arêtes | 95e percentile |
|---|---:|---:|
| Chef long du biceps droit FJ1478 | 6,31 % | 17,01 % |
| Chef médial du triceps droit FJ1480 | 8,98 % | 23,21 % |
| Chef latéral du triceps droit FJ1477 | 6,12 % | 12,89 % |
| Chef court du biceps droit FJ1512 | 2,16 % | 5,36 % |
| Carré pronateur droit FJ1503 | 0 % dans ce test | 0 % dans ce test |

Ces nombres mesurent la **distorsion de la triangulation graphique**, jamais une élongation de fibre, un volume contractile, une puissance ou une tension de tendon. Un zéro ne valide pas une raideur physiologique. Dans la commande `eatForearm` actuellement testée, le bras **gauche ne reçoit pas la flexion locale équivalente** : ses variations sont nulles pour absence d'excitation dans ce test, pas preuve de rigidité.

L'audit `scripts/audit_elbow_display_motion.mjs` compare strictement deux états du calcul CPU `deformPosition` et sort `data/elbow-motion-display-audit.json`. Il ne modifie pas le moteur animé.

## 4. Les critères qui autoriseraient un statut « validé »

1. **Identité** : muscle (TA2, côté, superficie segmentée), tendon et os (identifiant de géométrie du référentiel), avec provenance et licence.
2. **Repères réels** : coordonnées d'origine et d'insertion *dans le repère d'origine des deux objets*, segmentations des enthèses et incertitudes mesurées, avec même sujet ou calibration contrôlée.
3. **Registration** : transformation explicite, estimation d'erreur sur landmarks retenus hors optimisation, test de cohérence par région et par pose. Le recalage visuel actuel ne qualifie pas ce point.
4. **Volume** : surface fermée, orientation cohérente, absence de trous/manifold problématique, unité physique et répétabilité contre une segmentation indépendante.
5. **Déformation** : continuité origine–corps musculaire–tendon–enthèse, longueur de faisceaux et bras de levier, contrainte de non-interpénétration et validation par données cinématiques/imagerie indépendantes.
6. **Physiologie** : jamais inférer excitation, vitesse de conduction, force ou délai à partir de la distance ou de l'animation.

Une « liaison validée » doit être refusée tant que le contrat `data/elbow-anatomical-qualifications.json` contient des coordonnées nulles ou aucune validation indépendante.

## 5. Ce qui est livré

- `data/elbow-anatomical-qualifications.json` : preuves, statuts, obstacles et contrat de validation des quatre relations.
- `data/elbow-surface-audit.json` : état reproductible de la topologie, boîtes englobantes et rapports strictement graphiques.
- `data/elbow-motion-display-audit.json` : tests de déplacement et de distorsion sous flexion graphique.
- `scripts/qualify_elbow_surfaces.py` : vérification reproductible des maillages sources.
- `scripts/audit_elbow_display_motion.mjs` : calcul de référence des distorsions d'arêtes.
- `web/elbow-qualification.mjs` : lecture séparée des preuves et limites dans la fiche du muscle sélectionné.
- `tests/test_elbow_qualifications.py` : contrôles anti-surinterprétation des trois axes.

**Statut final du pilote :** documenter et quantifier les barrières de validation est terminé ; les **insertions exactes, volumes musculaires vrais et déformations physiologiques demeurent non validés**. C'est un état scientifique défendable, pas un échec du projet.
