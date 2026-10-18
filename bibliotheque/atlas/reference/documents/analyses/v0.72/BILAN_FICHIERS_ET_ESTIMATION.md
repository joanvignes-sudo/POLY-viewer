# POLY v0.72 — correspondance des fichiers CSS et calculs conditionnels

Les seize fenêtres de terrain ont maintenant une correspondance documentaire avec les seize fichiers individuels CSS du catalogue RTRA. Les noms de fichiers ne suivent pas les trimestres calendaires : le T1 2022 correspond à CSS2021W4 ; le T2 2022 à CSS2022W1 ; le T1 2024 à CSS2023W4 ; le T2 2025 à CSS2025W1. La correspondance repose sur le thème, relié au formulaire et à son terrain déjà vérifiés.

| Terrain | Nom du fichier RTRA | Instrument |
|---|---|---:|
| 2021-Q2 | CSS2021W1 | 1305623 |
| 2021-Q3 | CSS2021W2 | 1314408 |
| 2021-Q4 | CSS2021W3 | 1323993 |
| 2022-Q1 | CSS2021W4 | 1329712 |
| 2022-Q2 | CSS2022W1 | 1379467 |
| 2022-Q3 | CSS2022W2 | 1404059 |
| 2022-Q4 | CSS2022W3 | 1420377 |
| 2023-Q2 | CSS2023W1 | 1505758 |
| 2023-Q3 | CSS2023W2 | 1519868 |
| 2023-Q4 | CSS2023W3 | 1524477 |
| 2024-Q1 | CSS2023W4 | 1530647 |
| 2024-Q2 | CSS2024W1 | 1535404 |
| 2024-Q3 | CSS2024W2 | 1540673 |
| 2024-Q4 | CSS2024W3 | 1543978 |
| 2025-Q1 | CSS2024W4 | 1552640 |
| 2025-Q2 | CSS2025W1 | 1559624 |

Les deux fichiers ménages CSS2023HH/CSS2024HH sont conservés séparément. Ils ne remplacent pas les fichiers individuels pour estimer la satisfaction globale de la vie. Les deux taux enquête encore inconnus de 2022 ne sont pas remplis depuis les noms de fichiers ou les effectifs d’autres analyses.

## Ce que la route officielle permet

Le [catalogue RTRA](https://www.statcan.gc.ca/en/microdata/rtra/data) indique le nom du poids WGT et une base1000 pour les fréquences des fichiers individuels CSS. Il liste aussi des variables retirées de cette voie d’accès. Cette liste ne permet pas de déduire les codes d’item manquant ou les paramètres de variance.

Le [guide d’introduction](https://www.statcan.gc.ca/en/microdata/rtra/training/introduction) précise que le service est un outil de tableaux pour abonnés : les microdonnées et les poids ne sont pas directement accessibles. Les documents propres aux fichiers passent par l’espace de transfert du compte. Aucun compte, souscription ou envoi de programme n’est effectué ici.

Le [module de moyenne](https://www.statcan.gc.ca/en/microdata/rtra/training/programming/mean) permet de calculer une moyenne pondérée et décrit la jointure du poids via ID. La disponibilité de SE, bornes d’IC et autres indicateurs dépend du fichier, des poids bootstrap et de la statistique, selon le [guide des sorties](https://www.statcan.gc.ca/en/microdata/rtra/training/output). Une possibilité du service ne constitue donc pas une réplication obtenue.

La base1000 porte sur des fréquences, pas sur la précision d’un score0–10. Les sorties COUNT sont pondérées ; elles ne sont pas automatiquement un effectif brut. Le guide de l’arrondi contrôlé montre aussi que l’ordre des variables peut modifier les résultats arrondis. Aucun écart minime n’est interprété comme variation réelle sans ces métadonnées.

## Pièces requises pour le prochain calcul

La fiche ROUTE_ESTIMATION_COMPATIBLE.json fixe l’estimand et les deux fichiers2022 cibles. Avant exécution, il faut confirmer le nom de la variable dans les microdonnées, les codes de refus/non-réponse/hors champ, les règles de réponse partielle, le module de variance et l’accès autorisé. LSM_Q01 est un identifiant de questionnaire ; son nom dans le fichier n’est pas inventé.

Le zéro valide du questionnaire ne doit pas devenir un remplacement du manquant. On ne regroupe pas les deux vagues ou les fichiers ménages et individus. Les moyennes et leur précision doivent porter sur la même cellule et les mêmes règles d’inclusion. Aucun calcul de moyenne, IC, ANOVA ou NHANES n’est relancé dans cette passe.

## Reprise sur pièce nouvelle

Les recherches ciblées restantes n’ont pas donné de nouvel appui explicite pour les tauxT1/T2 2022. Les notices incohérentes et dates discordantes restent conservées. Aucun nouveau message aux auteurs ; aucune réponse dans le périmètre de correspondance consulté.

Les six formulations admissibles et les deux proposées demeurent dans le dossier préparatoire, avec leur portée exacte. Les mécanismes biologiques, références physiques et mappings individuels demandés restent ouverts. La prochaine passe utile doit être déclenchée par une donnée, une réponse, un guide ou un accès qui lève un manque précis ; les lectures et contrôles clos ne doivent pas être répétés à cadence horaire.
