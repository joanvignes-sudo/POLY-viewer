# POLY émotionnel v0.12 — robustesse d'une perturbation

Cette passe approfondit les quatre axes existants. Aucune conception nouvelle. Le contrôle de messagerie n'a trouvé aucun retour dans la recherche ciblée sur les auteurs et les sujets POLY ; aucune relance envoyée.

## Résultat

L'analyse descriptive sérotoninergique v0.11 est prolongée sur trois fenêtres fixées avant calcul. Chaque valeur est la médiane des différences agoniste−véhicule par animal, après moyennes des transitions par session puis des sessions par condition. Six animaux par groupe ; les fenêtres partagent des observations.

| Fenêtre CSplus | Ancien côté parmi les choix, DREADDs | Même mesure, témoins mCherry | Ancien côté parmi tous les essais, DREADDs | Même mesure, témoins |
|---|---:|---:|---:|---:|
| 5 essais | +0,0211 | +0,0279 | +0,0159 | +0,0268 |
| 10 essais | +0,0762 | +0,0138 | +0,0456 | +0,0114 |
| 20 essais | +0,0388 | +0,0497 | +0,0118 | −0,0049 |

Le résultat à dix essais retrouve exactement celui de v0.11. La différence entre médianes des groupes dépend de la fenêtre et du dénominateur ; elle n'est pas une estimation ajustée d'effet causal. L'ancien côté augmente chez cinq des six DREADDs à dix essais, quatre sur six à cinq et vingt essais. Cela ne permet pas d'annoncer une persistance accrue spécifique et robuste sur toutes les fenêtres.

Les différences médianes de fractions sans choix sont respectivement +0,0147 / +0,0202 (DREADDs / témoins) à cinq essais, +0,0282 / +0,0296 à dix, +0,0291 / +0,0152 à vingt. L'absence de choix est traitée séparément, sans l'assimiler à un choix du nouveau côté. Les fenêtres entièrement sans choix sont exclues des trois mesures pour préserver un même ensemble d'événements ; ces fractions ne décrivent donc pas toutes les transitions possibles. Les blocs courts sont exclus différemment selon la fenêtre : les variations reflètent aussi des changements d'événements admissibles.

## Conséquence pour POLY

Le signal à dix essais reste une observation descriptive conditionnelle. Il ne rejoint pas les couplages robustes : sensibilité à la fenêtre, cohortes petites, calendrier et quantités de sessions inégaux, absence de reproduction du modèle d'apprentissage original. Ce contrôle ne réfute pas les conclusions biologiques de l'étude, qui portent sur d'autres estimations. [Étude Grossman](https://pmc.ncbi.nlm.nih.gov/articles/PMC8825708/), [archive utilisée](https://doi.org/10.5281/zenodo.14628985).

L'accès aux signaux bruts, les horloges et les mappings demandés aux auteurs restent ouverts. Aucun besoin d'intervention de Joan à ce stade. La v0.22 reste la baseline stable, et les quatre axes ne sont pas déclarés terminés.

## Reproduction

Les résultats complets par événement, session et animal sont conservés dans `analyses_emotionnel_v0.12/SENSIBILITE_SEROTONINE.json`. La spécification est conservée séparément. Le contrôle de reproduction compare les douze valeurs par animal à v0.11 à une tolérance de 1e−12 ; aucune valeur de p n'est calculée. Script, empreintes et rapport sont archivés dans le dépôt émotionnel distinct.
