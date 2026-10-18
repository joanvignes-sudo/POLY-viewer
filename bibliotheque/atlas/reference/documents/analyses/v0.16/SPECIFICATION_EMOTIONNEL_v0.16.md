# Spécification v0.16 — participation et stabilité, avant calcul

Conserver les partitions véhicule/test et paramètres v0.14. Pour les douze animaux chimiogénétiques, construire une ligne par CSplus : participation = exactement un côté avec issue finie, absence = aucun côté fini, ambigu = deux côtés finis, exclu explicitement. Ne pas interpréter un no-go comme une décision gauche ni comme une récompense négative observée.

Comparer trois prédictions de participation : constante Beta(1,1) sur apprentissage ; témoin précédent avec probabilités conditionnées au dernier état de participation, Beta(1,1) ; logistique ridge utilisant progression dans la session, dernière participation, proportion de participation sur vingt essais précédents, moyenne des récompenses observées sur vingt essais précédents (0,5 si aucune), et indicateur de récompense manquante au précédent essai. Aucun essai courant/futur ne fournit son issue au prédicteur. La progression emploie indice/100, sans normaliser par la longueur future de session.

Standardisation apprise sur sessions véhicule d'apprentissage ; pénalité ridge fixe 1 sur coefficients hors intercept ; estimation par log-vraisemblance pénalisée, aucun choix de pénalité sur test. Réinitialiser les historiques à chaque session. Rapporter log-perte et Brier pour tous les essais de participation, puis moyennes sessions→animaux séparées véhicule/agoniste. Rapporter convergences et taux d'absence, sans p sur essais ou bins.

Audit de stabilité des modèles v0.14 : pour chaque animal et modèle, évaluer sur les sessions de test TOUS les paramètres des trois départs déjà estimés uniquement sur entraînement. Ne pas sélectionner le meilleur sur test. Rapporter dispersion des pertes et cas où le gain méta contre Q statique change de signe entre départs appariés. Audit conditionnel aux choix/rewards enregistrés, non estimation hiérarchique originale.

Le modèle de participation est un contrôle descriptif de tâche, pas une explication de l'émotion ni une correction pharmacologique. Ne pas le coupler automatiquement aux simulations libres : ses entrées de récompense réelle deviendraient simulées et requerraient une autre validation.
