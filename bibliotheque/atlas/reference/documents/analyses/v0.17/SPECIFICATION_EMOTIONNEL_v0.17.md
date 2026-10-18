# v0.17 — fenêtres de réponse et adaptation causale, avant calcul

Conserver les 133 sessions d'apprentissage/test des partitions v0.14. Aucune nouvelle sélection selon les résultats. Statut enregistré = un côté avec issue finie ; absence si aucun ; ambiguïtés exclues des modèles de participation.

Diagnostic des léchages : rapporter deux fenêtres annoncées, [CSon ; CSon+1500] et [CSon+500 ; CSon+2000], en unités exportées, sous convention millisecondes compatible avec les constantes du chargeur et la durée de tâche publiée. La seconde teste un décalage de départ possible, pas une validation de l'ouverture matérielle. Conserver les résultats des deux, sans choisir le meilleur. Déterminer si la fenêtre dépasse trialEnd lorsqu'il est fini, et rapporter les léchages dans la fenêtre tronquée séparément. Les fins manquantes ne sont pas reconstruites. Réponse nominale à 1,5 s décrite dans la publication Grossman ; la synchronisation physique n'est pas validée.

Chez DR06 et tous les autres animaux, exporter chronologie, probabilités de récompense présentes, nombre de CSplus/CSminus, taux d'absence et métriques de léchage par session. Ces métadonnées ne suffisent pas à identifier un changement de matériel ou une cause pharmacologique.

Comparer des prédictions de participation adaptatives, sans nouvel ajustement : constante véhicule v0.16 ; état précédent v0.16 ; logistique v0.16 gelée ; estimateurs Beta(1,1) sur les 20 et 100 statuts de participation précédents dans la session. Au premier essai, utiliser la constante véhicule ; ensuite (succès+1)/(passés+2). Remise à zéro de l'historique en début de session. Les labels de l'essai courant ne sont utilisés qu'après sa prédiction. Rapporter toutes les fenêtres fixées, sans en choisir une sur le test.

Moyenner log-perte et Brier par session puis animal, séparer véhicule/agoniste. Les variantes adaptatives évaluent une règle d'adaptation au passé, sans effet causal du traitement ni explication émotionnelle. Ne pas les brancher au simulateur libre dans cette passe. Vérifier l'invariance des prédictions aux labels futurs et la concordance de la logistique gelée avec v0.16.
