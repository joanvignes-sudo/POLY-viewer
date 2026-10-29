# POLY — Profil CPU et normales d’affichage

29 octobre 2026. Développement local, sans changement des coordonnées source ni de la formule de déformation.

Le profil des quatre plus grandes surfaces de tronc (313202 sommets) à la phase illustrative 0,4 mesure séparément les positions, normales, sphère et boîte. Sur cette exécution Node, les médianes sont respectivement 10.188, 42.331, 5.916 et 3.005 ms. Les normales représentent 68.9 % de la somme des médianes. Cette somme n’est pas une mesure de durée de trame dans un navigateur.

## Changement

`indexed-display-normals.mjs` écrit directement les normales pondérées par aire dans le tableau Float32 d’affichage. L’ordre des triangles, les produits vectoriels et l’arrondi Float32 des accumulations suivent la méthode Three.js existante. Le lecteur de références utilise cette méthode lors de la création des géométries et des mises à jour de posture. L’attribut normal est réutilisé et son drapeau de mise à jour conservé. Les positions et indices ne sont jamais modifiés par cette méthode.

Les types, dimensions, chevauchements de buffers, valeurs non finies et indices hors limites sont contrôlés avant toute écriture. La méthode reste limitée aux géométries indexées Float32/Uint32 de ce lecteur ; elle ne remplace pas globalement les fonctions Three.js ni les autres bibliothèques.

## Vérification et mesure

- 1578 comparaisons octet par octet : les 526 pièces source réelles à trois phases graphiques 0, 0,4 et 0,9. Normales identiques à `computeVertexNormals`, positions et indices d’affichage inchangés, empreinte source conservée.
- Cas déterministes supplémentaires : sommets inutilisés, triangles dégénérés et répétés, zéros signés, cas aléatoires reproductibles, tableaux vides et entrées invalides.
- Sur les quatre surfaces du profil, 8 échauffements puis 25 essais alternés : médiane Three.js 38.019 ms, méthode scalaire 9.597 ms ; rapport local 3.96× pour les seules normales CPU.
- 133 tests Node passent ; suites `reference-interactions-browser` et `reference-region-browser` réussies sur ordinateur et émulation mobile, avec postures, courbes, retour aux sources et libérations.
- Scripts reproductibles `profile_reference_cpu_stages.mjs` et `profile_indexed_display_normals.mjs` ; résultats détaillés dans les JSON livrés.

Aucune fréquence d’images, mémoire physique, consommation, mesure GPU ou performance de téléphone physique n’est déduite de ce profil Node. Les limites et la sphère restent calculées par Three.js ; aucune approximation de visibilité n’est introduite. La cause du délai intermittent de démarrage reste inconnue.

Vérification étendue explicitement aux 68 os stockés séparément des 458 muscles : 526 pièces × 3 phases = 1578 comparaisons réussies.
