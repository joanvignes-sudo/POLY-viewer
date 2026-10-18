# POLY emotionnel — protocole de première analyse

4 octobre 2026. Proposition d'analyse à partir du dossier v0.2, hors canon. Ce protocole précède l'estimation d'effets : aucun résultat attendu n'a été utilisé pour choisir le petit fichier d'audit.

## Question circonscrite

Dans les sessions LC admissibles, une variation d'activité autour d'un choix ou d'une issue apporte-t-elle une information au-delà du mouvement, de l'histoire de tâche et de l'éveil lorsqu'il est mesuré ? Il s'agit d'une question de communication et d'état. Une réponse positive ne constituerait pas une mesure d'émotion.

Le fichier d'audit prouve seulement la présence de certaines variables. Il n'est pas un échantillon représentatif et une unité ne permet pas une généralisation de population. Aucune sélection future ne doit être fondée sur le signe ou la significativité d'un effet.

## Gate A — source et identité

- Figer la version de dépôt et les fichiers retenus par leurs empreintes ; la version DANDI `draft` peut changer.
- Vérifier subject_id, identifiant de session, liste de sessions des auteurs et modalité.
- Élucider la différence entre l'heure du nom de fichier et `session_start_time` avant toute jointure temporelle entre fichiers.
- Distinguer données réellement mesurées, dérivés de traitement et variables de modèle ; ne pas utiliser de formes d'onde « fake_raw » comme enregistrements physiques.
- Enregistrer explicitement les jeux de données ou cohortes distincts ; ne pas relier anatomie, gènes et activité cellule par cellule sans identité commune.

Sortie : table de provenance avec inclusion motivée et raisons d'exclusion. Tant que ce gate n'est pas passé, aucune concaténation de sessions.

## Gate B — horloge

Lire les opérations de fusion comportement/électrophysiologie dans le pipeline des auteurs. Identifier l'origine, l'unité, le décalage, la dérive et les événements de synchronisation. Le recouvrement de plages numériques ne suffit pas. Vérifier ordre go cue → choix → issue, frontières d'essai et raccord des spikes ; documenter tous les écarts.

Si les événements de synchronisation ne sont pas disponibles, consigner ce manque et utiliser seulement les analyses dont la portée résiste à cette incertitude. Ne pas produire une latence absolue sous précision non établie. Fig. 3 VTA reste séparée : son origine corrigée est le début de l'odeur, non la récompense.

## Gate C — mesures et qualité

Contrôler unités réelles, isolation, présence au cours de la session, stabilité, critères d'optotagging et localisation si elle est utilisée. Lire les seuils avant d'interpréter `default_qc` ou les drapeaux d'optotagging. Une latence manquante ne devient pas zéro.

Pour le comportement, distinguer gauche, droite et absence de réponse ; repérer récompenses automatiques/manuelles, essais laser, omissions et données manquantes. Les règles d'exclusion seront fixées avant l'ajustement. La qualité d'un spike train n'établit pas à elle seule l'identité noradrénergique ni sa projection.

Une session dépourvue de mesure d'éveil ne permet pas d'éliminer cette alternative. Un capteur de calcium n'est pas un capteur de concentration du neuromodulateur.

## Gate D — comparaison d'explications

Analyse proposée, encore non exécutée :

| Modèle | Variables | Fonction |
|---|---|---|
| M0 | temps dans session, choix, latence et léchage disponibles | explication par action et dérive |
| M1 | M0 + histoire des issues | contrôle de l'histoire |
| M2 | M1 + valeur attendue et issue définies séparément | comparaison attente/issue |
| M3 | variante RPE contraignant les coefficients attente et issue | tester un calcul proposé |

L'ajout d'une RPE dérivée ne crée pas une mesure physique nouvelle. Les modèles auront les mêmes essais, mêmes fenêtres et mêmes mesures cibles. Préférer une validation temporelle par blocs à un mélange aléatoire d'essais autocorrélés. Avec plusieurs animaux, la généralisation doit être évaluée par animal et l'incertitude tenir compte de la structure imbriquée des essais et neurones.

Fixer les fenêtres depuis le protocole source, puis une sensibilité limitée et annoncée. Inclure une référence permutée qui respecte l'organisation temporelle. Ne pas choisir des fenêtres ou unités pour maximiser une significativité. Si des variables nécessaires manquent, réduire la conclusion plutôt que les reconstruire silencieusement.

## Élimination et couplages survivants

Un candidat survit seulement aux alternatives effectivement testées, dans sa préparation. Un modèle plus complexe doit améliorer une prédiction hors ajustement ; un contrôle insuffisant ne permet ni validation ni élimination. Consigner au minimum : résultat nul, explication par mouvement, dépendance à la fenêtre, effet non identifiable, association persistante, ou soutien causal externe distinct.

Promotion possible : « activité liée à une condition après contrôles disponibles ». Promotions interdites : « NE libérée » à partir de spikes seuls, « émotion identifiée » à partir du choix seul, et « conscience démontrée » à partir d'une association.

## Livraison prévue après passage des gates

Table de sessions et unités admissibles, contrôle de temps, résultats des modèles nuls et candidats, incertitudes et limites ; puis schéma de communications laissant visibles les gaps. Le prototype émotionnel reste indépendant de la v0.22. Les premières fiches ne recevront des valeurs numériques qu'avec une source précise et un calcul traçable.
