# Contacts candidats bruts v0.7

Spécification avant comparaison ASC–port 3 et avant les modèles avec contacts bruts. 4 octobre 2026. Les résultats v0.6 sont conservés sans modification.

Échantillon : quatre sessions médianes v0.3 et les positions supplémentaires v0.6 ; toute position déjà vue est marquée et toute absence/exclusion est conservée. Ne pas ajouter des sessions selon les effets. ZS060_Q25 est le fichier de développement déjà connu.

Construire les transitions montantes des bits 8 (gauche candidat) et 2 (droite candidat) du seul port 3 de Events.nev. Les valeurs TTL des autres ports sont exclues. Les appellations gauche/droite restent conditionnelles jusqu'à la comparaison avec le journal ASC.

Extraire les lignes L: et R: avec un timestamp entier du journal ASC. Les convertir en secondes et appliquer l'horloge affine de la session ajustée sur les indices de la première moitié en v0.4/v0.6. Limiter aux bornes Starting/Stopping Recording. Pour chaque côté, examiner les appariements réciproques ASC→TTL et TTL→ASC au seuil de 5 ms : exiger ≥99 % dans les deux directions. Documenter aussi les appariements multiples ; ce contrôle ne prouve pas la latence physique du capteur. Ni seuil, ni bits, ni session ne seront remplacés en fonction du résultat.

Garder les contacts bruts sans nettoyage additionnel ni suppression de rebonds. Covariables : comptes gauche/droite dans [−2 s,0[ autour du début d'indice électronique enregistré. Ces contacts ne représentent pas tous les mouvements. Aucun événement postérieur à l'indice n'est un prédicteur.

Seulement si les critères d'horloge, de concordance brute et de couverture passent : réévaluer le modèle de présence de choix après CS PLUS v0.5. M0 histoire/temps ; M1=M0+spikes préalables ; ML=M0+contacts bruts ; MLN=ML+spikes préalables. Même pénalité, mêmes exclusions et cinq blocs temporels. Les unités sont des covariables simultanées, jamais des répétitions animales. Les sessions échouant au nombre strict de spikes ne fournissent pas M1/MLN. Pas de pupille ni de mouvement vidéo à ce stade.

Comparaison primaire descriptive : perte ML−MLN. Les autres pertes, les effectifs de non-choix par bloc et un modèle à intercept seul restent visibles. Décrire les gains par session, les contradictions et les cas non estimables. Une amélioration sous ce contrôle ne constituerait ni preuve causale, ni preuve affective, ni généralisation populationnelle. Les erreurs ne doivent pas être remplacées par des zéros.
