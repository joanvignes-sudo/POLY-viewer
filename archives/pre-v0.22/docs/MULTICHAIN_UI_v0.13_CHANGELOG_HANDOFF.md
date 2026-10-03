# POLY viewer v0.13 — générateur multi-chaînes

Date : 2026-09-27

## Résultat
- génération automatique active pour C01–C07 et C09–C12 ;
- C08 conserve les 13 intervalles manuels raffinés ;
- les chaînes générées utilisent directement les données déjà embarquées dans le viewer ;
- aucune duplication de dataset n’est nécessaire.

## Comptage
Le prototype de validation produit 86 intervalles de base pour les 12 chaînes.
Dans le viewer, C08 remplace ses 5 intervalles automatiques par 13 intervalles manuels, soit 94 intervalles visibles au total.

## Tests publics
C01 5, C02 16, C03 2, C04 7, C05 9, C06 8, C07 11, C08 13, C09 5, C10 6, C11 8, C12 4 : PASS.
Storyboard 3 phases : PASS.
Scène générique hors C08 : PASS.
Erreurs JavaScript : 0.

## Audit restant
Les intervalles automatiques sont une base structurée, pas une validation scientifique finale. L’audit humain porte surtout sur les raccords, le découpage des nœuds complexes et les nouveaux personnages/patrons visuels.
