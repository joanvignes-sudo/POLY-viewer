# Parcours géométriques dans le squelette H01 · v0.113

## Un nouvel examen de données déjà acquises

Le squelette source du segment 1072605926 contient 25 895 sommets, 25 850 arêtes, 45 composantes connexes et aucun cycle. Il forme une forêt ; ses composantes sont conservées. Leurs numéros dans le lecteur sont des numéros calculés, triés par taille, sans identité anatomique attribuée.

Les 1 571 lignes du catalogue source sont projetées vers l’arête la plus proche de leur extrémité appartenant à la cellule : post pour une entrée déclarée, pre pour une sortie déclarée. Le repère source, le segment retenu, la fraction le long de l’arête, la projection, l’écart en µm et le rayon source interpolé sont conservés.

Ce calcul n’établit pas que l’arête la plus proche est la branche biologiquement reliée au site. Les points source peuvent être sur une surface tandis que le squelette décrit un axe. L’écart point–axe n’est pas une borne d’erreur ni un score de confiance. Aucun seuil arbitraire de rattachement n’est appliqué.

## Lecture d’un parcours

[trajets.html](trajets.html) choisit deux repères A et B. Le parcours entre leurs projections suit uniquement les arêtes de la même composante. Les portions d’arêtes aux extrémités sont retenues à leur fraction exacte ; les décalages point–axe, dessinés en pointillés, sont exclus de la longueur.

La position de lecture est exprimée en µm de longueur cumulée. Il n’y a ni vitesse, ni délai, ni animation assimilée à un signal. L’ordre A → B est l’ordre de lecture choisi. Aucun rôle axone/dendrite n’est déduit de pre/post. La longueur est celle d’une polyligne source, pas une mesure certaine de longueur de câble anatomique.

Si les projections sont sur deux composantes séparées, aucun parcours n’est produit. Le curseur est désactivé et l’export garde une longueur nulle au sens absent (`null`), sans liaison inventée. Un parcours entre deux projections identiques a une longueur géométrique 0 ; ce cas est distinct d’un parcours absent.

À l’ouverture depuis le catalogue, A est le repère choisi. Quand B n’est pas explicitement fourni, un repère du même morceau est proposé si possible. Les repères des autres morceaux restent sélectionnables. Les six repères disposant d’un détail natif gardent leur lien vers celui-ci.

## Vérifications

- Projections : recherche exhaustive vectorisée sur toutes les arêtes, puis vérification des 1 571 minima par une recherche indépendante à partir d’un arbre spatial de sommets. Les candidats sont bornés par la longueur maximale des arêtes, de façon à ne pas écarter une arête potentiellement plus proche. Écart numérique maximal conservé dans le rapport.
- Parcours : 37 cas comparés à SciPy Dijkstra après subdivision des arêtes par deux sommets virtuels. Cas sur une composante, composantes séparées et parcours de longueur zéro inclus.
- Interface : sélection, permutation A/B, curseur, partage, export, mobile, absence de 3D, refus d’une source altérée et reprise après rechargement.

L’export contient les lignes source, les projections, les arêtes concernées, les points et la longueur du parcours, les empreintes des sources et `biological_time: null`. Il indique explicitement que le rattachement anatomique n’est pas confirmé.

## Sources et limites

Sources H01 acquises aux étapes antérieures, Lichtman laboratory / Harvard et Connectomics at Google, CC BY 4.0. [Publication des données](https://h01-release.storage.googleapis.com/data.html) ; Shapson-Coe et al., Science (2024), doi:10.1126/science.adk4858.

[Provenance](assets/h01-paths/PROVENANCE.json) · [Projections et composantes](assets/h01-paths/PROJECTIONS.json) · [Comparaisons numériques indépendantes](assets/h01-paths/INDEPENDENT_VALIDATION.json) · [Catalogue source](assets/h01-evidence/CATALOG.json) · [Crédits](assets/h01-synapses/CREDITS.md).

Aucune donnée clinique, nouvelle chaîne physiologique, latence ou causalité n’est déduite. Aucun recalage entre prélèvements. Les fichiers scientifiques canoniques restent inchangés.
