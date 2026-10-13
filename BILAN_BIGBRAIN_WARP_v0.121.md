# POLY v0.121 · BigBrain dans le repère de l’atlas humain

La vue « Du cortex aux couches » propose désormais un **aperçu optionnel du recalage publié** de BigBrain vers MNI, avec les 17 structures de l’atlas moyen CerebrA. Le mode natif reste le point de départ ; les fichiers sources et les longueurs natives restent inchangés.

[Ouvrir la comparaison](microstructures.html?bbframe=mni&bbatlas=1&v=0.121).

## Chaîne de calcul

1. Transformation affine de la publication BigBrain 2015.
2. Champ non linéaire de 2015 : 817 658 202 octets acquis et empreinte SHA-256 conservée.
3. Trois champs du recalage amélioré Xiao et al. (2019), dans l’ordre 0 → 1 → 2 : 506 305 524 octets, intégrité ZIP et SHA-256 vérifiée lors de l’acquisition.

Les champs sont évalués dans leurs coordonnées physiques, puis leurs déplacements XYZ sont ajoutés aux positions. L’interpolation tricubique Catmull-Rom suit les coefficients et la convention de libminc. Tous les points calculés disposent du voisinage intérieur complet ; aucune extrapolation ni correction manuelle de position n’est appliquée.

348 845 positions sont transformées : les deux cortex de contexte et les frontières des trois échantillons. Les indices et les triangles restent ceux du fichier original. Le fichier de coordonnées recalées pèse 4 186 140 octets et se charge uniquement à la demande ; les champs lourds restent dans les archives de recherche.

## Contrôles et portée

Deux surfaces originales de référence ont été acquises : la surface gauche native et sa version MNI 2009b symétrique publiée par les auteurs. La reconstruction PLoSBiology2020 utilisée par POLY épouse mieux la référence native : distance médiane au sommet de référence le plus proche d’environ 0,321 mm, contre 2,126 mm pour la référence déjà recalée. Cette comparaison et les étendues spatiales appuient le repère histologique natif ; elles ne définissent pas de correspondances anatomiques sommet par sommet entre les deux reconstructions.

Le calcul de la transformation **2015** sur les 163 842 sommets du maillage de référence retrouve sa version recalée publiée : écart numérique médian d’environ 0,000059 mm, maximal d’environ 0,001017 mm. Cela contrôle la lecture des coordonnées, le sens du recalage et son interpolation. **Ce n’est pas une estimation de précision anatomique**, et ce contrôle indépendant ne porte pas sur le maillage final issu de la composition améliorée de 2019.

Les trois champs améliorés ont également été décodés avec nibabel à neuf valeurs de contrôle, sans différence avec la lecture HDF5. Les déterminants locaux de la transformation complète sont positifs aux trois centres d’échantillon (environ 2,211 ; 1,317 ; 2,163). Ce contrôle ponctuel ne démontre pas une régularité globale et ne remplace pas l’analyse anatomique.

Le NIST décrit MNI 2009b et 2009c comme la même anatomie avec des échantillonnages et prétraitements différents. La comparaison utilise leurs coordonnées physiques en millimètres, jamais l’égalité supposée des indices de voxels.

## Lecture dans POLY

- Basculer entre « Repère natif » et « Voir dans l’atlas MNI » ; tourner, zoomer et sélectionner les mêmes échantillons.
- Afficher ou masquer CerebrA : BigBrain apparaît en beige, l’atlas moyen en bleu-vert. Ce sont deux références différentes, pas deux acquisitions de la même personne.
- Le tableau garde ses longueurs **natives**. Une longueur après déformation ne doit pas être présentée comme une épaisseur histologique originale.
- Le plan histologique 3863 est masqué en mode atlas : une transformation non linéaire ne conserve pas nécessairement un plan rigide.
- L’éclatement des frontières reste une aide de lecture. Il n’altère ni les coordonnées téléchargeables ni les mesures.

Les liens partagés conservent le mode choisi. Si le supplément recalé manque ou ne correspond pas à son empreinte, le lecteur natif reste disponible. Si seul l’atlas manque, BigBrain recalé reste consultable.

## Ce qui reste à faire

Évaluation anatomique indépendante du raccord complet : repères manuels, recouvrements régionaux et régularité globale de la déformation. Aucun recalage individuel vers H01, Allen, P8 ou les organes n’est établi. Aucun signal temporel, trajet neuronal ou délai biologique n’est déduit de ce changement de repère. Les essais avec lecteurs et spécialistes restent à réaliser.

## Sources et droits

- [Xiao et al., recalage BigBrain–PD25–ICBM](https://doi.org/10.1038/s41597-019-0217-0) ; [README et licence de l’archive source](assets/bigbrain-registration-v0120/PROVENANCE.json).
- [Surfaces de référence native et MNI 2009b](https://ftp.bigbrainproject.org/bigbrain-ftp/BigBrainRelease.2015/3D_Surfaces/Apr7_2016/gii/).
- [Transformations de 2015](https://ftp.bigbrainproject.org/bigbrain-ftp/BigBrainRelease.2015/3D_Volumes/MNI-ICBM152_Space/transformation/).
- [Wagstyl et al., couches corticales](https://doi.org/10.1371/journal.pbio.3000678) ; [Amunts et al., BigBrain](https://doi.org/10.1126/science.1235381).
- [Description officielle des atlas MNI2009](https://nist.mni.mcgill.ca/icbm-152-nonlinear-atlases-2009/).
- [libminc : évaluation des déplacements](https://github.com/BIC-MNI/libminc/blob/e71e590bc98b3fc3f05b2615dd80151a62e2fcc4/volume_io/MNI_formats/grid_transforms.c), [coefficients d’interpolation](https://github.com/BIC-MNI/libminc/blob/e71e590bc98b3fc3f05b2615dd80151a62e2fcc4/volume_io/Geometry/splines.c).
- [Provenance et empreintes](assets/bigbrain-warp-v0121/PROVENANCE.json) ; [contrôles numériques](assets/bigbrain-warp-v0121/VALIDATION.json).

Les dérivés BigBrain conservent CC BY-NC-SA 4.0 et les crédits source. La licence originale jointe aux transformations Xiao 2019 reste conservée intégralement. Aucune approbation par les équipes d’origine n’est revendiquée.
