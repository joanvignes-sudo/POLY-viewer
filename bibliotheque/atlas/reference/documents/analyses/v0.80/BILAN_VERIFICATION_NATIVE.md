# POLY émotionnel — vérification native v0.80

Le 7 octobre 2026, les trois versions Figure3 ont été exécutées dans MATLAB Online R2026b (26.2.0.3386108). Le rapport natif est PASSED : la réserve d'exécution MATLAB des bilans v0.78/v0.79 est fermée. Aucune installation MATLAB locale n'a été nécessaire. Cette clôture porte sur la reproduction des calculs exportés, hors canon.

## Référence préalable et provenance

Branche Git : emotionnel. Branche scientifique : S24 / Bang2020, neurochimie humaine historique. Événement : stimulus. Comparaison sur les 61 bins archivés ; Figure3A : bins 11–26, 0–1,5 s ; Figure3C : bins 11–51, 0–4 s. Trou ciblé : exécution des scripts MATLAB et concordance avec Python v0.79. S24 n'est pas P02 VTA et ne crée aucun P04.

Ancien code : commit 0105f91e14364a9849b87e6d1013529ef0dec54e. Correction auteur : 5cddcd20ed1dda2979f277f0434356c8413beae8. Les quinze MAT publics et six fonctions proviennent de l'archive v0.14, vérifiés lors de la préparation ; les gros bruts n'ont pas été recollectés ni réaudités. Seuls les chemins locaux ont été adaptés pour les deux scripts sources. Le troisième script est un contrôle distinct à trois intercepts libres. La correction auteur conserve deux indicatrices de participants sans constante globale, donc l'intercept de P1 contraint à zéro ; ce n'est pas un modèle mixte.

Le package public a été téléversé dans l'espace MATLAB de Joan ; aucune correspondance privée n'y a été transmise. Le lanceur a ensuite été remplacé pour ajouter les exports lisibles. PROVENANCE_PACKAGE.json décrit le package local final régénéré ; PROVENANCE_EXPORT_NATIVE.json décrit les sorties effectivement téléchargées. SPECIFICATION_NATIVE.json et le guide LIRE_AVANT_EXECUTION.md conservent l'état historique de préparation, antérieur à l'authentification et à l'exécution.

## Calculs vérifiés

Tolérance absolue prédéfinie : 10⁻⁸. Les comparaisons portent sur C, D et C×D : coefficients et p groupés et individuels, ainsi que tests t, moyennes et SEM de Figure3A. Elles ne prétendent pas vérifier des SE de GLM ou coefficients A/RT que le script source n'exporte pas ; leur contrôle Python v0.79 reste une preuve distincte.

| Version | Écart maximal coefficient groupé | Écart maximal p groupé | Changements au seuil 0,05 |
|---|---:|---:|---:|
| Ancien modèle | 1,015 × 10⁻¹⁶ | 2,170 × 10⁻¹² | 0 |
| Correction auteur | 7,633 × 10⁻¹⁷ | 1,173 × 10⁻¹¹ | 0 |
| Contrôle trois intercepts libres | 4,857 × 10⁻¹⁷ | 1,738 × 10⁻¹¹ | 0 |

Pour les trois versions, maxima individuels : coefficient 1,943 × 10⁻¹⁶ ; p 4,664 × 10⁻¹¹. Tests t : p 1,448 × 10⁻¹³ ; moyennes 1,943 × 10⁻¹⁶ ; SEM 5,551 × 10⁻¹⁷. Tous sont sous la tolérance. Chaque version native est comparée à son propre calcul Python : la concordance ne rend pas les trois modèles identiques, ni les statistiques indépendantes des mêmes données.

Le groupe demeure P1–P3, 757 essais ; P4/P5 sont séparés. Les exclusions comportementales et le traitement des NaN restent ceux documentés : aucune imputation à zéro. Les quatre premiers bins initialisés à zéro par la source sont comparés pour les coefficients ; leurs p dégénérés ne constituent pas des tests interprétables.

## Figures et sauvegarde

Les neuf JPEG natifs originaux sont conservés. Leur lisibilité était insuffisante avec le thème sombre et les grands caractères. Une seconde exécution, justifiée par ce défaut, a produit neuf PNG séparés sur fond blanc avec caractères adaptés ; les calculs ont de nouveau passé exactement les mêmes comparaisons. Les neuf PNG ont été examinés : axes, panneaux, courbes, SEM et repères de p lisibles, sans clipping majeur. Aucun changement de donnée, de modèle ou de seuil ; aucune identité de pixels avec la publication n'est revendiquée.

Les deux ZIP téléchargés, les MAT natifs, le rapport JSON, les JPEG et PNG, le lanceur et les attentes sont archivés ici. Les empreintes de cette passe sont dans MANIFESTE.json ; une copie des livrables est conservée dans la conversation. La preuve visuelle MATLAB montre le premier passage PASSED ; le rapport natif final inclut les neuf exports lisibles.

## Portée et suite

Fait : les scripts ont tourné dans MATLAB. Calcul : les sorties comparées concordent avec Python à la tolérance annoncée. Modèle : les contraintes d'intercepts restent distinctes. Réserves scientifiques : entraînement/poids/prétraitement chimiques non disponibles, waveforms TTL absentes, précision temporelle déclarée par l'auteur non démontrée par ces exports. Le trou de 339,16 ms pour P5 stimulus essai 199 reste une limite documentée ; aucune exclusion ni latence biologique nouvelle n'en est déduite.

Les quatre axes restent ouverts et les huit formulations admissibles limitées demeurent inchangées. Aucun rapprochement émotion/conscience, nouvelle conception biologique, promotion canonique ou publication. v0.22 et ses vingt empreintes, v0.6 et la réplication NHANES v0.25 sont préservés sans répétition de contrôles clos. Aucun message auteur supplémentaire ; les huit demandes antérieures ne sont pas dupliquées. L'automatisation reste en pause.

Cette étape technique est achevée. La prochaine décision peut s'appuyer sur le dossier admissible existant et cette réserve fermée ; elle ne transforme pas les lacunes scientifiques persistantes en faits établis.
