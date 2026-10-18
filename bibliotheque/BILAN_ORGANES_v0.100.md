# POLY v0.100 · Premiers volumes cardiaques et nerf vague humain

Le programme reste centré sur BigBrain, Allen humain, H01, HiP-CT et SPARC. Aucune chaîne ni durée scientifique n’a été ajoutée ou modifiée.

## Cœur HiP-CT

S-20-28, homme de 84 ans, après décès, tissu fixé. DOI 10.15151/ESRF-DC-1966163810, CC BY 4.0. Acquisition native 7613 × 7613 × 8128, pas 19,85 µm dans les trois axes. 64 blocs N5 au niveau s4, puis un bloc s0 37/18/31 téléchargés et décodés Blosc conformément à la spécification N5 (en-tête et données big endian). Les marges de blocs sont coupées aux dimensions déclarées.

L’ensemble utilise s4[::2,::2,::2] : prélèvement ponctuel, sans moyenne, pas 635,2 µm. Le détail reprend les 128³ voxels natifs à partir de (4736,2304,3968). Ses bornes natives demi-ouvertes sont [4736,4864) × [2304,2432) × [3968,4096). Les intensités uint16 sont conservées ; les fenêtres de contraste sont des choix de lecture. Coupes orthogonales 3D, parcours des coupes, valeur et position du voxel sélectionné. Les axes locaux ne sont pas désignés gauche/droite ou supérieur/inférieur sans source.

Il s’agit de tomographie, sans segmentation de cavités, contraction ou activité. Le pas des voxels n’est pas la résolution effective garantie. La région à 6,51 µm appartient à une autre acquisition : aucun raccord non vérifié n’a été dessiné.

## Nerf vague SPARC

Dataset 426 version 7, DOI 10.26275/tjzi-muqm ; sujet réel sub-f002/2305, femme de 88 ans, nerf gauche ; prélèvement original DOI 10.26275/imas-52lf (dataset 674 v1). Quinze surfaces nommées reprises de la visualisation source et 178 049 segments de contours périneuriaux. La géométrie Lines de ZincJS est une suite de paires de sommets : ses faces de compatibilité ne sont pas des surfaces de contour et ne doivent pas être interprétées en arêtes triangulaires. Le dernier remplissage dégénéré du format est omis.

Le modèle ajusté est distingué des contours segmentés ; sélection par structure, transparence, cadrage et vue des faisceaux. Le prélèvement a été découpé puis assemblé hors du corps : la continuité est celle de la reconstruction publiée. Aucun raccord ajouté par POLY, aucune propagation électrique ou preuve d’innervation jusqu’au cœur HiP-CT. Unités physiques non vérifiées : pas de règle en mm. Licence telle que déclarée : Creative Commons Attribution ; version non précisée dans la métadonnée.

## Suite

Confirmer les unités du scaffold et la version de licence, ajouter les images et repères du prélèvement original, vérifier le raccord avec une région cardiaque à 6,51 µm. Améliorer les outils de coupe et obtenir les retours des lecteurs. Les données des cinq sources appartiennent à des personnes différentes ; aucun recalage individuel global n’est revendiqué.
