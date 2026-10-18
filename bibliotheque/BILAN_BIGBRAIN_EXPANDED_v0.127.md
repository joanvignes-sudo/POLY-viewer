# BigBrain · zone de raccord élargie · v0.127

Le raccord reste un aperçu numérique local, superposé au cortex source inchangé. Une nouvelle option permet d’élargir son contour et de comparer le centre avec la bordure ajoutée.

## Résultats

Les 22 voisinages encore signalés en v0.126 passent de quatre à dix faces sources. Les 64 autres aperçus restent identiques. Une couronne supplémentaire permet de subdiviser les anciennes arêtes extérieures sans fissure topologique interne.

Les 26 oppositions ponctuelles restantes dans les quatre faces centrales ne sont plus détectées dans les propositions retenues. Toutefois huit oppositions subsistent dans les nouvelles bordures de quatre aperçus : `context-left:46602` (2), `context-left:287262` (4), `context-left:287279` (1), `context-right:42188` (1). Les 18 autres voisinages élargis ne présentent plus d’opposition aux centres testés. Une absence d’alerte au centre ne valide donc pas toujours toute la zone élargie.

Les 86 propositions contiennent 7 152 triangles. Les anciens sommets sont conservés bit pour bit dans leurs coordonnées locales float32. Le nouveau contour reste figé pendant le raffinement. Les nouveaux sommets sources sont contraints aux coordonnées enregistrées du cortex recalé avant stockage local ; l’arrondi externe maximal est de 0,000000222 mm. Aucune égalité mathématique parfaite des coordonnées stockées avec le cortex global n’est revendiquée.

Le déterminant reste positif aux centres testés. L’écart numérique maximal aux centres atteint 0,3878 mm sur la région désormais plus étendue. Ce nombre ne se compare pas directement au maximum calculé sur la zone plus petite et ne mesure pas une erreur de recalage anatomique.

## Méthode

Ajouter une seule fois toutes les faces sources situées de l’autre côté des six arêtes externes du voisinage précédent. Vérifier que leur union est un disque : indices d’arêtes partagés, deux incidences au maximum, contour unique fermé, caractéristique d’Euler égale à un. Aucune des 22 extensions n’a été rejetée par ce contrôle.

Garder les positions locales existantes. Évaluer les nouveaux milieux d’arêtes par la même chaîne de transformations publiées, sans extrapolation. Le nouveau contour ne peut être ni subdivisé ni déplacé ; les anciennes arêtes externes, devenues intérieures, peuvent être divisées avec leurs deux triangles incidents.

Tester au maximum 16 étapes, 5 000 sommets et 10 000 triangles par proposition. Retenir l’essai minimisant, dans cet ordre, les oppositions de la face initiale, celles des quatre faces centrales, celles de toute la région, puis l’écart maximal au centre. L’historique et les alertes de la couronne sont conservés ; elles ne sont pas omises pour améliorer le bilan du centre.

Un contrôle indépendant reconstruit les normales par différences finies de la transformation. Il vérifie également les surfaces natives par face source, les orientations et les indices des coutures, les anciens sommets et le nouveau contour.

## Utilisation

Dans **Inspecter les facettes → Subdiviser**, activer le raccord, son raffinement progressif, puis **Élargir la zone de raccord**. Cliquer sur **Voir la subdivision de face**. Le centre apparaît en bleu, la couronne ajoutée en gris et le triangle source en or. Les commandes précédentes restent disponibles pour la comparaison. Le lien et l’export conservent le mode et les résultats distincts du centre et de sa bordure.

## Limites et suite

Les comptes sur des triangulations ou des régions différentes ne sont pas des estimations de précision anatomique. Les contrôles au centre ne certifient pas tout l’intérieur, le volume, l’absence d’intersections ou l’injectivité globale. Les propositions indépendantes peuvent se recouvrir et ne remplacent pas le cortex complet.

Les quatre nouvelles bordures signalées demandent encore un raccord plus étendu ou une autre construction géométrique. Aucune nouvelle microstructure observée, activité neuronale ou durée biologique n’est introduite. Les validations anatomiques indépendantes et les essais auprès de spécialistes restent ouverts.

## Sources et droits

[Provenance, fichiers et historique des essais](assets/bigbrain-expanded-v0127/PROVENANCE.json). [Méthode précédente](BILAN_BIGBRAIN_ADAPTIVE_v0.126.md). BigBrain : Amunts et al., [Science 2013](https://doi.org/10.1126/science.1235381). Surfaces : Wagstyl et al., [PLoS Biology 2020](https://doi.org/10.1371/journal.pbio.3000678). Recalage : Xiao et al., [Scientific Data 2019](https://doi.org/10.1038/s41597-019-0217-0). Crédits McGill / Forschungszentrum Jülich conservés. Dérivés BigBrain CC BY-NC-SA 4.0 ; conditions des transformations conservées dans les provenances référencées.
