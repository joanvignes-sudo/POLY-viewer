# POLY emotionnel v0.4 — horloges, états et premières mesures

4 octobre 2026. Travail indépendant du socle v0.22, sans mise à jour du site public.

## Résultat de l'audit

Les quatre sessions conservées en v0.3 passent les critères fixés avant extension : même nombre de signaux de début d'indice brut et d'essais NWB, erreurs compatibles avec l'arrondi au milliseconde, et identité des spikes exportés avec les fichiers bruts pour chacune des sept unités. La transformation affine d'horloge est apprise sur la première moitié et évaluée sur la seconde.

| Animal | Essais | Unités | Erreur max indice brut–NWB (ms) | Dérive ASC (ppm) | Résidu max ASC tenu à l'écart (ms) |
|---|---:|---:|---:|---:|---:|
| ZS059 | 332 | 1 | 0.491 | -313.6 | 3.370 |
| ZS060 | 383 | 2 | 0.494 | -315.4 | 3.427 |
| ZS061 | 417 | 2 | 0.491 | -311.9 | 2.007 |
| ZS062 | 321 | 2 | 0.492 | -317.8 | 1.343 |

Le fichier de développement du 28 mars est séparé de cette cohorte. Le décodage est conforme au [format officiel Neuralynx](https://neuralynx.com/_software/NeuralynxDataFileFormats.pdf). Les transitions sont isolées par port, pas uniquement par valeur TTL. Cette vérification concerne la représentation temporelle des événements enregistrés. Elle ne mesure pas la latence de l'indice acoustique, des organes sensoriels ou de la neurotransmission.

## Correction importante des états

Le journal brut distingue CS PLUS et CS MINUS. Le code 2 du NWB regroupe ici des cas différents : absence de choix enregistré après PLUS et essais MINUS sans choix. Il ne suffit donc pas à définir un état « ignore » ou un désengagement.

| Animal | PLUS avec choix | PLUS sans choix enregistré | MINUS sans choix enregistré |
|---|---:|---:|---:|
| ZS059 | 315 | 0 | 17 |
| ZS060 | 371 | 0 | 12 |
| ZS061 | 381 | 23 | 13 |
| ZS062 | 290 | 20 | 11 |

Dans ZS059 et ZS060, aucun essai PLUS sans choix enregistré n'est disponible dans les sessions retenues. ZS061 et ZS062 en contiennent respectivement 23 et 20. Un modèle neuronal de « respond versus ignore » appliqué indistinctement au code 2 mélangerait la réponse et le type d'indice. Cette ambiguïté est maintenant explicitement éliminée du registre.

Le pilote v0.3 reste numériquement valide comme prédiction de choix, mais son indicateur dit de non-réponse doit être interprété comme un code composite. Réexamen avec deux historiques séparés (MINUS et PLUS sans choix), mêmes blocs temporels, même pénalité :

| Animal | Perte M0 | Perte M1 avec récompenses passées | Gain |
|---|---:|---:|---:|
| ZS059 | 0.6082 | 0.5647 | 0.0436 |
| ZS060 | 0.2433 | 0.2068 | 0.0365 |
| ZS061 | 0.2855 | 0.2471 | 0.0383 |
| ZS062 | 0.7619 | 0.6813 | 0.0807 |

Les quatre gains restent positifs. Ce sont des associations exploratoires ; aucun effet causal, état affectif ni généralisation à la population n'en découle.

## Mesures neuronales descriptives

Sept unités exportées, avec leurs indicateurs qualité et optotag, sont comptées essai par essai. Fenêtres : [−2 s, 0[ et [0, 0,3 s[ autour du début d'indice électronique enregistré ; taux calculés séparément par durée. Les tables conservent le type d'indice, le choix, la récompense, les indicateurs de qualité et l'appartenance à la durée brute d'enregistrement. Dix-huit lignes descriptives résument les états par unité, sans test statistique neuronal.

Un contrôle par comptage direct vérifie les premières, médianes et dernières fenêtres de chaque unité. Une translation de ±5 ms documente la sensibilité des comptes aux frontières. Elle n'est pas une borne d'incertitude physique complète. Les sept unités ont des flags positifs real/QC/optotag ; ces flags ne sont pas remplacés par une déclaration d'identité LC-NE indépendante.

Le contraste PLUS avec/sans choix n'est disponible que dans deux animaux et reste exposé au mouvement, à l'historique des récompenses, au temps de session et à la disponibilité du comportement. Les comptes sont une base de travail, pas une preuve de mécanisme émotionnel. Aucun mélange avec la conscience.

## Rectification de provenance

Les métadonnées réellement décodées comprennent un processus complete_nwb_packaging avec le commit fdee4a650c1c9687564c44c422a56838aca8e3a7, y compris dans le fichier de développement. La formulation v0.3 sur un commit manquant était trop générale : plusieurs étapes d'analyse restent sans commit, mais le packaging possède ce repère exact. Le fichier beh_functions.py de ce commit a été récupéré comme source consultée, sans exécuter le code des auteurs. Cela ne fixe pas rétroactivement les versions des autres étapes.

## Suite scientifique définie

Inventaire : événements, types d'indices, choix et spikes vérifiés localement. Communications : même horloge enregistrée, précision biologique physique encore non mesurée. États : distinguer indice et réponse. Perturbations : décalages d'horloge et contrôle de variables observées ; aucune intervention biologique nouvelle. Élimination : code composite, pseudo-réplication et attribution affective automatique. Couplages candidats : activité avant/après indice et choix conditionnel à PLUS, à tester avec contrôles comportementaux. Hypothèses : couplage neuromodulateur dépendant du contexte, seulement après confrontation aux alternatives et aux études d'intervention.

Le prochain protocole doit comparer des essais PLUS avec et sans choix en contrôlant le passé des récompenses, le temps de session et les mouvements disponibles. Une relation restante serait observationnelle. Le raccord causal cœur–insula et les manipulations dopaminergiques doivent rester des préparations distinctes ; aucune concaténation de ces résultats avec les sessions LC.

Sources : [données DANDI 001950](https://dandiarchive.org/dandiset/001950/draft), [Su et al.](https://www.nature.com/articles/s41586-026-11026-0), [code et commit de packaging](https://github.com/AllenNeuralDynamics/LC-beh-physiology-analysis/tree/fdee4a650c1c9687564c44c422a56838aca8e3a7). URLs, empreintes des entrées, résidus par essai, critères, résultats et scripts propres sont archivés dans analyses/v0.4.
