# POLY émotionnel v0.17 — réponse nominale et adaptation

4 octobre 2026. Poursuite de l'audit v0.16, sans conception nouvelle, sans fusion émotion–conscience. Les partitions chronologiques sont conservées ; aucune session n'est retirée pour améliorer un résultat.

## Ce que signifient les léchages tardifs

La v0.16 trouvait 670 essais sans issue finie contenant un léchage dans la fenêtre large [CSon ; trialEnd], parmi les fenêtres valides. Ce diagnostic ne permettait pas de conclure à une décision pendant la fenêtre de réponse. La publication décrit une réponse nominale de 1,5 seconde ; notre extension utilise les unités exportées sous convention millisecondes compatible avec le chargeur auteur. [Grossman et al., méthodes](https://pmc.ncbi.nlm.nih.gov/articles/PMC8825708/).

Sur les mêmes 133 sessions et 43 890 CSplus, la fenêtre nominale [CSon ; CSon+1500] retrouve **9 essais sans issue finie avec un léchage**, sur **2 483 absences d'issue**. Douze essais avec une issue finie n'ont aucun léchage dans cette fenêtre. Les 2 483 incluent les essais terminaux auxquels v0.16 ne pouvait pas donner de fenêtre large : le dénominateur précédent était 2 455 parmi les fenêtres valides. Il ne faut pas soustraire ces deux tableaux comme si leurs périmètres étaient identiques.

Le contrôle décalé [CSon+500 ; CSon+2000] retrouve 497 absences avec léchage, mais manque les léchages de 1 891 essais à issue finie. Cette fenêtre n'est pas choisie comme meilleure convention. Les deux variantes restent visibles. La concordance de la première est un appui interne au statut de tâche, pas une vérification matérielle de l'ouverture du spout ni une validation physique des horloges.

131 fins d'essai sont inconnues ; une fenêtre nominale dépasse une fin connue. Les résultats tronqués aux fins connues sont conservés séparément : neuf absences avec léchage pour la première fenêtre et 496 pour la seconde. Les fins inconnues ne sont pas imputées.

**Conséquence :** les résultats v0.16 sont conservés, mais leur interprétation est précisée. Absence d'issue finie correspond très majoritairement à absence de léchage dans la fenêtre nominale testée, même si des mouvements surviennent plus tard. Ce statut n'est toujours ni une mesure de motivation ni une émotion.

## DR06 : une dérive chronologique qui ne disparaît pas

| Session véhicule | CSplus | Absences d'issue | Taux |
|---|---:|---:|---:|
| 2020-03-11 | 320 | 0 | 0,00 % |
| 2020-03-14 | 323 | 0 | 0,00 % |
| 2020-03-17 | 281 | 4 | 1,42 % |
| 2020-03-20 | 229 | 0 | 0,00 % |
| 2020-03-23 | 245 | 0 | 0,00 % |
| 2020-03-26 | 248 | 1 | 0,40 % |
| 2020-03-29 | 320 | 35 | 10,94 % |
| 2020-04-01 | 367 | 101 | 27,52 % |
| 2020-04-04 | 379 | 110 | 29,02 % |
| 2020-04-07 | 356 | 100 | 28,09 % |
| 2020-04-10 | 161 | 86 | 53,42 % |

Les premières six sessions servent à l'apprentissage, les cinq suivantes au test. Les probabilités présentes restent dans {10, 50, 90} %, sans nouvelle famille de valeurs. Le nombre d'essais et les calendriers de blocs varient ; l'ensemble de valeurs ne prouve pas un protocole identique.

La dérive apparaît dès les sessions véhicule de test. Elle précède la première session agoniste **retenue dans notre test chronologique**, pas nécessairement la première administration historique : des sessions antérieures sont exclues par la partition. Ces données ne permettent pas d'attribuer le changement au médicament, au matériel, à l'état corporel ou à la motivation.

## Adaptation au passé sans réestimation sur test

Deux estimateurs supplémentaires utilisent les 20 ou 100 statuts de participation précédents dans la session, avec lissage Beta(1,1). Le premier essai utilise la constante d'apprentissage véhicule, puis chaque résultat met à jour les prédictions suivantes seulement. Aucun résultat futur, aucune sélection de fenêtre sur test, aucun nouvel ajustement de paramètre. Les modèles constant, état précédent et logistique v0.16 restent figés et leurs scores sont reproduits à moins de 10⁻¹⁰.

Chez DR06, les log-pertes moyennes par session sont :

| Modèle | Test véhicule | Test agoniste |
|---|---:|---:|
| Constante d'apprentissage | 1,67586 | 1,92958 |
| État précédent | 1,09820 | 1,08910 |
| Logistique v0.16 | 3,37441 | 4,04837 |
| Passé sur 20 essais | 0,50032 | 0,52725 |
| Passé sur 100 essais | 0,56307 | 0,62978 |

L'adaptation réagit mieux au changement de fréquence d'absence. Elle ne l'explique pas biologiquement. Elle est évaluée sur des événements réellement observés et ne constitue pas une simulation libre validée de participation.

### Le bénéfice n'est pas universel

| Groupe / condition | Passé 20 meilleur que constante | Passé 100 meilleur que constante |
|---|---:|---:|
| DREADDs / véhicule | 3 sur 6 | 3 sur 6 |
| DREADDs / agoniste | 4 sur 6 | 4 sur 6 |
| mCherry / véhicule | 2 sur 6 | 4 sur 6 |
| mCherry / agoniste | 4 sur 6 | 5 sur 6 |

Ces décomptes sont descriptifs. Chez les animaux participant presque toujours, le lissage roulant peut perdre contre une constante très élevée déjà bien estimée. Aucun estimateur n'est proclamé vainqueur général ; les Brier et pertes détaillés des cinq modèles restent conservés.

## Métadonnées et contrôles

Une session DR11 d'apprentissage contient vingt champs de probabilité non scalaires. Ils sont enregistrés comme manquants dans l'inventaire, sans probabilité inventée. Les prédictions de participation ne les utilisent pas. Ce manque rejoint le gate de simulation déjà posé ; il n'est pas une nouvelle exclusion de comportement.

Les contrôles vérifient que modifier les labels futurs ne change pas les prédictions roulantes déjà émises. Les modèles gelés v0.16 sont reproduits ; les partitions et sessions restent les mêmes. Aucun état DR13 du simulateur libre n'est corrigé par cette passe, et le modèle original hiérarchique reste non reproduit.

## Éliminations et pistes survivantes

Écartés comme acquis : lire les léchages de toute la durée comme réponses valides ; attribuer la dérive DR06 au seul traitement ; extrapoler la logistique figée à toute session ; traiter une adaptation statistique comme un mécanisme émotionnel.

Survivent : le marqueur d'issue correspond très majoritairement au comportement dans la fenêtre nominale ; l'historique récent peut améliorer la participation lorsque la session dérive ; les règles adaptatives ont un coût chez des animaux stables. Les mécanismes corporels, neuronaux et contextuels restent concurrents à tester séparément.

## Suite concrète

1. Confirmer les fenêtres matérielles et le journal des sessions DR06/DR11, avec mapping des champs et exclusions.
2. Résoudre le domaine des états DR13 et obtenir le modèle original avant un nouveau couplage de simulation.
3. Achever les calibrations humaines et recueillir les bruts des dossiers cœur–insula, respiration/interoception et LC. Les demandes déjà envoyées ne sont pas dupliquées.
4. Conserver les comparaisons chronologiques des premières étapes et leurs limites ; ne pas ouvrir la conception avant leur clôture justifiée.

Les résultats, le code, les spécifications et les contrôles sont conservés dans `analyses_emotionnel_v0.17`. Les données sources et le socle v0.22 ne sont pas modifiés.
