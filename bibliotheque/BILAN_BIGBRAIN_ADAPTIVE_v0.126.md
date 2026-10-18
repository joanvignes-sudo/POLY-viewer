# BigBrain · raffinement progressif expérimental · v0.126

La vue permet de comparer le raccord à quatre faces de v0.125 avec une subdivision progressive de ses arêtes intérieures. Le cortex source reste inchangé ; les deux méthodes restent accessibles.

## Résultats et portée

Les 86 aperçus sont contrôlés. Le raccord initial présente 42 oppositions ponctuelles dans 24 voisinages. Parmi les essais retenus, 26 oppositions persistent dans 22 voisinages. Deux voisinages supplémentaires passent donc le contrôle aux centres testés : `context-right:42186` et `context-right:270099`. Dix propositions retiennent une étape subdivisée ; les autres conservent le raccord initial. Le cas très mince `context-right:5535` passe de huit oppositions à une, sans devenir validé.

Les aperçus retenus comprennent 6 908 triangles. Tous leurs anciens sommets restent bit pour bit identiques dans leur stockage local float32 ; les six arêtes extérieures ne sont ni déplacées ni subdivisées. Les arêtes intérieures sont partagées et le voisinage reste un disque orienté dans le repère natif. Aucune opposition n’est détectée au centre des petits triangles issus de la face centrale ; aucune valeur non positive du déterminant n’est détectée aux centres testés.

Ces comptes portent sur des triangulations différentes. Leur diminution n’est ni un pourcentage de précision ni une preuve de meilleure correspondance anatomique. L’écart numérique maximal aux centres des aperçus retenus reste de 0,2793 mm. Les tests ponctuels ne certifient ni tout l’intérieur des triangles ni l’absence d’auto-intersection.

## Algorithme et reproductibilité

À chaque étape, pour chaque triangle dont la normale rendue s’oppose à la normale source transformée au centre, choisir sa plus longue arête native intérieure. Insérer son milieu natif, le transformer par les mêmes champs publiés de 2015 puis 2019, et partager ce sommet entre les deux triangles incidents. Si plusieurs arêtes d’un triangle sont marquées, les diviser successivement dans son ordre d’orientation natif. Le contour extérieur est exclu des divisions.

Recalculer les centres, les Jacobiennes physiques, les normales et les écarts pour tous les triangles de l’essai. Limiter la recherche à 16 étapes, 5 000 sommets et 10 000 triangles par aperçu. Retenir le meilleur essai dans l’ordre suivant : nombre total d’oppositions, nombre d’oppositions dans la face centrale, puis écart maximal au centre. L’historique de tous les essais est fourni, y compris les tentatives moins bonnes et la limite d’arrêt. Une absence de gain conserve la proposition précédente.

Les coordonnées natives synthétiques et l’identifiant du triangle source propriétaire sont livrés avec les coordonnées d’affichage et les indices. Ils permettent de reproduire les contrôles de surface, de contour et de normales. Les dérivées sont vérifiées séparément par différences finies du déplacement, sans réutiliser la routine de Jacobienne analytique.

## Utilisation

Ouvrir **Inspecter les facettes → Subdiviser**, activer **Raccorder les trois faces voisines**, puis **Tester le raffinement progressif du raccord**. Le bouton **Voir la subdivision de face** centre la vue. Désactiver le raffinement permet la comparaison avec v0.125. Le lien conserve le mode ; l’export précise l’étape choisie, les alertes, les indices et la provenance. La densité affichée reste celle de départ de la face centrale : les divisions adaptatives supplémentaires sont décrites par les nombres de sommets et de triangles.

## Ce qui reste à résoudre

La subdivision intérieure sous contour figé ne résout pas les 22 voisinages encore signalés dans les essais bornés. Cela ne prouve pas qu’aucune solution n’existe. Il faut tester une région plus étendue ou une triangulation différente, avec contrôle de ses nouvelles frontières, des intersections et des orientations. Un simple lissage qui masque les alertes n’est pas appliqué.

Les propositions indépendantes peuvent se recouvrir ; elles ne constituent pas un maillage global raccordé. Aucune nouvelle donnée anatomique acquise, microstructure, activité ou durée biologique n’est ajoutée. La validation anatomique indépendante et les essais auprès des spécialistes restent ouverts.

## Sources et droits

[Provenance, empreintes et historique des essais](assets/bigbrain-adaptive-v0126/PROVENANCE.json). [Méthode précédente et sources conservées](BILAN_BIGBRAIN_NEIGHBORS_v0.125.md). BigBrain : Amunts et al., [Science 2013](https://doi.org/10.1126/science.1235381). Surfaces : Wagstyl et al., [PLoS Biology 2020](https://doi.org/10.1371/journal.pbio.3000678). Recalage : Xiao et al., [Scientific Data 2019](https://doi.org/10.1038/s41597-019-0217-0). Crédits McGill / Forschungszentrum Jülich conservés. Dérivés BigBrain CC BY-NC-SA 4.0 ; conditions des transformations dans les provenances référencées.
