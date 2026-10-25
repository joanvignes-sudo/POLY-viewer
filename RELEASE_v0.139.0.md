# POLY v0.139.0 — Qualification scientifique du coude

**25 octobre 2026**

Première mise en œuvre lisible et reproductible des barrières entre anatomie documentée, géométrie d'atlas et déformation pédagogique.

## Fonctionnalité
Dans **Corps → muscles et nerfs**, choisir l'un des muscles du biceps, triceps ou carré pronateur. Une nouvelle section **Qualification anatomique** montre séparément :
- l'insertion ou l'origine documentaire et sa source humaine ;
- les arêtes ouvertes du maillage et l'impossibilité d'en déduire un volume tissulaire exact ;
- la variation d'arêtes calculée sur une flexion graphique de 60° (pas une contrainte ni un allongement de fibre).

L'information est liée à l'identifiant réel de chaque surface ; les organes, os, maillages, mouvements et simulations existants **ne sont pas modifiés**.

## Validation
- 12 surfaces distinctes auditéees en topologie de triangles : 12 surfaces ouvertes ; 0 volume musculaire vrai calculable sans segmentation supplémentaire.
- 4 relations documentaires structurées, 0 point d'enthèse enregistré.
- 12 surfaces testées sous flexion du coude droit : métriques de distorsion géométrique archivées ; la flexion locale équivalente du bras gauche n'est pas testée comme mouvement fonctionnel.
- 5 tests unitaires réussis ; syntaxe Python et JavaScript vérifiée.
- Validation Chrome desktop 1440 px et mobile 390 px : panneau visible, deux relations du pronateur, liens de sources, zéro erreur de page et zéro débordement.

## Sources et limites
[Rapport complet](simulateur/reports/ELBOW_QUALIFICATION_2026-10-25.md) · [Relations sourcées](simulateur/data/elbow-anatomical-qualifications.json) · [Topologie et encombrement](simulateur/data/elbow-surface-audit.json) · [Déformations graphiques](simulateur/data/elbow-motion-display-audit.json).

**Le statut anatomique reste : insertion régionale documentée, coordonnées 3D non qualifiées, volume physiologique inconnu, déformation anatomique non validée.** Cette version apporte une méthode de qualification, pas une simulation biomécanique certifiée.
