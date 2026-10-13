# POLY v0.108 · Segment C1 du nerf vague humain

## Acquisition

SPARC 674 v1, DOI 10.26275/imas-52lf. Acquisition primaire 2305_C1L_9um_0000.nii.gz, 738 652 116 octets, grille 496 × 1383 × 2800, uint8. Fichier complet téléchargé et SHA-256 comparé au manifeste S3 versionné. Dix sources complémentaires acquises et vérifiées : XML Vesselucida, volume dérivé et huit fichiers Markups.

## Intégration

Un contexte à pas 8 (72 µm nominaux), quatre fenêtres natives 192³ autour des quatre repères anatomiques source, quatre coupes UV natives à Z=884,1524,1764,2404. Valeurs primaires inchangées ; aucun lissage, moyenne ou interpolation des intensités. Contraste d’affichage seulement. Lecture d’intensité originale, agrandissement 2D jusqu’à ×6 avec défilement, trois plans en 3D, navigation par niveau, axe et coupe ; partage du cadrage.

466 contours source, 47 010 points au total dont 47 009 points hors courbe d’orientation. Les tracés restent indépendants. La courbe d’orientation n’est pas ajoutée aux overlays. Les contours exacts apparaissent en 2D uniquement à leur plan source, sans interpolation. Quarante points Markups conservés dans la provenance ; quatre repères anatomiques proposés au lecteur. Aucun nom biologique attribué aux étiquettes 0/1/2 du volume dérivé.

## Coordonnées

En-tête primaire sans unités physiques utilisables ; ne pas lire ses zooms (1,1,1) comme des mm. Volume dérivé avec unités mm, sform diag(-0.009,-0.009,+0.009), dimensions identiques. Transformation RAS/LPS et inverse appliquées aux Markups LPS en mm. XML : i=-y/9,j=x/9,k=-z/9. Comparaison de 47 009 points aux transitions de valeurs du dérivé : médiane 1 px, P95 4 px, 73.11 % à ≤2 px ; variantes de signe nettement moins concordantes. Ce n’est pas une précision anatomique garantie. Concordance visuelle avec l’intensité primaire examinée sur quatre plans natifs ; pas d’erreur indépendante mesurée. Les points de l’image sont aux centres d’indice entier ; l’overlay canvas ajoute un demi-pixel pour ce centre.

## Entre échelles

Le volume C1 et l’échantillon histologique C1-A-L2 ont une parenté documentaire dans les identifiants de prélèvement et le protocole. Cela rapproche matériellement l’exploration du même segment. La position, l’orientation et la déformation exactes de la coupe histologique restent inconnues ; aucun transform IHC/CT, C1/C10 ou vers le corps entier n’est inventé. Le pas nominal 9 µm est un échantillonnage, pas une résolution garantie.

Conventions : https://nifti.nimh.nih.gov/nifti-1/documentation/nifti1fields.html et https://slicer.readthedocs.io/en/latest/user_guide/coordinate_systems.html. Crédits et limites détaillés dans assets/c1.
