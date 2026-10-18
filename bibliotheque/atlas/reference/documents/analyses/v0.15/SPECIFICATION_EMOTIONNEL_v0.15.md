# Spécification v0.15 — alignement temporel humain

Cette extension suit v0.14, sans nouvelle conception. Avant les calculs, fixer les contrôles suivants sur les cinq fichiers publics bruts S24 et les exports comportementaux du commit conservé.

Vérifier l'identité des IDs. Comparer les délais réponse moins stimulus bruts aux délais comportementaux exportés pour chaque paire de champs temporels disponible. Les champs numériques exportés comportementaux sont convertis de millisecondes en secondes selon le code auteur, puis un offset estimé sur la première moitié des essais est appliqué à la seconde moitié. Rapporter les résidus complets, médians et maximums séparément pour chaque champ ; ne pas choisir le meilleur champ pour le présenter comme une validation physique. Tester la pente descriptive sur la première moitié, sans la substituer à l'offset principal, et rapporter son erreur sur la seconde moitié.

Pour les courants, inventorier les intervalles >0,15 seconde, le nombre d'échantillons d'une fenêtre stimulus [−1 ; +5] secondes, et les débuts/réponses hors portée ou non finis. Une irrégularité ne prouve ni perte biologique ni erreur d'auteur. Ne pas interpoler les interruptions, ne pas recalibrer chimiquement.

Séparer quatre niveaux : IDs concordants ; temps internes concordants ; horloge physique validée ; conversion chimique reproduite. Les deux derniers restent ouverts sans preuves supplémentaires. Comparer des horodatages corrigés n'établit pas l'horloge originale.

Précision avant calcul : `onsets.dec` désigne un événement distinct de la réponse. Comparer également réponse attendue = `onsets.dec + data.rt1` et délai = `onsets.dec − onsets.stm + data.rt1`, sans assimiler les deux événements. Les vecteurs `rdk` sont des séquences de frames, exclus des comparaisons de champs scalaires.

Vérifier à nouveau la disponibilité publique du paquet Grossman original. Archiver les métadonnées ou erreurs d'accès et inventorier les fichiers de code si un téléchargement autorisé réussit. Aucun ajustement hiérarchique original n'est déclaré reproduit sans code, conventions et diagnostics.
