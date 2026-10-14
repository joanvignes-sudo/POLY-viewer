# BigBrain · orientation et contacts · v0.128

Cette étape ferme le contrôle ponctuel d’orientation des 86 aperçus, et ajoute un diagnostic indépendant des contacts. Elle ne remplace pas le cortex source.

## Résultats

Les quatre voisinages encore signalés en v0.127 sont prolongés à 19 faces sources. Les 82 autres conservent leur région. Aucun des 86 candidats ne présente d’opposition d’orientation ou de déterminant non positif aux centres testés. La topologie locale et les anciens sommets stockés sont préservés.

Le premier contrôle exact des contacts, appliqué aux seuls triangles locaux stockés, détecte 693 paires dans 31 aperçus. Les essais ciblés en retiennent 631 dans 25 aperçus, sans réintroduire d’opposition ponctuelle. Six aperçus supplémentaires ne présentent plus de contact détecté. Les candidats retenus totalisent 7 486 triangles. Ces comptes concernent des triangulations différentes et ne sont pas des mesures de gravité, d’erreur anatomique ou d’amélioration clinique.

Les contacts sont autorisés uniquement lorsqu’ils restent sur un sommet ou une arête réellement partagés par les indices des deux triangles. Tout autre toucher ou recoupement est signalé. Des calculs entiers exacts sont possibles car les coordonnées float32 stockées sont des nombres rationnels dont le dénominateur est une puissance de deux. Une seconde méthode rationnelle, utilisant les plans et les coordonnées barycentriques, vérifie le premier détecteur sur les paires signalées et un échantillon de paires supplémentaires.

## Essais de raccord

Une couronne supplémentaire termine le contrôle d’orientation des quatre dernières régions. Pour les contacts, marquer la plus longue arête intérieure de chaque triangle signalé, partager son nouveau milieu avec les deux triangles incidents et appliquer les mêmes transformations publiées. Le contour reste figé ; tous les anciens sommets restent bit pour bit identiques. Recalculer l’orientation et les contacts après chaque étape.

Retenir le meilleur candidat dans l’ordre : oppositions de la face initiale, oppositions de toute la région, nombre de paires en contact, écart maximal au centre. Les comptes ne mesurent pas l’étendue physique des contacts. La recherche est bornée à 16 étapes, 5 000 sommets, 10 000 triangles et cinq tentatives consécutives sans amélioration. Les essais qui aggravent le résultat restent dans l’historique et ne sont pas appliqués.

## Origine des contacts à examiner

Sur les 119 paires de faces sources associées aux premiers contacts, 46 présentent déjà un contact dans la géométrie native publiée, contre 22 dans les triangles grossiers recalés. Deux formulations exactes concordent sur ces vérifications. Ce sous-ensemble n’est pas un audit de tout le cortex.

Une comparaison en float64, avec et sans contrainte des coins aux coordonnées recalées stockées, retrouve les 693 paires initiales. Elle ne recherche pas d’autres contacts et ne démontre pas l’injectivité du champ. Il n’est donc pas justifié d’attribuer automatiquement ces contacts au seul stockage float32, ni de corriger les surfaces publiées sans interprétation indépendante.

## Vue et export

Le mode **Comparer le dernier raccord testé** conserve le centre initial en bleu et ses couronnes en gris. Choisir une paire dans **Examiner un contact** affiche les deux triangles en corail. La sélection est partageable par le lien. Les coordonnées, indices, étapes et contacts sont exportables avec leur provenance. Les autres modes restent disponibles pour la comparaison.

## Limites

Les normales et déterminants sont contrôlés aux centres, pas sur tout l’intérieur ou le volume. Le diagnostic de contacts porte sur chaque aperçu stocké séparément, sans comparaison entre aperçus ni avec le cortex global. Il ne certifie ni le champ continu, ni l’affichage GPU, ni la validité anatomique. Les contacts ne sont pas des anomalies biologiques établies. Aucune nouvelle microstructure acquise, activité neuronale ou durée n’est ajoutée.

La prochaine validation scientifique nécessite une interprétation indépendante des surfaces et du recalage. [Le dossier de relecture est prêt](REVUE_INDEPENDANTE_v0.128.md) ; cette relecture n’est pas réalisée.

## Sources

[Provenance et essais](assets/bigbrain-conform-v0128/PROVENANCE.json) · [Pièces de contrôle](assets/bigbrain-audits-v0128/PROVENANCE.json). BigBrain : Amunts et al., [Science 2013](https://doi.org/10.1126/science.1235381). Surfaces : Wagstyl et al., [PLoS Biology 2020](https://doi.org/10.1371/journal.pbio.3000678). Recalage : Xiao et al., [Scientific Data 2019](https://doi.org/10.1038/s41597-019-0217-0). Crédits McGill / Forschungszentrum Jülich conservés. Dérivés BigBrain CC BY-NC-SA 4.0 ; conditions des transformations dans les provenances référencées.
