# POLY v0.101 · Raccord cardiaque et images du nerf vague

## Deux avancées vérifiables

Le cœur entier S-20-28 est relié à l’acquisition nommée par la source « région du nœud sinusal », 6,51 µm, DOI 10.15151/ESRF-DC-1966162380. La transformation publiée dans neuroglancer.json est reprise telle quelle : partie linéaire appliquée après conversion des échelles d’entrée 19,85 µm et de sortie 6,51 µm, translation en voxels de sortie. La convention est vérifiée dans la fonction transformBoundingBox du code primaire Neuroglancer. Inverse numérique et bornes contrôlés. Aucune erreur de recalage anatomique indépendante n’est fournie ; POLY n’en invente pas.

Douze blocs s4 et un bloc s0 15/27/23 ont été acquis, décodés selon N5 Blosc. Vue régionale à 208,32 µm (un voxel sur deux du niveau s4), détail 128³ à 6,51 µm, origine native (1920,3456,2944). Les centres des échantillons N5 sont conservés : natif index+0,5 ; niveau s4 sous-échantillonné 32×index+8. Les boîtes de région utilisent les bornes natives de l’acquisition. Le titre de région ne constitue pas une segmentation du nœud sinusal ou une identité attribuée à chaque cellule.

Le segment gauche C10 du nerf vague sub-f002/2305 est maintenant accessible en micro-CT. Original dataset 674 v1, DOI 10.26275/imas-52lf, volume 324×503×1346 uint8. En-tête NIfTI : unités inconnues, zooms 1,1,1 ; ils ne sont pas pris comme une calibration physique. Le pas nominal de 9 µm est attesté par le protocole et le XML MBF (échelle X/Y 9, pas Z −9). POLY affiche U=axe NIfTI 1, V=axe NIfTI 0, Z=axe NIfTI 2 ; coordonnées MBF (9U,−9V,−9Z). Correspondance contrôlée visuellement au plan annoté Z=84, sans précision de recalage indépendante revendiquée.

L’ensemble du segment est sous-échantillonné ponctuellement par 4 ; le détail conserve tous les pixels et les 128 plans Z=64..191. Aucun lissage, changement de contraste dans les valeurs ni interpolation des contours. Les courbes originales ne s’affichent que sur les plans annotés disponibles.

## Unités et raccord du nerf

Les 7 594 coordonnées XML sont retrouvées dans l’import EXF sans changement d’échelle. Les coordonnées périneuriales originales de C10, après rotation XYZ extrinsèque puis translation tirées de samples.xlsx, coïncident avec l’export périneurial du scaffold ; échelle publiée 1. Écart maximum d’export inférieur à 0,005 µm, compatible avec l’arrondi float32 du fichier de visualisation. Cela contrôle la conversion et l’assemblage des fichiers, pas la précision anatomique du tissu. Les coordonnées du modèle sont donc données en µm, avec un raccord C10 vérifié ; distances et déformations du modèle hors du corps ne sont pas des mesures dans un corps intact.

Les marqueurs .mrk.json déclarent mm mais contiennent des positions dont l’échelle ne correspond pas à celle des images originales ; ils ne sont pas utilisés pour recaler le volume. La version exacte de la licence Creative Commons Attribution déclarée par SPARC reste non précisée dans la métadonnée.

## Suite

Ajouter des régions et coupes natives d’immunohistochimie avec leur calibration et l’identification des canaux ; le TIFF examiné possède seulement une résolution d’impression 72 dpi, qui ne doit pas devenir une échelle biologique. Étendre la validation de correspondance image/contours à d’autres segments, améliorer les mesures et les retours lecteurs. Aucune propagation électrique ou chaîne causale n’est inférée de ces volumes ; les personnes HiP-CT et SPARC restent distinctes.
