# POLY émotionnel v0.21 — dépendances et indicateurs respiratoires

4 octobre 2026. Cette passe cherche les éléments qui peuvent réellement débloquer l'audit et approfondit les exports respiratoires disponibles. Aucun nouveau modèle de conception, aucune assimilation émotion–conscience, aucun remplacement des résultats principaux.

## Modèle original : une demande désormais ciblée

La demande initiale à Jeremiah Cohen concernait les données LC, les événements de léchage et la pupille. Elle ne demandait pas le code Grossman devenu nécessaire aux réanalyses. Une demande distincte est maintenant envoyée : code hiérarchique Stan/MATLAB, conventions d'initialisation et de taux négatif, simulation de lésion et mapping des anomalies DR11. Elle décrit exactement le paquet redistribué audité et ne lui attribue pas sans preuve une anomalie de l'expérience originale.

Le message explique la méthode POLY et fournit l'URL publique. Destinataire, sujet, corps et présence dans les messages envoyés sont vérifiés. **Huit demandes/messages envoyés au total**, pas huit auteurs différents. La réception effective et une réponse ne sont pas confirmées. Aucune pièce jointe, aucun accord de partage accepté.

La recherche de courrier reçue pertinente depuis le 3 octobre ne retourne aucun résultat dans son périmètre. Cela ne prouve pas l'absence de réponse sous un autre sujet ou une autre adresse.

## Accès public revu

Les métadonnées et README des dépôts officiels LC et NeuralBreathing sont récupérés à leurs commits exacts et archivés avec empreintes. L'index LC reste au commit `43f7083df17042afc23917edfa59183ef166a972`, celui identifié initialement. NeuralBreathing est fixé pour cette passe à `5eb697294ca4adc3f0974daaccc8564f48efdaf7`.

Le README respiratoire décrit une chaîne de visualisation d'exports déjà calculés et des drapeaux définis par le traitement. Il ne certifie pas que les Pvalues conservées sont brutes ou déjà corrigées. Le dépôt indique toujours un accès aux signaux intracrâniens bruts sur demande et accord de partage ; aucune donnée brute nouvelle n'est téléchargée. [Dépôt respiratoire](https://github.com/rakib05/NeuralBreathing), [documentation des exports](https://github.com/rakib05/NeuralBreathing/blob/5eb697294ca4adc3f0974daaccc8564f48efdaf7/README_coherence_plots.md), [index LC](https://github.com/AllenNeuralDynamics/locus_coeruleus_norepinephrine_neurons).

## Drapeaux respiratoires : une convention d'export vérifiée

Les six fichiers MAT sont inspectés, séparément : éveil, sommeil, anesthésie, ventilation, ventilation standard appariée et lente/profonde. Les drapeaux sont comparés aux seuils Pvalues<0,01, <0,05 et <0,1, par fichier et participant.

**Dans les six fichiers, significance_v correspond exactement à Pvalues<0,05.** Les classes de valeurs se séparent aussi par un seuil scalaire ; aucune discordance à 0,05. Ce contrôle établit une convention des exports, pas la méthode produisant les Pvalues. Leurs valeurs ne sont pas réinterprétées comme p bruts et aucun FDR/Bonferroni n'est appliqué sans ce statut.

| Fichier | Discordances à 0,01 | Discordances à 0,05 | Discordances à 0,1 |
|---|---:|---:|---:|
| Anesthésie | 48 | 0 | 40 |
| Éveil | 108 | 0 | 67 |
| Sommeil | 47 | 0 | 36 |
| Ventilation standard appariée | 60 | 0 | 36 |
| Ventilation | 87 | 0 | 62 |
| Ventilation lente/profonde | 61 | 0 | 28 |

Les discordances sont celles du seuil diagnostique contre le drapeau fourni. Elles ne sont pas des erreurs d'auteur ni des changements officiellement appliqués aux analyses.

## Sensibilité du contraste ventilation

Le contraste porte sur la fraction de sites sous le seuil dans ventilation lente/profonde moins standard, par participant. Les mêmes cinq participants et les trois seuils annoncés sont conservés ; aucun seuil favorable n'est sélectionné.

| Participant | Différence à 0,01 | Différence à 0,05 | Différence à 0,1 |
|---|---:|---:|---:|
| 559 | +0,25472 | +0,17925 | +0,11321 |
| 567 | −0,00990 | +0,02970 | +0,05941 |
| 575 | +0,32044 | +0,37017 | +0,35912 |
| 579 | +0,54971 | +0,50292 | +0,46199 |
| 585 | +0,07792 | +0,10390 | +0,13636 |

Les cinq différences positives v0.13 au seuil fourni restent retrouvées. Avec le seuil diagnostique 0,01, quatre restent positives et une devient légèrement négative. Le résultat est donc robuste à l'exclusion d'un participant dans le périmètre v0.13, mais pas uniformément positif sous tous les seuils testés ici. Ce sont deux sensibilités différentes, à conserver côte à côte.

Aucun nouveau p de population n'est calculé. Les sites ne deviennent pas des participants indépendants ; les dénominateurs sont conservés par condition. La fraction sous seuil ne remplace pas la cohérence moyenne, dont l'hétérogénéité v0.13 reste valable, ni la reconstruction des signaux bruts.

## Conséquences pour la méthode POLY

Inventaire : exports et indicateurs accessibles, bruts encore dépendants du partage. Communications : horloges et dérivation du signal restent ouvertes. États : conditions et participants séparés. Perturbations : ventilation décrite par son protocole, sans équivalence automatique avec un affect. Élimination : règle « tous les seuils donnent le même signe chez tous » non soutenue. Couplage survivant : augmentation de la fraction de sites sous le seuil auteur dans ces cinq participants, avec limites de seuil et de traitement. Hypothèse émotionnelle : non établie par cette mesure.

## Ce qu'il reste réellement à débloquer

Le code et les conventions originales, la provenance DR11 et les journaux DR06, les données de synchronisation LC, les bruts cœur–insula/respiration/interoception, et la calibration chimique humaine restent nécessaires. Les audits locaux peuvent préciser ces dépendances, mais ne remplacent pas les fichiers manquants ou l'autorisation de partage des auteurs. Aucune clôture des premières étapes n'est annoncée sans ces gates.

Les détails et preuve du nouvel envoi sont dans `analyses_emotionnel_v0.21`. Les anciens calculs, les indicateurs auteurs et les données sources restent conservés ; la baseline publique v0.22 demeure inchangée.
