# Étiquettes anatomiques ponctuelles H01 · v0.114

## Source et acquisition

La source `20210601/proofread_104/subcompartments/annotations` fournit des annotations POINT, une propriété int32 `class_label` et une relation `skeleton_id`. La lecture de la relation 1072605926 retourne 5 050 annotations. Les 5 050 enregistrements by_id ont été acquis et contrôlés : coordonnées, classes et association au même squelette concordent avec la liste de relation. Chaque annotation n’a qu’un identifiant de squelette associé dans ces données.

Les plages de 16 lectures source sont conservées avec générations, ETags et SHA-256. Les petits enregistrements by_id sont regroupés dans un fichier binaire avec index d’offsets et empreintes individuelles, sans modification de leur contenu décodé. Aucune empreinte du shard complet n’est revendiquée.

## Jointure exacte

Les coordonnées float32 natives, en nanomètres, de chacune des 5 050 annotations ont les mêmes octets que celles d’un sommet distinct du squelette original. Aucun voisin le plus proche, seuil spatial ou transfert de classe par proximité n’est utilisé.

Les 25 895 sommets natifs ont tous des coordonnées distinctes. Les 20 845 sommets sans annotation dans cette table restent sans classe attribuée. Les petits écarts de représentation lors du passage nm → µm → nm dans le JSON sont évités en utilisant les octets natifs ; le maximum observé dans ce contrôle d’arrondi est 4,6566 × 10⁻¹⁰ nm. Ce nombre décrit l’arithmétique de conversion, pas une précision anatomique ni une résolution d’imagerie.

Les données canoniques du squelette et leurs anciens champs restent inchangés. Les classes sont une table source séparée, avec `null` pour les sommets non annotés ; le code 0 est la classe source axon, pas une valeur d’absence.

## Classes présentes

| Étiquette source | Points |
|---|---:|
| dendrite | 4 791 |
| axon | 148 |
| soma | 43 |
| AIS | 21 |
| myelinated axon | 7 |
| astrocyte | 40 |

Les noms viennent de la légende de la propriété de la source POINT. Les classes des volumes C3 utilisent un autre codage ; elles ne sont pas substituées à cette légende.

Les 40 étiquettes astrocyte sont conservées et signalées pour examen sur cette reconstruction neuronale. Une association de fichier et une jointure de coordonnées ne valident pas biologiquement chaque classe. Aucune correction, changement d’identité de cellule ou validation manuelle individuelle n’est affirmé.

## Lecture et export

[Parcours H01](trajets.html?v=0.114) affiche les points annotés dans des couleurs sobres. Il ne colore pas les branches entières comme si leurs classes étaient connues partout.

La liste des repères du parcours retient seulement les sommets source réellement parcourus et explicitement annotés. Précédent/suivant déplace le curseur vers ces sommets. La lecture libre ne reçoit pas de classe interpolée. Les étiquettes ne sont pas transférées vers les points synaptiques projetés.

L’exemple préchargé contient 122 repères annotés. L’export inclut les identifiants source, sommets, classes, positions et longueurs cumulées des repères, ainsi que les empreintes des données. Il garde `classes_interpolated: false`, `class_labels_manually_validated_by_poly: false` et `biological_time: null`.

Les 37 cas numériques de parcours sont revérifiés ; les longueurs et les refus de connexion entre morceaux restent inchangés. La lecture par repères, le curseur libre, le partage, l’export, le mobile, le repli sans 3D et la récupération après refus d’une source altérée sont testés.

## Sources et portée

[H01 officiel](https://h01-release.storage.googleapis.com/data.html), Lichtman laboratory / Harvard et Connectomics at Google ; CC BY 4.0. Shapson-Coe et al., Science (2024), doi:10.1126/science.adk4858.

[Provenance](assets/h01-compartments/PROVENANCE.json) · [Jointure et classes](assets/h01-compartments/JOIN.json) · [Validation sur les octets natifs](assets/h01-compartments/JOIN_VALIDATION.json) · [Concordance des index source](assets/h01-compartments/SOURCE_VALIDATION.json) · [Métadonnées originales des annotations](assets/h01-compartments/proofread-annotations.json) · [Acquisition](assets/h01-compartments/ACQUISITION.json) · [Crédits](assets/h01-synapses/CREDITS.md).

Aucune horloge biologique, propagation ou nouvelle chaîne causale n’est ajoutée. La jointure des classes ne confirme pas les rattachements anatomiques des projections synaptiques utilisés dans le parcours géométrique. Les 45 composantes séparées et les fichiers scientifiques canoniques sont préservés.
