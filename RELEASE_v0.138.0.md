# POLY v0.138.0 — Échelle musculaire harmonisée (affichage)

Date : 25 octobre 2026.

## Changement visible
Les muscles BodyParts3D supplémentaires, y compris la main, sont désormais affichés avec douze corrections d'échelle/position par région et par côté calculées à partir des centres et étendues des os Z-Anatomy homologues.

La nouvelle calibration reste une **mise en cohérence graphique**, non une inscription anatomique validée. Les géométries d'origine sont préservées ; aucun état biologique, délai nerveux, origine ou insertion musculaire n'est déduit. Le tronc et les surfaces à latéralité indéterminée sont conservés inchangés.

Une comparaison avec les positions d'affichage précédentes est possible à l'adresse `?muscle-fit=source` (désactivation de la correction additionnelle).

## Contrôles
- Douze groupes calibrés sur 122 paires de repères géométriques osseux, source et cible documentées.
- Quatre tests unitaires réussis, JavaScript analysé sans erreur de syntaxe.
- Revue Chrome 1440 × 900 et 390 × 844 : corps enrichi chargé, passage debout/marche/course, aucun débordement ni erreur JavaScript relevé.
- La moyenne des erreurs géométriques des *centres des boîtes* des groupes appariés passe de 0,1199 à 0,0168 unité POLY. Ce contrôle n'est pas un critère de validation anatomique.
- Référence précédente et couche d'analyse scientifique intactes.

## Preuves et limites
[Rapport d'échelle et méthodes](simulateur/reports/MUSCLE_BONE_DISPLAY_FIT_2026-10-25.md) · [Calibration et provenance](simulateur/data/muscle-bone-display-calibration.json).

Les atlas utilisés proviennent d'individus et de méthodes différents ; une continuité visuelle ne prouve ni les entheses, ni les déplacements relatifs, ni les propriétés mécaniques des muscles. La validation future doit employer des repères anatomiques réels avec métriques indépendantes.
