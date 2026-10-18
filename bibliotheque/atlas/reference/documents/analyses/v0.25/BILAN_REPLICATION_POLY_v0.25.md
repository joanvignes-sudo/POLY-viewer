# POLY — réplication et vérification des mesures, v0.25

Passe du 4 octobre 2026. Complément à la synthèse quantitative v0.24, hors canon public.

## Résultats nouveaux

Les six moyennes NHANES (trois groupes de sommeil, scores neuf et huit items) et leurs erreurs standards/IC sont reproduits avec un estimateur d’enquête indépendant de notre code local: TaylorEstimator de samplics 0.6.1. Écart maximal des moyennes: 0; des erreurs standards: 8,33×10⁻¹⁷; des bornes: 4,44×10⁻¹⁶. Le domaine d’analyse conserve les 8 860 observations MEC à poids positif pour le plan. La release samplics utilisée est archivée; sa version est figée pour reproduction. [Méthode publiée du logiciel](https://doi.org/10.21105/joss.03376).

Les coefficients des deux régressions sont également reproduits via statsmodels WLS: écart maximal 1,29×10⁻¹⁴. Une seconde estimation de variance utilise 32 réplications BRR avec une matrice Hadamard équilibrée et orthogonale sur les 15 strates. L’écart maximal des erreurs standards avec Taylor est 2,28 %, tous coefficients compris. Les quatre IC des contrastes de sommeil restent au-dessus de zéro. Il s’agit d’une sensibilité de méthode exploratoire, pas d’une preuve causale ni d’une élimination de la confusion et de la non-réponse. [Variance d’enquête NHANES](https://wwwn.cdc.gov/nchs/nhanes/tutorials/varianceestimation.aspx).

## Transport des protéines: définition des moyennes et des erreurs

Le texte intégral de Bourke 2021, extrait XML Europe PMC, a été acquis et figé par empreinte. Le seuil est 10 % de l’accumulation finale de surface après photolibération globale du réticulum. Figure 3D: six valeurs **moyenne ± SEM**. Figure 3B: NL1 10 neurones/point dans quatre expériences; GluA1 11 neurones/point dans deux expériences. L’effectif propre à chaque point 3D n’est pas indiqué séparément.

| Compartiment | GluA1, moyenne ± SEM (min) | NL1, moyenne ± SEM (min) | Lecture du texte source |
|---|---:|---:|---|
| Soma | 41,5 ± 3,81 | 50,0 ± 2,29 | Écart descriptif, pas de retard établi de GluA1 |
| Proximal 0–40 µm | 46,9 ± 4,03 | 52,8 ± 3,07 | Dynamiques décrites comme similaires |
| Distal 40–200 µm | 50,9 ± 3,14 | 66,6 ± 3,18 | Arrivée de GluA1 significativement plus précoce rapportée par les auteurs |

Ne pas transformer les SEM en écarts-types sans effectifs confirmés. Les compartiments d’un même cargo peuvent partager les neurones et ne constituent pas trois études indépendantes. Aucun IC de contraste ni moyenne regroupée des compartiments n’est fabriqué. [Bourke et al., 2021](https://doi.org/10.1083/jcb.202103186).

## Audit du registre historique

39 observations historiques confrontées à la baseline: 38 identifiants y figurent, Q08 demeure historique et n’est pas réintroduit. Après exclusion des taux, vitesses, diffusion, horaires de prélèvement et borne catégorielle, 29 observations actuelles sont candidates comme quantités temporelles. Elles ne partagent pas pour autant le même intervalle ou la même préparation.

Les anciennes valeurs centrales de plages sont conservées dans des colonnes explicitement historiques: elles ne sont pas promues comme moyennes expérimentales. Cela concerne notamment les décroissances, endocytose, traversée du pore, réacidification, épissage et retours à la ligne de base. La vitesse Q16 est séparée des temps. Les expressions «environ une minute» de Q09/Q10 sont des approximations et non des moyennes exactes.

## Portée et prochain travail

Les calculs NHANES passent ces réplications numériques; la validation scientifique de l’association reste limitée aux contrôles déjà spécifiés. Pour obtenir une moyenne interétudes de délais, il faut encore plusieurs estimations indépendantes du même mécanisme avec préparation, début/fin, effectifs, nature des erreurs et covariances. Les premières recherches ne constituent pas encore une telle méta-analyse. Les quatre axes initiaux restent ouverts, aucune conception nouvelle. Baseline v0.22 préservée.

## Traçabilité

Tableaux de réplication et contrôles dans REPLICATION_POLY_2026-10-04/. Le fichier AUDIT_QUANTITES_ENRICHI_v0.25.csv enrichit les définitions d’erreur sans modifier la baseline. Acquisition du PDF Gerkau: réponse non PDF, échec consigné; aucune extraction brute inventée. L’XML Bourke est conservé localement comme preuve, hors archive livrée. Scripts et versions des dépendances sont conservés pour reproduction.