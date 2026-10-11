# Perturbation du modèle de choix — extension v0.14

Extension exploratoire après les résultats de la cohorte neuronale, avant calcul de la cohorte d'intervention distincte : six DREADDs et six mCherry. Les paramètres ne sont jamais transférés entre ces cohortes. Le modèle est une reconstruction ponctuelle, pas la reproduction du modèle Stan ni de ses simulations hiérarchiques.

Pour chaque animal, prendre les premiers floor(0,6 × nombre de sessions véhicule), au moins une, comme entraînement ; garder au moins une session véhicule évaluée. Trier sur les dates encodées dans les identifiants. Évaluer les sessions véhicule restantes et seulement les sessions agoniste datées après la dernière session d'entraînement. Documenter les sessions agoniste écartées pour ce motif. Ignorer CSminus et essais sans choix pour la vraisemblance des choix ; maintenir leur inventaire. La session sans probabilités peut servir au modèle de choix si choix/récompenses sont complets et binaires : les probabilités expérimentales ne sont pas utilisées comme prédicteurs. Exclure une session si ses valeurs observées sont invalides.

Estimer StaticQ et MetaReconstruction avec les mêmes conventions, bornes, trois initialisations et critères que la cohorte neuronale v0.14. Sélection des départs sur entraînement seul. Ajouter constante et choix précédent appris sur entraînement. Sur toutes les sessions évaluées, paramètres figés et états mis à jour avec les choix/issues antérieurs ; prédiction conditionnelle, pas simulation libre des choix.

Construire une ablation de la reconstruction méta : epsilon fixé à zéro, taux négatif fixé à sa médiane calculée sur les traces de l'entraînement véhicule ; conserver le taux positif, l'oubli, la température et le biais appris. Aucun refit sous agoniste. Rapporter normale−ablation en log-perte par session, puis animal, séparément par condition et groupe. Un gain positif favorise l'ablation. Aucune valeur de p sur essais/sessions ; ne pas conclure qu'une variable biologique latente a effectivement été supprimée.

Les deux conditions ne sont pas des observations indépendantes du même animal ; ordre/calendrier et nombres de sessions restent déséquilibrés. Les groupes restent séparés. Une comparaison véhicule/agoniste de ces pertes ne devient pas automatiquement un effet causal de traitement.

Source : [Grossman et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC8825708/), [données distribuées](https://doi.org/10.5281/zenodo.14628985).
