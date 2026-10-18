# POLY v0.54 — animaux, traitement temporel et vérification indépendante

Le tableau S10 liste 21 souris électrophysiologiques, dans des expériences distinctes. L'identification dopaminergique compte cinq souris : 3/3/16/12/9 cellules identifiées, total 43. La sélection conserve 40 neurones ; l'affectation des trois exclus et les latences individuelles ne sont pas fournies par ce tableau. On ne reconstruit donc pas cinq moyennes animales à partir des deux moyennes globales.

S10 construit des PSTH à bins de 1 ms avec convolution de type potentiel postsynaptique ; la nouvelle étude utilise des bins de 25 ms et des taux calculés depuis les intervalles entre événements. Le pic dépend potentiellement de ces traitements et de l'agrégation. Le détail de la recherche du pic S10 reste ouvert. Aucun décalage forfaitaire n'est appliqué pour « corriger » les filtres. [Article S10 et tableau supplémentaire](https://www.nature.com/articles/nature14855).

La nouvelle ANOVA de v0.53 est vérifiée par statsmodels AnovaRM : F=44,495562, concordance avec le calcul matriciel. Cela vérifie le calcul statistique sous l'alignement des lignes, pas l'identité des souris ni la méthode des pics. La correction GG conserve les valeurs déjà obtenues ; les résultats ne sont pas refaits sur un autre jeu de données.

## Bilan de cette passe prolongée

Huit opérations concrètes : unité de Fig9i vérifiée ; 24 valeurs extraites ; quatre estimations avec incertitudes conditionnelles ; six contrastes ; ANOVA/GG reproduite ; contrôle par logiciel indépendant ; acquisition du tableau animaux S10 ; audit des traitements temporels des deux études.

Le pic neuronal indépendant est 110,26 ms (SEM 9,77 ; IC95 conditionnel 85,15–135,37 ms, n=6 selon légende). Le pic de variation du léchage est 158,50 ms, celui de force 232,48 ms, inversion de force 78,08 ms. Ce sont quatre repères après US, pas quatre maillons d'une propagation suivie ni une chaîne émotionnelle. Les différences intraétude ne prouvent pas à elles seules une cause.

Toujours aucune moyenne interétudes : S10 présente des cellules sélectionnées et la nouvelle étude des populations par souris ; groupes d'attente et états ne sont pas harmonisés, erreurs S10 et temps physique de récompense restent incomplets. La ressemblance numérique ne ferme pas ces trous.

Suite utile : données individuelles S10 et identité des exclus ; conventions de pic et délai commande→récompense ; conditions d'attente/satiété dans la candidate. Les demandes auteurs déjà envoyées ne sont pas dupliquées. Faits, calculs, incertitudes et hypothèses restent distincts. Recherche hors canon, socle v0.22 inchangé, aucune nouvelle conception ni fusion émotion/conscience.
