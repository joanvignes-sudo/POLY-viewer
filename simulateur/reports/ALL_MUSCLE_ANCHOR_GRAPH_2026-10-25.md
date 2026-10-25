# POLY — Système provisoire d'ancrages pour les muscles de référence

**Chantier du 25 octobre 2026.** Couverture exhaustive des **surfaces disponibles**, et non de tous les muscles anatomiquement existants.

## Résultat calculé

Les deux atlas musculaires visibles dans POLY contiennent **458 surfaces du corps et 22 muscles intrinsèques de la main** — **480 surfaces**, dont des chefs, portions et variantes qui ne représentent pas chacun un muscle humain distinct.

Pour chaque surface, le pipeline reproductible retient deux sommets extrêmes selon son axe principal (ACP/PCA). Une surface osseuse candidate est cherchée dans le squelette Z-Anatomy préexistant (206 os, 208 sous-surfaces), dans un sous-ensemble régional et en respectant le côté.

| Contrôle | Nombre |
|---|---:|
| Surfaces musculaires suivies | 480 / 480 |
| Extrémités graphiques examinées | 960 |
| Extrémités avec un voisin osseux de contexte sous le seuil graphique | 942 |
| Extrémités non résolues (aucun os assez proche dans les régions autorisées) | 18 |
| Surfaces avec deux candidats de proximité osseuse | 466 |
| Surfaces avec un seul candidat | 10 |
| Surfaces sans candidat | 4 |
| **Origines ou insertions musculotendineuses localisées et validées** | **0** |
| Liaisons tissulaires, tendons et forces anatomiquement simulés | 0 |

Les 942 candidats ne sont **pas** des attaches anatomiques identifiées : certains muscles faciaux, de la langue, du bassin ou reliés à une aponévrose n'ont tout simplement pas deux insertions osseuses. L'absence de point n'est pas une défaillance logicielle : c'est une information d'incertitude. L'algorithme ne déduit ni tendon ni relation biologique de la proximité 3D.

## Méthode

1. Charger les maillages **sans les modifier** : `forearm-motor-reference.json.gz`, `hand-muscles-reference.json.gz`, `skeleton-source-206.json.gz`.
2. Appliquer les transformations de présentation existantes, y compris l'échelle régionale v0.138.0. Elles ne sont pas anatomiquement enregistrées sur un même individu.
3. Trouver les deux sommets extrêmes de la surface suivant son axe principal en 3D.
4. Sélectionner les surfaces osseuses autorisées par **grande région** et côté. Comparer la proximité à un sous-échantillon reproductible de sommets osseux.
5. Si la distance est ≤ **0,26 unité d'affichage POLY** (seuil de présentation, arbitraire et **non** une tolérance physique), enregistrer un candidat de visualisation. Sinon conserver explicitement `unresolved_no_qualified_bone_target`.
6. Mémoriser **l'os ET la sous-surface source** (important pour les trois sous-surfaces du sternum), l'index de sommet, les coordonnées source, la distance d'affichage et le statut.
7. Pour l'affichage dynamique, lier les extrémités graphiques aux maillages originaux et les os au rig existant ; ne jamais déplacer la peau, le muscle, les os ou les organes en fonction de ces liens.

Le système de visualisation permet d'inspecter une seule surface, une région ou toute la collection. Ses traits orange et ses points turquoise sont exclusivement des aides visuelles. Cette visualisation n'est pas une chaîne biomécanique fonctionnelle.

## Conservation des informations anatomiques déjà sourcées

Le registre historique de POLY contient **12 relations muscles → régions osseuses** citées, touchant **28 surfaces** de cette collection (30 associations surface/relation, puisque certains muscles possèdent deux relations). Elles sont reprises dans les enregistrements sous `documented_bone_regions` avec leur source, séparément des deux liens de proximité. Exemple : l'insertion distale du biceps sur la tubérosité radiale peut être documentée, alors que le sommet musculaire le plus proche des os du visualiseur est situé auprès de l'humérus. **Le système n'assimile jamais cet humérus à l'insertion du biceps.**

## Distinction essentielle

- **Relation documentée :** connaissance d'une région d'origine, d'insertion ou d'une continuité tendineuse par des sources anatomiques ; registre historique conservé et séparé.
- **Candidat graphique :** un point de surface musculaire proche d'un point d'os du squelette superposé ; **aucun niveau de validation anatomique**.
- **Attache physiquement simulable :** nécessite une correspondance fiable de l'os, un point d'attache documenté en coordonnées natives, une contrainte de tendon, une registration contrôlée et un repère articulaire. Cette étape reste à construire et évaluer.

Un modèle tel qu'OpenSim utilise des points d'origine/insertion et de chemin tendineux attachés à des corps rigides avec des articulations, forces et contraintes ; la simple superposition de surfaces ne suffit pas. Référence : https://opensimconfluence.atlassian.net/wiki/spaces/OpenSim/pages/53088473

## Données et licences

Les surfaces restent attribuées à BodyParts3D (DBCLS) et Z-Anatomy avec leur provenance dans les fichiers sources ; aucun modèle externe ni matériau sous licence incompatible n'a été copié. Voir aussi https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html et https://github.com/Z-Anatomy/Models-of-human-anatomy.

## Limites prioritaires

- Tronc et visage : plusieurs muscles sont attachés à des tissus mous, fasciae ou peau, non à deux os. Ne pas leur attribuer d'enthèses inventées.
- Les extrêmes PCA ne sont pas garantis être l'origine ou l'insertion d'un muscle ; un tendon peut ne pas être segmenté ou des fibres peuvent se ramifier.
- Les os 206 partagent une transformation graphique du corps et de sa pose ; les repères des atlas HRA restent distincts.
- L'animation graphique existante peut créer une séparation visuelle ou un décalage au niveau des articulations : **pas de calcul de contraction, de force ou de volume**.
- La simple proximité à un os voisin peut être anatomiquement fausse. L'absence de donnée doit être conservée et non masquée par une interpolation.

## Travail scientifique nécessaire pour obtenir de vraies attaches

Pour chaque muscle anatomique nommé (et non pour chaque surface), établir les relations **muscle → tendon/aponévrose → os ou tissu d'insertion**, avec sources, espèces et incertitudes. Recaler les vrais repères des tendons et les empreintes d'enthèse ; mesurer l'erreur indépendante ; vérifier les poseurs bilatéraux et les chemins musculotendineux. Alors seulement dériver des contraintes cinématiques, puis les déformations et actions. Le registre TA2 de 271 concepts nommés et les relations historiques de POLY restent le cadre d'identité de cette démarche.

## Fichiers

- `scripts/build_all_muscle_display_anchors.py` : générateur reproductible des proximités et des statuts
- `data/all-muscle-display-anchors.json` : base 480 × 2, aucune coordonnée d'enthèse déclarée
- `web/all-muscle-attachment-overlay.mjs` : outil graphique d'inspection sans effet sur le simulateur
- `tests/test_all_muscle_display_anchors.py` : invariants de non-fabrication, repères d'os et sources.
