# Spécification fixée avant les nouveaux calculs — v0.11

## Audit sérotonine

Reconstituer les sept colonnes déterministes du CSV S13 avec le code de chargement fourni ; ne pas prétendre reproduire les p de permutation sans recalcul complet. Conserver l'identité animal/session/unité. Vérifier ordre des événements, durée indice–récompense, convention milliseconde du code et exclusions du chargeur. Le README n'explicite pas cette unité ; le code la suppose. Les fichiers exportés ne fournissent pas de validation indépendante du signal électronique.

## Comparaison observationnelle sur essais ultérieurs

Par session/unité admissible, cible : nombre de spikes bruts dans [-1000,0) ms avant indice. Le premier essai est exclu car son baseline reconstruit n'est pas complet. Historique : seules les cinq récompenses antérieures, collecte définie par le chargeur auteur. Comparer Poisson M0 (constante et rang d'essai), MV (+moyenne des cinq récompenses), MU (+p(1-p)), MVU (+les deux), puis MVC (+nombre de contacts avant indice). Contacts : uniquement les événements de l'essai précédent dans la fenêtre baseline, si cette fenêtre est couverte par ses événements et si l'espacement entre indices est suffisant ; sinon MVC non estimable.

Cinq blocs de test chronologiques, chacun 10 % des essais, après un premier bloc d'apprentissage de 50 %. Standardisation sur apprentissage seul, pénalité L2 fixée à 1 sauf constante ; aucun choix de paramètre guidé par les résultats. Perte : déviance Poisson moyenne, sans traiter les unités d'une session comme indépendantes. Résumer d'abord les différences par session, puis par animal. Pas de p de population sur les unités regroupées. Ne pas confondre ces modèles avec une réplication complète du code prospectif de valeur : ils interrogent un couplage local d'historique vers activité pré-indice.

Amendement d'audit avant ajustement : exclure les cinq premiers essais, car leur historique du chargeur contient une valeur initiale synthétique de 0,45. Pour MVC, exiger la couverture temporelle des contacts sur chaque essai retenu ; sans cette couverture, conserver les modèles sans contacts et marquer MVC non estimable.

## Reproduction partielle du contraste prospectif auteur

En parallèle du test chronologique, exécuter les sept familles du notebook fig4D sur une répétition de cinq plis, graine 42, mêmes classes et hyperparamètres initiaux. La publication en fait dix répétitions ; ce calcul sera donc explicitement partiel. Les fonctions de valeur et d'adaptation pourront être accélérées si leur sortie correspond au code fourni à 1e-11 sur les cas de contrôle ; sinon garder le code d'origine. Ne pas présenter les essais mélangés des mêmes neurones comme une validation sur de nouveaux animaux. Aucun test de significativité fondé sur les cinq plis dépendants.

Extension après le pilote : compléter les dix répétitions du notebook, mêmes paramètres et mélanges, sans modifier la famille de modèles. Instrumenter les drapeaux de convergence. Compléter aussi toutes les permutations circulaires du CSV pour vérifier sa dernière colonne.

## Respiration

Auditer les six fichiers MAT, plages, manquants, identifiants et appariements patient/canal. Calculer trois contrastes prévus : anesthésie automatique→ventilation appariée ; ventilation appariée→lente/profonde ; éveil→sommeil. Pour chaque paire, retenir les mêmes sites chez le même participant, vérifier les régions, puis moyenner par participant. Publier les différences individuelles et médianes ; Wilcoxon signé exact comme sensibilité, correction Holm pour ces trois contrastes. Les sites ne sont pas des participants. Les conditions sont composites : ces contrastes ne localisent pas une voie et ne mesurent pas un affect.

Le script auteur de S18 emploie un test de rangs indépendant pour éveil/sommeil ; notre contraste apparié constitue une analyse différente explicitement annoncée. Ne pas reproduire le modèle hiérarchique MATLAB sous un autre nom. Aucune sélection des seuls sites significatifs.

## Perturbations corporelles

Pour chaque expérience : intervention, contrôle, ordre/aveugle, effectif et chevauchement, mesure, exclusions, explications éliminées localement et alternatives survivantes. Séparer CO₂, isoprotérénol, stimulation cardiaque et ventilation. N'introduire aucun raccord de voie entre ces préparations par simple juxtaposition.
