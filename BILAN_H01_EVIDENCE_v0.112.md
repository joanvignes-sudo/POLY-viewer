# Du neurone entier aux volumes synaptiques · v0.112

## Ce qui est ajouté

Le CSV public `proofread_104/synapse_locations.csv` (release 20210601) est acquis intégralement : 18 917 333 octets, 264 090 lignes de données, génération Google Cloud Storage et MD5 du manifeste contrôlés. Le fichier source est conservé sans modification dans une compression gzip locale, avec son SHA-256 avant/après compression.

Pour le segment 1072605926, 1 571 lignes distinctes : 1 507 post et 64 pre. Les paires de coordonnées et le rôle de chaque ligne sont conservés. Les identifiants `csv-row-N` désignent des lignes de fichier, jamais de nouveaux identifiants biologiques. Les coordonnées pré/post des six annotations C3 correspondent exactement, une à une, à six lignes de ce CSV : 95939, 178572, 6931, 164578, 238375 et 247501.

Le facteur [8, 8, 33] nm est celui des annotations C3 et restitue exactement leurs six paires de coordonnées. Il est appliqué uniformément aux colonnes correspondantes du CSV, sans translation ni recalage. Ce raccord dans le même prélèvement ne vaut pas recalage avec BigBrain, Allen ou SPARC.

## Ce que montrent les vues

Une vue indépendante du neurone entier affiche ces positions, filtre pre/post et permet de sélectionner une ligne, lire ses coordonnées, partager ce repère et ouvrir un des six détails quand une correspondance exacte est établie. Les points sont agrandis à l’écran, sans taille morphométrique ; les relations pre/post restent déclarées par la source. Aucun déplacement de signal n’est simulé.

Dans les six détails, les volumes C3 `incoming_inhibitory` et `incoming_excitatory` de la release 20210729 ont été acquis à 8 × 8 × 33 nm. Chaque fenêtre conserve 128 × 128 × 32 labels uint64. Les 6 291 456 labels des douze fenêtres ont été décodés à partir des plages source, puis comparés à TensorStore 0.1.85 : aucune différence.

Le masque affiché sélectionne exactement l’ID 1072605926 dans le volume nommé inhibiteur. Le masque excitateur du même ID est vide dans ces six petites fenêtres ; cela ne signifie pas que le neurone n’a pas d’entrées excitatrices ailleurs.

Les surfaces sont les faces exposées exactes des voxels sélectionnés : pas de lissage, pas de contour anatomique interpolé, pas de raffinage à 4 nm. Aucun des six masques ne touche la limite de sa fenêtre ; ils ont chacun une composante à connexité 26. Ce sont des fragments de masque source ; leur présence ne confirme pas à elle seule l’identité de l’annotation ponctuelle voisine.

Cinq points postsynaptiques portent l’ID cible dans le volume inhibiteur ; celui de l’annotation 143278591 porte 0. Il reste donc non confirmé à sa position exacte, même si un fragment de masque voisin est visible. Aucun point n’est déplacé pour créer une concordance. Cette classification source n’est pas une validation humaine individuelle de la synapse ni une mesure physiologique de son effet.

## Recherche de validation humaine

Les tables de Zenodo 10864205 contiennent des paires d’identifiants de sites, distincts des IDs d’annotation C3. Le schéma d’échantillons de l’export C3 a été examiné : il contient des identifiants de sites et des coordonnées. La correspondance vers ces six annotations n’est pas établie à ce stade. L’export complet de 166 partitions n’a pas été recherché intégralement ; aucune absence globale de correspondance n’est affirmée.

Les six correspondances dans le CSV des cellules corrigées sont un résultat distinct. La correction des cellules ne prouve pas que chaque synapse de ce fichier a été individuellement vérifiée à la main.

## Sources et traçabilité

[H01 officiel](https://h01-release.storage.googleapis.com/data.html), Lichtman laboratory / Harvard et Connectomics at Google ; CC BY 4.0. Shapson-Coe et al., Science (2024), doi:10.1126/science.adk4858.

[Catalogue](assets/h01-evidence/CATALOG.json) · [CSV source compressé](assets/h01-evidence/synapse_locations.csv.gz) · [Correspondances](assets/h01-evidence/CORRESPONDENCE.json) · [Acquisition](assets/h01-evidence/ACQUISITION.json) · [Décodage indépendant](assets/h01-evidence/VALIDATION.json) · [Provenance complète](assets/h01-evidence/PROVENANCE.json) · [Crédits](assets/h01-synapses/CREDITS.md).

Les plages des volumes synaptiques ont leurs générations, ETags et SHA-256 conservés ; aucun checksum du shard entier n’est revendiqué. Les petites plages de schémas d’export sont des sondages, pas une acquisition de toute la base.

Les 14 chaînes scientifiques restent inchangées. Aucune latence, activité, force de connexion, réponse clinique ou nouvelle chaîne causale n’est déduite de ces vues. Les essais avec apprenants et spécialistes restent à organiser.
