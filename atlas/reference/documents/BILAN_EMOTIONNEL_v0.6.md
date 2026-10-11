# POLY emotionnel v0.6 — extension temporelle et contrôle des proxys

4 octobre 2026. Recherche locale indépendante ; socle public v0.22 inchangé.

## Sélection et limites rencontrées

Les rangs aux premier et troisième quartiles de la liste des auteurs ont été fixés avant sélection, pour chacun des quatre animaux. Huit positions étaient prévues. Deux n'ont qu'un fichier comportemental dans le catalogue DANDI instantané, sans fichier behavior+ecephys. Aucun remplacement n'a été fait. Une autre position retrouve exactement le fichier de développement ZS060 du 28 mars : elle n'est pas une nouvelle validation. Il reste cinq sessions neuronales nouvelles accessibles, chez les mêmes animaux ; aucun animal supplémentaire.

| Position | Essais | Statut selon critères fixés | Gain choix : récompenses | Gain présence de choix : spikes |
|---|---:|---|---:|---:|
| ZS059_Q25 | — | MISSING_NEURAL_FILE_IN_CATALOG | — | — |
| ZS059_Q75 | 319 | NOT_MODELED_PRESET_BEHAVIOR_GATE | — | — |
| ZS060_Q25 | 331 | ANALYZED_WITH_PRESET_GATES | 0.0012 | — |
| ZS060_Q75 | — | MISSING_NEURAL_FILE_IN_CATALOG | — | — |
| ZS061_Q25 | 337 | ANALYZED_WITH_PRESET_GATES | 0.0864 | — |
| ZS061_Q75 | 377 | ANALYZED_WITH_PRESET_GATES | 0.0381 | -0.0128 |
| ZS062_Q25 | 260 | ANALYZED_WITH_PRESET_GATES | 0.0205 | — |
| ZS062_Q75 | 297 | ANALYZED_WITH_PRESET_GATES | 0.0496 | — |

ZS059_Q75 dépasse le seuil temporel ASC fixé : résidu maximum 5,340 ms contre 5 ms autorisés, malgré la concordance électronique brute–NWB. Le seuil n'a pas été modifié. ZS061_Q25 conserve la concordance des événements mais échoue au critère strict d'égalité du nombre de spikes pour deux unités. Le calcul comportemental reste admissible ; les prédicteurs neuronaux restent exclus de l'analyse prévue pour cette session.

Le diagnostic de ces deux unités retrouve exactement l'export par arrondi à la milliseconde puis dédoublonnage : 9608 → 9607 et 60010 → 59991 événements. Le [code de packaging identifié](https://github.com/AllenNeuralDynamics/LC-beh-physiology-analysis/blob/fdee4a650c1c9687564c44c422a56838aca8e3a7/code/data_management/build_merged_nwb.py) supprime les timestamps identiques. C'est une transformation de l'export, pas une dérive neuronale démontrée. Ce diagnostic ne remplace pas rétroactivement le critère strict préspécifié.

Quatre sessions nouvelles passent les critères comportementaux et donnent un gain positif pour le passé des récompenses après séparation des indices. Une seule session nouvelle fournit une estimation neuronale selon tous les critères temporels/de classes : le gain y est négatif. Les autres contrastes restent non estimables ou privés du prédicteur neuronal. Les blocs, pertes et benchmark à intercept seul sont conservés ; aucune valeur p ni conclusion de population.

## Les léchages exportés ne passent pas le contrôle prévu

Sur les six fichiers accessibles, aucun ne passe le contrôle simultané gauche et droite avec le port 3 selon le seuil fixé. Les taux d'appariement gauche restent élevés, mais incomplets. Dans 350 des 354 événements « gauche » non appariés, le timestamp correspond à une valeur TTL 8 du port 0, distinct du port des contacts candidats. Ce constat numérique ne prouve pas à lui seul le câblage physique ni l'origine exacte de chaque étape d'import.

Le [code MATLAB de prétraitement consulté](https://github.com/JeremiahYCohenLab/sueAnalysis/blob/eeb8493190efe9602bec4814aa3a1c8bf4490852/matlabCode/operantMatching/preprocessing/generateSessionData_nL_operantMatching.m) définit les contacts droite/gauche par valeurs 2/8 et filtre les valeurs TTL sans utiliser le port. Cela rend plausible une ambiguïté entre ports. Le commit consulté n'est pas identifié comme celui ayant créé ces données ; aucune accusation d'erreur de l'étude n'est déduite de cette concordance.

Le contraste affecte seulement 0 à 4 fenêtres préalables de deux secondes par fichier dans la comparaison directe des comptes gauche exportés/bruts, sans nettoyage additionnel des bruts. Son impact doit donc être quantifié, pas amplifié. Les contacts NWB sont néanmoins écartés de ML/MLN conformément à la règle fixée. Aucune analyse corrigée au gré du résultat n'est substituée à cette analyse.

## Pupille et autres mouvements

Le diamètre pupillaire est présent dans plusieurs NWB et son unité est le pixel. Son inventaire de valeurs finies, d'horodatages et de monotonie est conservé. Le code exact pupil_utils du packaging examine la confiance DLC, supprime ou interpole certains segments et aligne des images sur les indices. La validation indépendante de l'horloge caméra reste à faire ; la pupille n'entre pas dans les modèles. Un contact de léchage ne mesure pas tous les mouvements, et le diamètre pupillaire ne suffit pas à attribuer un état affectif ou un taux de noradrénaline.

## Couplages et prochaine épreuve

Le candidat choix gauche/droite–historique de récompenses reste utile dans les sessions comportementales admissibles, observationnellement. La variante activité préalable–présence de choix ne reçoit pas de soutien prédictif nouveau dans l'unique session neuronale estimable. Le contrôle de mouvement via les contacts NWB n'est pas validé.

La prochaine épreuve consiste à vérifier les événements électroniques du seul port 3 contre les léchages du journal ASC, avec la transformation d'horloge déjà testée. Si la concordance passe un critère fixé avant calcul, construire une mesure distincte de contacts candidats bruts, sans réécrire les données des auteurs. Tester ensuite les modèles avec/sans ces mesures. Garder cette étape distincte des résultats v0.6 et conserver les ambiguïtés physiques.

Toutes les sessions manquantes, exclues, déjà vues et non estimables figurent dans les résultats. Les huit positions ne sont pas huit animaux ni huit validations nouvelles. Aucune émotion ou conscience n'est inférée ; aucune intervention biologique ou publication externe n'a eu lieu.

Sources : [DANDI 001950](https://dandiarchive.org/dandiset/001950/draft), [dépôt LC](https://github.com/AllenNeuralDynamics/LC-beh-physiology-analysis), [dépôt sueAnalysis](https://github.com/JeremiahYCohenLab/sueAnalysis). Sources brutes, sélection, critères et empreintes sont archivés dans analyses/v0.6.
