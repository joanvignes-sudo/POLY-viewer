# POLY emotionnel v0.5 — première élimination d'un couplage candidat

4 octobre 2026. Baseline publique v0.22 intacte ; recherche locale séparée.

## Conclusion limitée

La variante testée — utiliser les taux de spikes dans les deux secondes avant CS PLUS, ajoutés à l'historique comportemental, pour prédire la présence d'un choix enregistré — n'améliore pas la prédiction temporelle hors apprentissage dans les deux sessions estimables. Les deux autres sessions restent non estimables parce qu'elles ne contiennent aucun PLUS sans choix admissible. Elles n'ont pas été remplacées.

| Animal | PLUS sans choix admissibles | Perte M0 comportement | Perte M1 avec spikes préalables | Gain M0−M1 |
|---|---:|---:|---:|---:|
| ZS059 | 0 | — | — | non estimable |
| ZS060 | 0 | — | — | non estimable |
| ZS061 | 23 | 0.6526989915232957 | 0.6862404562146847 | -0.03354146469138897 |
| ZS062 | 20 | 0.7353907567796762 | 0.756424967107956 | -0.02103421032827979 |

Les gains négatifs signifient une dégradation, sous ce modèle et ce protocole. Ce résultat ne réfute pas un rôle biologique du LC, ne teste pas l'émotion et ne constitue pas une preuve d'absence de signal. Il élimine cette variante comme prédicteur utile dans les deux sessions analysées. Les nombres d'unités simultanées ne sont pas utilisés pour gonfler le nombre d'animaux.

## Méthode et limites

Le protocole a été écrit avant le calcul. M0 inclut progression de session et cinq antécédents de choix, récompense, CS MINUS et PLUS sans choix. M1 ajoute les unités simultanées de la fenêtre préalable. Cinq blocs de test successifs et apprentissage sur le passé seulement ; standardisation et pénalité fixées. Aucun spike après l'indice n'entre dans la prédiction.

Les absences de choix sont rares et réparties inégalement. Dans ZS061, la perte du dernier bloc est particulièrement élevée ; dans ZS062, un autre bloc concentre l'échec. Les résultats complets restent visibles, au lieu de ne présenter qu'une moyenne. Un diagnostic ajouté après le modèle conserve les positions de chaque absence, les effectifs par bloc et un prédicteur à intercept seul appris sur le passé. Ce diagnostic n'a servi à aucun réglage ni remplacement d'analyse.

Les décalages conjoints des colonnes neuronales restent descriptifs, sans valeur p confirmatoire. Le mouvement, les léchages spontanés, l'éveil, la fatigue et des historiques plus longs demeurent des explications non contrôlées. Les taux sont relatifs à l'indice électronique enregistré ; les latences physiques ne sont pas vérifiées.

## Registre selon la méthode POLY

Inventaire réel : quatre sessions, sept unités vérifiées contre les fichiers bruts. Communications : temps électroniques concordants ; horloge ASC affine validée en partie tenue à l'écart. États : CS PLUS/MINUS séparés du choix enregistré. Perturbations de modèle : retrait/ajout des variables neuronales et décalage conjoint de leur historique, sans intervention biologique. Élimination : variante prédictive préalable non retenue localement. Couplages survivants candidats : l'historique des récompenses améliore encore les choix gauche/droite dans les quatre sessions après séparation des types d'indices (v0.4), au niveau observationnel uniquement. Hypothèses : rester ouvertes sur les mécanismes et exiger des interventions et contrôles distincts.

## Prospective mise à jour

1. Étendre les sessions selon une règle indépendante des effets, pour tester la stabilité de la dépendance choix–récompenses et documenter les ruptures de régime. Ne pas choisir uniquement les sessions riches en absences après avoir observé les résultats.
2. Vérifier les variables de mouvement et les léchages disponibles avant une comparaison activité–réponse. Un raccord neurocomportemental survivant à ces contrôles resterait observationnel.
3. Garder l'intervention cœur–insula dans une préparation distincte. Le protocole devra comparer stimulation imposée, contrôles de lumière/opsine, contexte et inhibition insulaire. Les données publiées qualitatives ne suffisent pas à reconstruire les délais d'une voie cœur–cerveau complète.
4. Garder les interventions dopaminergiques séparées, corriger les axes temporels selon l'erratum et distinguer unités identifiées des unités présumées. Aucune fusion des cohortes LC, dopamine et cœur.

Le travail ne nécessite aucune décision de l'utilisateur pour poursuivre les sources publiques. L'accès aux données cœur–insula brutes pourrait nécessiter une demande aux auteurs ; aucune demande n'a été envoyée. La priorité scientifique est la levée des ambiguïtés et l'épreuve des alternatives, sans construire prématurément une catégorie « émotion ».

## Conservation

Spécification, script propre, résultats, décalages et diagnostics conservés dans analyses/v0.5 du dépôt emotionnel. Les v0.1–v0.4 restent disponibles. Les références et empreintes des entrées sont celles de v0.3/v0.4 ; aucune donnée publique ni version du viewer n'a été modifiée.
