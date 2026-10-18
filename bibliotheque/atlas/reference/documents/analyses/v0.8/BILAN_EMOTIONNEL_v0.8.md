# POLY emotionnel v0.8 — branche causale cœur–insula et audit des chiffres publiés

4 octobre 2026. Préparation distincte des sessions LC ; aucun changement du socle v0.22.

## Ce que cette branche apporte

L'étude de [Hsueh et al.](https://www.nature.com/articles/s41586-023-05748-8) rapporte des effets comportementaux dépendants du contexte sous stimulation cardiaque et leur atténuation avec inhibition de l'insula postérieure. Il s'agit d'interventions locales chez la souris ; elles ne décrivent ni une émotion vécue, ni le trajet complet cœur–cerveau. Le registre extrait sépare les cohorts ECG, comportement, enregistrement insulaire et inhibition.

La calibration ECG utilise des souris anesthésiées. Les mesures de trajectoire ou de lever pressing ont leurs propres effectifs. Les centaines d'unités enregistrées proviennent de cinq souris ; elles ne sont pas autant de réplications animales. Les absences de pressions suivantes dans les sessions inachevées sont des données censurées ou manquantes à qualifier, pas des latences nulles.

## Contrôle de cohérence statistique

Deux couples F/degrés de liberté/P de la légende Fig2i nécessitent une vérification. Le texte PMC et la page actuelle du publisher conservent les valeurs concernées. Nous calculons uniquement la probabilité théorique associée au F et aux degrés de liberté affichés ; nous ne réanalysons pas l'expérience et ne remplaçons aucune statistique publiée.

| Ligne | F publié | ddl | P publié | P théorique du F affiché | Statut |
|---|---:|---|---:|---:|---|
| Fig2i_interaction | 1.531 | 2,24 | 0.024 | 0.236710 | REVIEW_REQUIRED |
| Fig2i_group | 5.69 | 1,12 | 0.0035 | 0.034424 | REVIEW_REQUIRED |
| Fig2i_time | 3.42 | 2,24 | 0.049 | 0.049336 | COMPATIBLE_AT_REPORTED_PRECISION |
| Fig2g_interaction_control | 3.906 | 2,60 | 0.0254 | 0.025430 | COMPATIBLE_AT_REPORTED_PRECISION |

La formule provient du [NIST, distribution F](https://www.itl.nist.gov/div898/handbook/eda/section3/eda3665.htm). Pour deux ddl au numérateur, une expression fermée est utilisée ; pour un ddl, une intégration positive après changement de variable vérifie deux résolutions numériques. Les autres lignes montrées servent de contrôles compatibles avec l'arrondi.

Cette incohérence peut concerner le F, les degrés de liberté ou P ; les légendes seules ne permettent pas de trancher. Le contraste OFT reste à examiner, et aucune valeur « corrigée » n'est promue comme résultat expérimental. Les constats EPM et interventions pIC sont traités séparément.

## Hypothèse testable, sans raccord prématuré

Hypothèse locale : une perturbation cardiaque imposée modifie un proxy comportemental selon le contexte, et une manipulation insulaire peut atténuer cette modification. Le trajet sensoriel, l'effet hémodynamique, les délais et l'état affectif vécu restent des variables ouvertes. Cette hypothèse ne devient pas un mécanisme général de l'émotion par juxtaposition de figures.

La méthode POLY impose ici : inventaire des animaux et instruments ; communications effectivement enregistrées ; états définis par contexte/proxy ; perturbations cardiaques, lumière et inhibition ; élimination des explications alternatives ; couplages survivants sous contrôles ; puis hypothèses. Un contrôle statistiquement non significatif ne suffit pas à éliminer une alternative : il faut sa puissance, son intervalle d'effet et sa portée.

Le plan d'analyse préparé exige de garder les jours, animaux et contextes identifiables, les enregistrements par préparation séparés, le mouvement comme covariable descriptive et la censure des essais inachevés explicite. Un contrôle de fréquence n'est strictement interprétable qu'après vérification de tout le motif des impulsions, de l'irradiance et de leur chronologie ; ne pas réduire deux stimulations différentes à leur seule fréquence nominale.

## Accès et travail préparé

La page publisher offre un reporting summary et une vidéo supplémentaire ; le périmètre audité n'établit aucun dépôt public de données primaires par essai. La déclaration de disponibilité renvoie aux auteurs sur demande. Aucun contact n'a été envoyé.

Le cahier de données joint précise les fichiers et contrôles nécessaires avant réanalyse : événements, trajectoires, cohortes, répétitions et censure ; raw ECG synchronisé si disponible ; mappings d'unités ; motif des stimulations et journal d'exclusions. Tant que ces éléments ne sont pas accessibles, l'extraction reste un audit de résultats publiés, et aucun délai complet cœur–insula n'est renseigné.

Les explorations LC v0.3–v0.7 restent disponibles. Le signal choix–récompenses est un candidat observationnel ; l'activité préalable n'a pas apporté de gain dans la famille prédictive testée. Les deux branches sont maintenues distinctes, avec leurs limites propres.
