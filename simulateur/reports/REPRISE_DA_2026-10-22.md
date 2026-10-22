# POLY — Bilan de reprise DA · 22 octobre 2026

Lot local vérifiable terminé : **sept cervicales BodyParts3D 4.3 transformées dans le repère de l’avatar**, avec une comparaison activable et une matrice commune archivée. **Aucune registration anatomique ni enthèse n’est déclarée validée.** Aucun contenu publié.

## Résultat concret et accès

Le travail est intégré dans `Source originale archivee localement`. Le dossier DA complet est aussi recopié dans les outputs de la reprise `ok-x20`.

Ouvrir la version locale avec `LANCER_POLY.cmd`, puis [l’avatar local](https://joanvignes-sudo.github.io/POLY-viewer/). Dans le panneau gauche, **Recalage osseux · lot local DA → Comparer les cervicales**. Choisir un niveau ou les sept, puis basculer entre l’initialisation et l’ajustement. Le bleu distingue les niveaux d’estimation, l’ambre les niveaux réservés au contrôle. La comparaison s’ouvre debout en pause et se ferme lorsqu’on quitte cette inspection ; aucune validation des autres postures n’est supposée.

Le bouton **Voir le coccyx HRA existant** montre le coccyx déjà présent, avec le sacrum de contexte. [La vue des sources Z-Anatomy](http://127.0.0.1:27320/web/registration-source-da.html) permet d’examiner les quatre trapèzes et de choisir le candidat coccyx Z-Anatomy dans son propre atlas. La vue source n’applique pas la matrice des cervicales BodyParts3D.

## Ce que mesure le lot cervical

Sources : originaux OBJ de CZ, leurs identifiants FJ/FMA et leurs empreintes conservés. Cible : surfaces cervicales HRA d’affichage déjà présentes, avec empreinte du fichier binaire contrôlée. Les sept dérivés OBJ conservent sommets et connectivité ; une seule similitude propre, à échelle uniforme et sans réflexion, transforme toute la région. Aucun os n’a reçu une déformation indépendante.

Initialisation : centres de boîtes C1/C3/C5/C7, ajustement dans le plan sagittal, avec orientation de l’axe transversal imposée comme hypothèse de repère. Ces centres ne sont pas des repères anatomiques annotés. Raffinement : rapprochement itératif de sommets entre os correspondants, sous-échantillonnage déterministe et rejet des 20 % de distances les plus élevées sur chaque os d’estimation. C2/C4/C6 n’interviennent pas dans le calcul des paramètres.

Sur ces trois niveaux réservés, le RMS dirigé moyen passe de **0.007618 à 0.006256 unité POLY**, soit **17.9 %** de réduction. Il s’agit du RMS des sommets sources échantillonnés vers les sommets cibles, moyenné à poids égal par niveau. Le tableau ci-dessous rapporte une autre mesure : RMS bidirectionnel sur l’ensemble des sommets de chaque paire. Toutes les mesures et la trajectoire d’optimisation figurent dans `REGISTRATION_CERVICALES.json`.

| Niveau | Identité source | Rôle | RMS bidirectionnel initial | RMS bidirectionnel affiné | P95 affiné |
| --- | --- | --- | ---: | ---: | ---: |
| C1 | FJ3176 / FMA12519 | estimation | 0.007367 | 0.005537 | 0.010366 |
| C2 | FJ3177 / FMA12520 | contrôle réservé | 0.005765 | 0.006489 | 0.012201 |
| C3 | FJ3161 / FMA12521 | estimation | 0.007740 | 0.007659 | 0.015276 |
| C4 | FJ3164 / FMA12522 | contrôle réservé | 0.005985 | 0.005083 | 0.009493 |
| C5 | FJ3167 / FMA12523 | estimation | 0.007723 | 0.005222 | 0.009618 |
| C6 | FJ3170 / FMA12524 | contrôle réservé | 0.008343 | 0.005771 | 0.010333 |
| C7 | FJ3172 / FMA12525 | estimation | 0.009993 | 0.006760 | 0.012175 |

**Unités normalisées de l’avatar, pas des millimètres.** La hauteur normalisée est 3,5. Les distances sont entre sommets, sensibles à la densité et à la décimation, et non des distances exactes aux triangles. Les atlas représentent des morphologies et poses différentes. Les niveaux réservés ne constituent ni une cohorte indépendante, ni une validation par anatomiste. Aucun seuil d’acceptation anatomique n’a été inventé. L’amélioration géométrique ne valide pas les contacts, les articulations, les origines ou les insertions musculaires.

Sept des 79 sources de CZ ont ainsi un dérivé de présentation calculé et contrôlé. **72 sources restent hors de ce lot** : 54 os de main et 18 sources vertébrales/sacrales. **Zéro des 79 n’est promu au statut de registration anatomique validée.**

## Coccyx : absence de source distinguée de présence dans l’avatar

1. **HRA déjà présent** : `VH_M_coccyx`, nœud **969**, correspondance documentaire **UBERON:0001350**, 92 sommets et 180 triangles d’affichage. La provenance HRA united male v1.10 / Visible Human et les empreintes sont conservées dans `COCCYX_QUALIFICATION.json`. Licence documentée : CC BY 4.0. Ce n’est pas un ajout anatomique ni une segmentation individuelle validée.
2. **Z-Anatomy retrouvé et extrait** : objet source `Coccyx`, **589 sommets et 1066 polygones**, matrice Blender et empreintes conservées ; aucun modificateur restant à évaluer. Candidat nommé et affichable dans son repère source, sans recalage sur HRA et sans identité FJ/FMA BodyParts3D 4.3 attribuée. Voir `COCCYX_Z_CANDIDAT.json` et `Z_CONTEXT/`.
3. **BodyParts3D 4.3** : aucune surface coccygienne distincte nommée trouvée dans le manifeste 3210 maillages, l’arbre source et `FMA2Obj` examinés. Les listes officielles IS-A/PART-OF ont également été archivées et interrogées ; leur version n’est pas assimilée à 4.3. Le journal conserve requêtes et empreintes. Les muscles coccygiens ne sont pas comptés comme os. Cette recherche ne prouve pas l’absence dans toutes les versions ni dans une éventuelle surface fusionnée.

Aucune attache du plancher pelvien ni articulation sacrococcygienne n’est déduite des surfaces retrouvées.

## Quatre maillages litigieux du trapèze

Les quatre originaux CT ont été relus avec contrôle des empreintes, topologie et transformations stockées. Aucun modificateur non évalué ne les concerne. **Les quatre surfaces sont fermées, sans arête de bord ni arête non-manifold** ; aucun contour libre ne fournit directement une enthèse. Les bandes géométriques médiales et latérales à 10 % sont décrites comme échantillons d’inspection, jamais comme attaches.

Les objets nommés « Ascending » occupent toujours la région supérieure, les « Descending » la région thoracique inférieure, avant toute transformation vers l’avatar. La contradiction persiste. La dissection publiée par [Johnson et al., 1994, PMID 23916077](https://pubmed.ncbi.nlm.nih.gov/23916077/) décrit les faisceaux occipitaux/nuchaux vers la clavicule et les faisceaux thoraciques convergeant vers la région scapulaire. La nomenclature et les descriptions régionales sont également rapprochées de l’[atlas d’anatomie de Loyola](https://www.meddean.luc.edu/lumen/meded/grossanatomy/dissector/mml/trap.htm). Ces textes documentent des régions, pas des coordonnées dans ces maillages.

Pour rendre la reprise inspectable, **12 objets de contexte du même fichier Z-Anatomy** sont extraits : occipital, ligament nuchal, deux clavicules, deux scapulas, C7/T1/T4/T12, sacrum et coccyx. Onze sont rendus ; le ligament nuchal reste brut, avec ses modificateurs Subdivision/Solidify non évalués. Les **2 polygones litigieux des scapulas**, un de chaque côté, sont exclus uniquement du rendu après échec de la conservation d’aire lors de la triangulation. Les originaux et les diagnostics sont conservés ; le rendu osseux n’est donc pas prétendu exhaustif.

**Décision : quatre pièces maintenues en quarantaine, zéro nom échangé, zéro attache attribuée.** Le contexte osseux entier ne suffit pas : il faut annoter les sous-régions claviculaires/scapulaires et les repères occipitaux, nuchaux et spinaux dans ce même atlas, vérifier la représentation tendineuse/aponeurotique et obtenir une revue anatomique indépendante. Voir `TRAPEZE_REEXAMEN.json`.

## Sources, licences et limites conservées

- BodyParts3D / DBCLS : originaux CZ, chemins du miroir, identifiants et SHA256 conservés ; mention reçue **CC BY-SA 2.1 Japan** maintenue. La [page officielle de licence de l’archive](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html), mise à jour le 27 février 2025, annonce **CC BY 4.0**. Les deux informations sont enregistrées séparément ; aucun changement rétroactif de licence des fichiers du miroir 4.3 n’est affirmé. Copie de la page et empreinte dans `sources_consultees/`.
- HRA united male v1.10 / Visible Human : source et modèle d’affichage identifiés, CC BY 4.0 selon la provenance locale.
- Z-Anatomy / Gauthier Kervyn, Marcin Zielinski : CC BY-SA 4.0, dérivations BodyParts3D signalées ; source Blender conservée dans CL, empreinte attachée au candidat coccyx. Aucun script incorporé au fichier Blender n’est exécuté.

Les transformations BP43 ne sont transférées ni aux muscles Z-Anatomy CW/CX/CY ni aux coccyx. Leurs origines/insertions restent à valider séparément. Aucun tendon, nerf, force, délai ou conduction ajouté. Les 480 surfaces musculaires de référence, 68 références osseuses historiques et 575 routes restent inchangées. Les sept cervicales DA forment une couche de revue séparée, pas sept entrées ajoutées à ces compteurs.

## Tests et conservation

**76/76 contrôles réussis**, sans erreur JavaScript ni HTTP lors du parcours local. Contrôles des empreintes sources/dérivés, des matrices et de l’échelle commune, des indices géométriques, des niveaux réservés, du coccyx, de la quarantaine et des limites d’affichage. Vérification du chargement de l’avatar, des comparaisons initiale/affinée, de l’isolation C4, de la fermeture avant animation, des six postures existantes et des vues PC/mobile. Les tests d’interface et de six postures ne constituent pas des tests d’exactitude anatomique.

Tous les fichiers préexistants de modèles, provenance et scripts web étrangers au lot restent identiques à leurs empreintes de reprise. Le seul fichier existant modifié par ce lot est `web/app.js`, pour charger la revue facultative. Sa sauvegarde d’avant lot est conservée dans `avant/app.js`. Une **modification parallèle** de `data/muscle-skeleton-interface.json` a été observée pendant les tests : le lot local `POLY_PREUVES_HUMAINES_DA_2026-10-22` ajoute une preuve documentaire humaine du pied et relie quatre lignes régionales. Sa sauvegarde préalable correspond exactement à notre empreinte de départ ; les entités, compteurs, relations d’enthèses et validations spatiales sont inchangés. Cette contribution extérieure est conservée, sans lui attribuer une validation supplémentaire. Les deux versions, les empreintes et son bilan figurent dans `modification_parallele/` et `MODIFICATION_PARALLELE.json`.

Quatre fichiers s’ajoutent à l’avatar : deux données et deux fichiers de revue, ainsi qu’une copie de ce bilan dans reports. Le dossier historique CZ n’est pas réécrit. `TESTS.json`, `PRESERVATION_AVANT.json` et `MANIFEST_DA.csv` permettent le contrôle.

Les premières vérifications ont révélé un séparateur de chemin Windows dans le test et une erreur de syntaxe lors de l’insertion du module ; ils ont été corrigés avant le parcours final. La revue d’images a ensuite conduit à masquer temporairement les couches complémentaires pendant la comparaison ; le parcours final a été réexécuté sur cette version.

## Prochaine reprise précise

1. Annoter des repères osseux homologues indépendants sur les cervicales source et cible ; contrôler l’incertitude, la rotation et les surfaces, avec revue anatomique, avant toute promotion de statut.
2. Traiter séparément les thoraciques, lombaires/sacrum et mains, avec leurs poses propres. Ne pas propager la matrice cervicale à ces régions.
3. Choisir et qualifier la fonction du coccyx de référence existant ; si le candidat Z-Anatomy est retenu, le recaler et le contrôler avant de lui associer des attaches.
4. Annoter les sous-régions d’attache du trapèze sur les pièces sources extraites, confronter les quatre maillages à ces repères et à la documentation, puis seulement décider de l’identité et de l’intégration.

**Publication : aucune.** Les modifications restent sur ce PC. Toute publication attend une nouvelle demande explicite.
