# WHR et Afrobarometer — fenêtres et poids

WHR met à disposition les évaluations de vie moyennées sur trois années, les IC à 95 % et les contributions explicatives du tableau de classement. Les données Gallup supplémentaires ne sont pas toutes librement accessibles. Les fenêtres successives se chevauchent : elles ne représentent pas des répétitions annuelles indépendantes. La moyenne de pays ne devient pas une moyenne des habitants du monde. [Données officielles WHR](https://www.worldhappiness.report/data-sharing/).

Afrobarometer Round 9 : le code de l'analyse existante utilise withinwt_hh pour les proportions nationales et withinwt_ea en sensibilité. Aucun total continental n'est calculé. Les poids Combinwt recommandés pour des analyses multinationales ne sont pas automatiquement des poids de population continentale. Les terrains nationaux doivent être datés séparément. [Méthode de sondage](https://www.afrobarometer.org/surveys-and-methods/sampling/).

Q7A/Q7B : insécurité/crainte du crime au cours de l'année passée, pour soi ou la famille. Q86A : confiance envers les autres citoyens. Q56C : perception d'une aide communautaire disponible pour les problèmes mentaux ou émotionnels ; ni symptômes personnels ni soins reçus. withinwt_hh incorpore la sélection du ménage et le nombre d'adultes ; les codes spéciaux restent exclus selon l'item. [Codebook officiel, pages PDF 43 et 84](https://www.afrobarometer.org/wp-content/uploads/2025/07/AB_R9.MergeCodebook_25Jun24.final_.pdf).

Ces variables enrichissent le contexte social et les perturbations possibles. Leur couplage causal avec une mesure biologique reste une hypothèse. Les 156 comparaisons antérieures ne sont pas recalculées.
