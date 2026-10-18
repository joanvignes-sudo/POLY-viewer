# POLY v0.124 · Subdiviser le modèle sans inventer de nouvelles données

[Comparer un triangle source et son aperçu calculé](microstructures.html?bbframe=mni&meshcheck=1&facet=context-left%3A221730&refine=1&v=0.124).

Les 86 facettes signalées en v0.123 disposent d’aperçus numériques locaux. Une case permet de comparer le triangle original à une subdivision bleue, et un bouton oriente la vue face à l’aperçu. Les surfaces anatomiques originales, leurs indices et leurs mesures sont conservés.

## Méthode

Chaque triangle natif est découpé par une grille barycentrique uniforme. Les points ajoutés sont situés dans son plan source, puis passent par la même composition publiée de cinq transformations. Ils sont **calculés et non mesurés** : cette opération n’ajoute ni observations histologiques ni résolution anatomique.

Pour chaque niveau, les normales des petits triangles sont comparées à la normale transformée attendue à leur centre. Les déterminants locaux et l’écart entre centre transformé et centre affiché sont également calculés. Le critère de proposition automatique est le premier niveau testé sans opposition de normales ni déterminant nul ou négatif aux centres ; il ne certifie pas tout l’intérieur des triangles.

## Résultats sur les 86 cas

| Segments par arête | Petits triangles évalués | Facettes gardant au moins une opposition au centre |
|---:|---:|---:|
| 1 | 86 | 86 |
| 2 | 344 | 29 |
| 4 | 1 376 | 9 |
| 8 | 5 504 | 2 |
| 16 | 22 016 | 1 |
| 32 | 88 064 | 1 |

Le cas restant, `context-right:5535`, est très allongé. Un calcul complémentaire à 64, 128 et 256 segments par arête ne trouve plus d’opposition aux centres testés. Le niveau 64 est disponible dans le lecteur pour ce cas ; les deux niveaux supplémentaires restent documentés dans les données d’analyse.

Les propositions minimales sont : 57 facettes à 2 segments, 20 à 4, sept à 8, une à 16 et une à 64. Elles représentent 5 348 petits triangles. Leurs centres ne présentent ni opposition d’orientation ni déterminant nul ou négatif. L’écart numérique maximal parmi ces propositions est d’environ 0,131 mm ; cela décrit l’approximation du modèle, pas une erreur anatomique.

Les positions sont stockées relativement à une origine locale pour réduire l’arrondi float32. Les résultats d’orientation ont été calculés sur les coordonnées float64 et sur les coordonnées locales float32 reconstituées : leurs comptes concordent aux niveaux testés. Cette concordance ne constitue pas une garantie de précision de tous les calculs graphiques sur tous les appareils.

## Lecture

Ouvrir le volet des facettes, choisir un cas, puis « Comparer avec une subdivision calculée ». Activer ou masquer l’aperçu, choisir le nombre de segments et utiliser « Voir la subdivision de face ». Le contour doré reste celui du triangle source ; le bleu représente le calcul subdivisé. Revenir au repère natif masque l’aperçu recalé.

La sélection et le niveau sont partageables. L’export rassemble les coordonnées locales, leur origine, les indices, les résultats du niveau et la référence de provenance. Les fichiers sont vérifiés avant affichage ; les deux groupes de données sont chargés à la demande et mis en cache. Un échec laisse le diagnostic original accessible.

## Limites

Il s’agit d’aperçus locaux, pas du remplacement global du cortex. Une arête subdivisée peut ne pas coïncider avec l’arête plane d’une facette voisine non subdivisée ; aucun maillage global sans fissure n’est revendiqué. Les cas source restent signalés en v0.123.

Les centres ne couvrent pas tous les intérieurs ni toutes les arêtes. La régularité du volume entier, les auto-intersections et la validation anatomique indépendante restent à examiner. Aucun trajet neuronal, nouvelle cellule, activité ou délai n’est inféré.

## Sources et fichiers

- [Provenance, niveaux et aperçus proposés](assets/bigbrain-refinement-v0124/PROVENANCE.json).
- [Analyse complémentaire du cas très allongé](assets/bigbrain-refinement-tail-v0124/PROVENANCE.json).
- Les positions float64, positions locales float32 et indices sont référencés avec leurs tailles et empreintes dans ces deux notices.
- [Facettes sources et contrôles v0.123](assets/bigbrain-triangles-v0123/PROVENANCE.json).
- [Transformation publiée et références v0.121](assets/bigbrain-warp-v0121/PROVENANCE.json).

Les dérivés BigBrain conservent CC BY-NC-SA 4.0, les crédits source et les conditions originales des transformations. Les nouveaux sommets sont exclusivement des points d’interpolation numérique.
