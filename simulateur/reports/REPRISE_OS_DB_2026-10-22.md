# POLY — Fin du lot de placement osseux DB · 22 octobre 2026

**79/79 sources osseuses BodyParts3D 4.3 du lot CZ sont désormais transformées, exportées et accessibles dans la revue de l’avatar.** Les 72 restantes ont été traitées : 12 thoraciques, 5 lombaires, le sacrum et les 54 os des mains. Les sept cervicales précédentes sont préservées. Le candidat coccyx Z-Anatomy est ajouté séparément à la comparaison avec HRA : **80 surfaces sources dans la revue**, sans compter deux fois le coccyx HRA existant.

**Ce qui est terminé : acquisition du lot, correspondances documentaires, placement graphique régional, exports et comparaison contrôlée. Ce qui n’est pas déclaré terminé : registration anatomique validée, articulations et attaches musculaires.** Le lot CZ n’est pas l’inventaire de tous les os du squelette humain ; les autres os et surfaces historiques de POLY restent présents.

## Accès local

Ouvrir [POLY local](https://joanvignes-sudo.github.io/POLY-viewer/), panneau gauche **Os · lot local DB**. Choisir une région puis **Comparer les os de la région**. Chaque os est sélectionnable par son identifiant ; « Toutes les régions » donne les 80 surfaces. Il est possible de basculer entre l’initialisation et l’ajustement, et de masquer les surfaces de comparaison pour voir la source seule. La revue s’ouvre debout en pause et se ferme lorsqu’on change de posture ou de contexte.

Le bouton du coccyx HRA conserve l’accès à la pièce déjà présente. Pour comparer le candidat Z-Anatomy, choisir **Coccyx candidat** dans Région. La revue des quatre trapèzes sources reste disponible et leur quarantaine est conservée.

## Groupes et résultats

Une seule similitude propre, uniforme, est appliquée à chaque région : aucune déformation indépendante d’un os ou d’un doigt. Les coordonnées relatives de l’atlas source sont conservées à cette similitude près. Aucun reflet n’est créé et les côtés sont contrôlés. Matrices, identifiants FJ/FMA, chemins, empreintes et métriques sont dans `REGISTRATIONS.json`, `OS_AVATAR.json` et `CORRESPONDANCES_OS.csv`.

| Groupe | Surfaces | Comparaison | RMS initial agrégé | RMS affiné agrégé |
| --- | ---: | --- | ---: | ---: |
| Cervicales · 7 | 7 | HRA d’affichage | 0.00767491 | 0.00613601 |
| Thoraciques · 12 | 12 | HRA d’affichage | 0.00760305 | 0.00596611 |
| Lombaires · 5 | 5 | HRA d’affichage | 0.0125101 | 0.0119504 |
| Sacrum · 1 | 1 | HRA d’affichage | 0.0187927 | 0.00957177 |
| Main gauche · 27 | 27 | BP4.0 déjà placé | 0.0006564 | 2.42204e-15 |
| Main droite · 27 | 27 | BP4.0 déjà placé | 0.000583007 | 2.22461e-07 |
| Coccyx candidat · 1 | 1 | HRA d’affichage | 0.00599302 | 0.00471423 |

Les RMS sont bidirectionnels entre sommets, agrégés à poids égal par os, en **unités normalisées POLY, pas en mm**. Ils dépendent de la décimation et ne mesurent pas une erreur clinique ni la distance exacte aux triangles. Les erreurs dirigées sur les os réservés sont archivées séparément ; elles ne sont pas interchangeables avec les RMS de ce tableau.

Thoraciques et lombaires : initialisation par centres de boîtes, avec hypothèse d’orientation de l’axe transversal, puis ajustement itératif aux sommets cibles correspondants. Des niveaux alternés sont exclus de l’estimation ; leurs identifiants exacts sont archivés. Les erreurs dirigées de contrôle diminuent dans ces deux régions. L’algorithme utilise les seuls os d’estimation, sans choisir les paramètres en fonction des os réservés.

Sacrum et coccyx : initialisation par centre/diagonale de boîte, puis ajustement exploratoire. **Il n’existe aucun os indépendant réservé pour ces deux groupes à pièce unique.** Aucun contrôle indépendant d’exactitude anatomique n’est revendiqué.

## Particularité des mains

HRA ne contient pas ici de maillage osseux segmenté des mains. Les 27 sources 4.3 par côté sont donc appariées par **nom, FMA et côté** aux 27 références BodyParts3D 4.0 déjà placées dans POLY. Les matrices historiques de placement et d’alignement de ces références sont reproduites et comparées à la fonction réellement utilisée par l’application.

Les géométries des deux versions coïncident presque exactement après transformation, surtout à gauche. **Ce résultat confirme la cohérence géométrique entre références apparentées ; il ne fournit aucune validation anatomique indépendante, aucun gain démontré de résolution et aucune segmentation nouvelle du sujet HRA.** Les métriques très faibles ne doivent donc pas être présentées comme une précision clinique. Chaque main reste un ensemble source cohérent, sans étirement doigt par doigt.

L’identifiant historique de l’os trapézoïde droit est `FJ3389`, tandis que la source sélectionnée 4.3 porte `FJ1245`. Leur correspondance documentaire utilise le même nom/côté et `FMA23725` ; les deux identifiants sont conservés. Aucun identifiant FJ n’est réécrit pour faire croire à une identité de fichiers entre versions.

## Coccyx et trapèzes

Le coccyx natif HRA reste `VH_M_coccyx`, nœud 969, correspondance UBERON:0001350. Le candidat nommé `Coccyx` de Z-Anatomy dispose maintenant de sa transformation exploratoire vers cette surface HRA. Il ne devient pas pour autant un maillage BodyParts3D 4.3 : aucune identité FJ/FMA n’est inventée et il reste hors du compteur 79.

L’origine brute, les polygones et l’empreinte du candidat Z-Anatomy restent dans DA ; l’export DB est un dérivé triangulé pour l’affichage. Le sacrum et le coccyx ne sont pas déclarés articulés ni validés conjointement : leurs ajustements distincts ne prouvent pas la congruence sacrococcygienne.

Les quatre maillages ascendant/descendant du trapèze restent **en quarantaine, avec leurs noms sources**. Compléter la revue des os ne résout pas le conflit des libellés musculaires. Aucune enthèse, insertion, continuité tendineuse ou attache fasciale n’est déduite de la proximité. Aucune transformation n’est propagée aux muscles CW/CX/CY.

## Préservation, attribution et tests

**426/426 contrôles réussis**, sans erreur JavaScript ni HTTP dans le parcours final. Les contrôles couvrent les 80 surfaces, leurs sources et exports, les matrices appliquées à tous les sommets, les côtés, les index, les sept régions et la sélection de chaque région puis d’un os représentatif, les comparaisons initiale/affinée, les cibles historiques des mains, l’ensemble des 80 surfaces, le masquage des cibles, les six postures existantes, le mobile et l’accès aux trapèzes.

Tous les fichiers préexistants de données et de modèles sont conservés à leur empreinte de début DB, y compris le registre documentaire muscles–squelette enrichi parallèlement au lot précédent. Seul `web/registration-da.js` est mis à niveau pour afficher la revue complète ; sa version antérieure est sauvegardée dans `avant/`. `data/bone-registration-db.json` est ajouté. Les compteurs historiques restent **480 surfaces musculaires**, **68 références osseuses corporelles historiques** et **575 routes nerveuses** ; les 54 os déjà présents dans le module des mains ne sont pas comptés comme 54 acquisitions anatomiques nouvelles.

BodyParts3D : attribution **DBCLS / BodyParts3D** conservée. Les mentions reçues **CC BY-SA 2.1 Japan** et la mention **CC BY 4.0** de la page officielle consultée restent enregistrées séparément, sans requalification rétroactive des fichiers du miroir. HRA / Visible Human : CC BY 4.0 selon la provenance locale. Z-Anatomy / Gauthier Kervyn, Marcin Zielinski : CC BY-SA 4.0, dérivations BodyParts3D signalées. Voir `PROVENANCE.json` et les notices archivées dans DA.

**Tout reste local ; aucune publication.** Le dossier complet est recopié dans `ok-x20/outputs/POLY_OS_COMPLETS_DB_2026-10-22` et ce bilan dans les rapports de l’avatar. Les originaux CZ et DA ne sont pas réécrits.

## Suite anatomique précise

Le reliquat de placement du lot CZ est désormais **zéro**. La suite est la qualification anatomique : repères homologues annotés indépendamment, contrôle des surfaces et des articulations, puis revue des attaches musculaires. Pour les mains, il faudra une cible anatomique indépendante ou des repères osseux qualifiés ; comparer les versions d’une même référence n’y suffit pas. Aucun de ces travaux n’est masqué par la complétude du compteur de placement.
