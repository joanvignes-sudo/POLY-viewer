# POLY v0.122 · Examiner les écarts du recalage BigBrain

Le lecteur 3D dispose d’un volet optionnel « Mesurer les écarts ». Il situe les repères anatomiques publiés dans BigBrain recalé et dans MNI, et montre le segment qui les sépare. Ces segments représentent des écarts géométriques, pas des fibres ni une activité.

[Ouvrir les repères](microstructures.html?bbframe=mni&audit=1&afid=30&rater=Rater03&v=0.122).

## Réévaluation de repères publiés

Quatre fichiers FCSV provenant du dépôt AFIDs de JC Lau ont été acquis à un commit identifié : BigBrainSym et MNI2009bSym, pour Rater03 et Rater07. Leurs coordonnées sont en RAS. Le README situe explicitement BigBrain dans son repère déjà recalé en 2015 : seuls les trois champs d’amélioration de 2019 sont donc appliqués à ces points.

Les correspondances utilisent les identifiants AFID numériques et les alias anatomiques explicites AC/PC, jamais le seul ordre des lignes. Une étiquette source `c` du second évaluateur reste ambiguë : elle est conservée dans le fichier original, sans être corrigée ni jointe. Les orientations non renseignées dans certains FCSV ne sont pas utilisées pour les coordonnées des points.

63 correspondances sont conservées. Selon le protocole de validation de Xiao et al., culmen et glande pinéale sont écartés du résumé principal ; cela laisse 30 repères chez Rater03 et 29 chez Rater07. Les points exclus du résumé restent dans les données téléchargeables avec leur motif.

| Annotation publiée | Repères principaux | Écart moyen avant (mm) | Après (mm) | Écarts réduits / augmentés |
|---|---:|---:|---:|---:|
| Rater03 | 30 | 2,088 | 2,090 | 15 / 15 |
| Rater07 | 29 | 2,016 | 1,894 | 14 / 15 |

Ces moyennes sont descriptives. L’amélioration n’est pas uniforme ; le maximum après recalage dépasse 5 mm dans les deux jeux. Les différences entre annotations sont également mesurées : sur 29 repères principaux communs, la distance moyenne entre évaluateurs est d’environ 1,223 mm dans BigBrainSym et 1,125 mm dans MNI. Ce ne sont ni des intervalles de confiance ni une incertitude propagée à l’ensemble du cerveau.

POLY n’a pas produit de nouvelles annotations manuelles et ne reproduit pas les coordonnées moyennées de tous les évaluateurs de l’étude originale. Ces calculs ne constituent pas une nouvelle validation indépendante du cerveau entier.

## Régularité mathématique sur les surfaces affichées

La dérivée analytique de l’interpolation Catmull-Rom est calculée dans les coordonnées physiques. Les matrices sont composées par la règle de dérivation en chaîne pour les cinq étapes du recalage complet, affine comprise.

Les 348 845 positions affichées sont contrôlées : aucun déterminant local nul ou négatif. Les valeurs vont d’environ 0,181 à 13,378. Il s’agit du déterminant de la transformation complète, pas du déterminant moins un : entre 0 et 1, contraction locale de volume ; au-delà de 1, expansion. Des valeurs positives ne démontrent ni une exactitude anatomique ni un changement biologique observé.

Ces statistiques ne sont pas pondérées par volume et incluent les sommets répétés dans les échantillons. Le contrôle ne porte pas sur les intérieurs des triangles ni sur tout le volume ; il ne garantit donc pas l’absence de repli partout.

Les dérivées sont comparées à des différences centrées sur 64 points, avec trois pas successifs. L’écart maximal entre éléments de matrice passe d’environ 2,58 × 10⁻⁵ à 2,41 × 10⁻⁶ puis 1,08 × 10⁻⁷. Le calcul retrouve aussi exactement, après conversion float32, toutes les positions recalées diffusées en v0.121 : aucune géométrie n’a été modifiée.

## Usage et contrôles

Choisir un évaluateur et un repère, puis « Centrer sur cet écart ». Les positions restent à leur échelle physique ; les marqueurs sont visibles à travers les enveloppes pour faciliter la lecture. Le retour au mode natif masque ces repères, déjà définis dans le repère MNI. Fermer le volet retire les marqueurs et conserve le cortex. Un export rassemble les annotations, les calculs, leurs sources et la sélection.

L’ouverture charge uniquement les petits fichiers de contrôle ; le fichier des déterminants par sommet reste téléchargeable séparément. Les empreintes sont vérifiées avant affichage. Un supplément manquant ou altéré laisse les vues anatomiques utilisables et permet de réessayer.

## Sources et droits

- [AFIDs : Lau et al.](https://doi.org/10.1002/hbm.24693), [données et code au commit consulté](https://github.com/afids/afids-analysis/tree/7b50e975cb13b27ff7847aaf820e7509996e9f21). Licence MIT du dépôt conservée avec l’attribution JC Lau.
- [Xiao et al. : protocole de validation et transformation](https://doi.org/10.1038/s41597-019-0217-0).
- [Provenance, fichiers originaux et empreintes](assets/bigbrain-validation-v0122/PROVENANCE.json).
- [Correspondances et résultats par repère](assets/bigbrain-validation-v0122/LANDMARKS.json).
- [Contrôle de régularité et convergence numérique](assets/bigbrain-validation-v0122/REGULARITY.json).
- [Déterminants par sommet, float32](assets/bigbrain-validation-v0122/jacobians.bin).

Les données et transformations BigBrain conservent leurs licences et crédits déjà documentés. Aucun raccord individuel vers H01, Allen, P8 ou les organes n’est ajouté, et aucun délai biologique n’est calculé.
