# POLY — extension thermique, recherche v0.31

Le corps de Postlethwaite et al. décrit deux groupes de températures : 25→35 °C et 30→38 °C, avec stabilisation de dix minutes. Deux neurones couvrent toute la plage : les groupes ne sont donc pas démontrés indépendants. Les paramètres sont extraits de moyennes d'au moins dix événements à 0,2 Hz ; ces événements ne sont pas dix neurones. Les décroissances sont ajustées par deux exponentielles. Le corps donne n=6 pour les contrastes appariés ; la légende antérieure à sept cellules reste à rapprocher du sous-ensemble exact. [Source primaire, section EPSC évoqués](https://pmc.ncbi.nlm.nih.gov/articles/PMC2075387/).

Quatre contrastes supplémentaires 30→38 °C sont enregistrés. Pour un écart de 8 °C, le Q10 de vitesse est (τ30/τ38)^(10/8), et non simplement τ30/τ38. Ce résumé de constantes effectives n'est pas un paramètre moléculaire AMPA ni le Q10 du modèle auteur.

- fast_EPSC_decay_ms : différence -0.1400 ms ; Q10 ponctuel 1.5740.
- slow_EPSC_decay_ms : différence -0.8600 ms ; Q10 ponctuel 1.2843.
- rise_10_90_ms : différence -0.0400 ms ; Q10 ponctuel 1.2219.
- artifact_to_onset_ms : différence -0.1900 ms ; Q10 ponctuel 1.3967.

Pas d'IC reconstruit : la covariance et la définition exacte des erreurs manquent. Les valeurs du temps de montée sont conservées telles que rapportées, sans imposer la même accélération que les pourcentages moyens appariés des auteurs. Ratio de moyennes et moyenne des ratios ne sont pas identiques.

Cette passe complète le protocole et les contrastes ; elle ne résout pas l'âge, les unités animales, ni les données originales par cellule de cette étude. Aucun regroupement interétudes ou ajout au canon. Quatre axes toujours ouverts, socle public non édité ; dernier contrôle des 20 empreintes conservé de v0.30. NHANES déjà répliqué n'est pas recalculé.
