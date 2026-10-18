# POLY v0.109 · H01 : du squelette aux images

Release 20210601, segment 1072605926, images 4nm_raw et segmentation proofread_104. Même repère source que le squelette intégré en v0.99. CC BY 4.0, Lichtman laboratory / Harvard et Connectomics at Google.

## Acquisition et valeurs

96 blocs : 27 images + 27 segmentations au niveau 64×64×66 nm ; huit images et huit segmentations au niveau 16×16×33 nm ; dix-huit images natives 4×4×33 nm et huit segmentations 8×8×33 nm, découpées aux fenêtres retenues. 115 plages distinctes conservées avec SHA-256, génération GCS et ETag ; aucune empreinte entière de shard revendiquée. Les générations sont cohérentes pour les plages d’un même objet et utilisées avec If-Match pour les lectures suivantes.

Images JPEG source, déjà avec pertes, décodées avec Pillow. Masques issus de l’égalité exacte à l’identifiant uint64 1072605926. Relus indépendamment avec TensorStore via HTTP : 10 223 616 valeurs d’image et 8 650 752 identifiants de segmentation, soit 18 874 368 valeurs, zéro différence entre lecteurs. Les masques binaires et images sont stockés localement en gzip sans modification supplémentaire.

## Raccord

Coordonnées natives en nm, offsets voxel nuls. Les boîtes des voxels sont [index*pas,(index+1)*pas) ; lecture aux centres. Squelette source en µm converti uniformément ×1000, sans translation ou jonction de composantes. Le sommet portant le rayon maximal sert seulement de candidat de voisinage, pas de nouvelle annotation de soma. Le premier voisinage contient l’identifiant cible. Un bord du masque au niveau 64 nm sert de repère commun aux trois fenêtres. Ce choix n’est ni représentatif du cortex ni une annotation de synapse.

Le masque du détail natif reste à 8×8×33 nm, alors que l’image est à 4×4×33 nm. Projection par cellules de plus proche voisin, sans prétendre une segmentation à 4 nm. Les proportions physiques sont conservées en XY/XZ/YZ, y compris lorsque les pixels sont anisotropes. Les plans de la vue 3D et le curseur 2D partagent la même position physique. Hors fenêtre disponible, le retour au repère est explicitement signalé.

## Lecteur

Trois niveaux, trois axes, coupes spatiales, masque réversible et teinte réglable, contraste, lecture d’un pixel avant teinte/contraste, agrandissement 2D, rotation 3D, cadrage du fragment ou du neurone entier, partage. Pas d’activité simulée ni de propagation. Les fenêtres sont limitées ; pas de chargement du jeu complet.

## Suite

Des annotations synaptiques sources vérifiables pourront compléter ces images. Elles ne sont pas intégrées dans cette version et aucune synapse n’est identifiée sur la seule apparence de l’image. Aucun recalage vers BigBrain, Allen ou un autre spécimen. Formats : documentation officielle Neuroglancer ; accès indépendant : TensorStore, tel que proposé sur la page H01.
