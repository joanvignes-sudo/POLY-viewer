# POLY emotionnel — étape v0.3

Date : 4 octobre 2026. Recherche indépendante ; socle public v0.22 conservé et contrôlé par empreintes (20 fichiers).

## Résultat concret

Dans quatre sessions choisies par une règle déterministe avant examen des résultats (session médiane chronologique par animal Hopkins admissible), l'ajout des cinq récompenses passées, signées par côté, améliore la perte prédictive des choix. Il s'agit d'une association comportementale exploratoire, sans attribution à une émotion, à la conscience ou à la noradrénaline.

| Animal | Choix de test | Perte M0 | Perte M1 | Gain | Exactitude M0 → M1 |
|---|---:|---:|---:|---:|---:|
| ZS059 | 159 | 0.6082 | 0.5647 | 0.0436 | 0.692 → 0.698 |
| ZS060 | 185 | 0.2433 | 0.2068 | 0.0365 | 0.930 → 0.930 |
| ZS061 | 181 | 0.2688 | 0.2368 | 0.0320 | 0.906 → 0.901 |
| ZS062 | 135 | 0.5017 | 0.4195 | 0.0823 | 0.837 → 0.822 |

M0 contient le temps dans la session, cinq choix passés et cinq indicateurs de non-réponse ; M1 ajoute cinq récompenses passées signées. Une perte plus faible est meilleure. Les cinq blocs de test successifs n'utilisent que les essais antérieurs pour l'apprentissage et la standardisation. Aucun réglage choisi sur les résultats. L'exactitude ne progresse pas systématiquement. La moyenne non pondérée des gains vaut 0.0486 ; elle n'est pas une estimation de population.

Le premier fichier, retenu auparavant pour sa petite taille, donne seulement un gain de 0,0012, variable entre blocs. Il est conservé à côté de la cohorte, sans être ajouté comme cinquième animal. Cinquante décalages circulaires constituent un contrôle descriptif imparfait en présence de non-stationnarité ; leurs fractions ne sont pas des valeurs p confirmatoires. Les résultats par bloc et tous les contrôles restent accessibles dans les fichiers JSON.

## Ce qui est vérifié

Les cinq sessions correspondent à la table des auteurs. Les indicateurs de récompense concordent avec les listes d'événements ; les contrôles temporels internes examinés passent. Les spikes sont ordonnés à l'intérieur de chaque unité, pas dans la concaténation de plusieurs unités. Le solveur reproduit une solution analytique à intercept seul et atteint un gradient pénalisé inférieur à 10⁻⁶ sur un cas numérique indépendant.

Le champ reward_outcome_time décrit l'enregistrement du choix : il ne doit pas être utilisé comme instant de délivrance de récompense. Les probabilités exportées sont exclues de ce pilote. L'identité de session est distinguée de son horodatage civil incohérent.

## Application de la méthode POLY

Inventaire réel : choix, récompenses, essais, unités et métadonnées. Communications : événements comportementaux documentés ; raccord comportement–spikes encore conditionnel. États : historique local et progression de session, sans étiquette émotionnelle. Perturbations : essais automatiques et laser exclus avec leurs cinq antécédents ; décalages descriptifs du passé des récompenses. Élimination : exclure l'usage erroné du temps de choix comme temps de récompense et toute attribution neuronale non synchronisée. Couplage survivant candidat : récompenses passées–choix futurs, sous ces conditions. Hypothèse : une dépendance historique améliore la prédiction hors apprentissage ; elle doit être éprouvée dans davantage de sessions et contre d'autres explications.

Le contrôle numérique est une perturbation du modèle, pas une perturbation biologique. Aucun couplage causal ou universel n'est validé.

## Prochaine étape préparée

La synchronisation entre appareils n'est pas encore validée avec une borne d'erreur. La branche pack est explicitement référencée par le NWB ; les commits récupérés sont des instantanés consultés, pas une preuve du commit réellement utilisé. Le code d'alignement consulté contient un contrôle global trop large pour certifier les fenêtres neuronales.

Un fichier brut public Events.nev (778 880 octets) a été récupéré avec son URL et son empreinte. Il reste à décoder les événements TTL, retrouver leurs correspondances comportementales, estimer décalage et dérive, puis publier les résidus et critères d'acceptation avant toute analyse neuronale. Aucune intervention de l'utilisateur n'est nécessaire pour cette piste publique à ce stade.

## Sources et reproduction

Source des sessions : [DANDI 001950](https://dandiarchive.org/dandiset/001950/draft), brouillon mutable ; identifiants et empreintes conservés dans la sélection et les résultats. Contexte publié : [Su et al., 2026](https://www.nature.com/articles/s41586-026-11026-0). Code source consulté : [LC-beh-physiology-analysis](https://github.com/AllenNeuralDynamics/LC-beh-physiology-analysis). Les scripts des auteurs n'ont pas été exécutés.

Scripts propres, spécification préalable, NWB d'entrée, sources consultées et résultats archivés dans analyses/v0.3 du dépôt emotionnel. Les chemins des scripts supposent la racine du dossier de travail d'origine ; leurs entrées et sorties sont explicites dans les appels conservés. Le rapport distingue les données publiées, nos calculs exploratoires et les hypothèses.
