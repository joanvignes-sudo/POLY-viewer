# v0.18 — domaine numérique et conservation, avant calcul

Rejouer les simulations DR13 v0.15 normales avec paramètres, probabilités, graines et nombres d'agents exacts des résultats principal et sensibilité. Ne pas ajuster, remplacer, borner ni exclure les états avant leur diagnostic. Vérifier que le nombre de sorties de domaine reproduit exactement celui déjà enregistré. Rapporter composantes concernées, première sortie, état précédent, erreur de prédiction et coefficient effectif de mise à jour négative. Conserver le taux négatif latent séparément de Q et epsilon.

Dans notre reconstruction, lorsque Q choisi est positif, récompense=0 et epsilon dans [0 ; 1], Q suivant = Q × (1 − taux_négatif × (1 − epsilon)). Un coefficient effectif >1 suffit à rendre Q négatif. Vérifier cette identité sur les premières sorties, sans l'attribuer automatiquement au modèle original. Les paramètres bornés ne garantissent pas seuls les états bornés. Aucune nouvelle correction du modèle n'est autorisée implicitement par ce diagnostic.

Contrôler les archives de recherche v0.13 à v0.17 par leurs manifestes, les cinq MAT humains durables v0.14 et le snapshot auteur S24 par leurs SHA256, ainsi que les vingt fichiers suivis du socle v0.22. Vérifier les fichiers dans le ZIP S24 contre le manifeste auteur. Conserver les erreurs éventuelles ; ne pas annoncer comme contrôlé un fichier absent. Le manifeste Git ne constitue pas une sauvegarde externe des MAT/ZIP ignorés.

Établir un index des précisions entre bilans : fenêtres larges et nominales, participation enregistrée et choix conditionnels, gains prédictifs et simulation libre, validation interne et horloges physiques. Aucun ancien bilan n'est réécrit pour effacer ses résultats.
