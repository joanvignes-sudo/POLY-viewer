# POLY v0.95 — première exploration BigBrain
12 octobre 2026.

## Livré
Deux surfaces piales de contexte et trois échantillons du cortex gauche, chacun comprenant sept frontières délimitant six couches. Rotation, zoom, situation dans le cortex, exploration locale, sélection/isolation d’une frontière, éclatement continu, retour à l’anatomie en conservant dossier et maillon. Les données scientifiques et les chaînes v0.94 restent inchangées.

## Provenance et préparation
Surfaces GIFTI de BigBrain Release 2015, répertoire Layer_Segmentation/3D_Surfaces/PLoSBiology2020. Les sources compressées sont conservées dans assets/bigbrain, avec URLs, empreintes, crédits et licence. Cortex : 163 842 sommets et 327 680 triangles par côté. Pour chaque voisinage de 8 mm, mêmes indices de sommets et triangles extraits des sept frontières. Aucun lissage supplémentaire ni interpolation entre frontières.

Choix des échantillons : sommet pial non masqué le plus proche de trois coordonnées exploratoires natives, puis conservation des faces dont les trois sommets sont dans le voisinage non masqué. Aucune aire fonctionnelle n’est assignée. Le fichier PROVENANCE.json consigne les coordonnées, les indices source et toutes les transformations.

Distances affichées : longueurs euclidiennes en mm entre sommets correspondants au point repère, calculées par POLY. Elles ne sont ni des latences, ni des mesures indépendamment validées d’épaisseur corticale. L’éclatement n’intervient pas dans ces calculs.

## Raccord entre références
CerebrA est un atlas moyen dans MNI2009cSym. Cette intégration BigBrain utilise des coordonnées histologiques natives d’un autre cerveau. Aucune transformation vers CerebrA n’est appliquée. Les transformations publiées vers des références MNI doivent être vérifiées dans leurs variantes exactes avant un raccord. Une permutation d’axes d’affichage ne constitue pas un recalage.

À l’intérieur de BigBrain, contexte et frontières sont issus du même cerveau et partagent leur repère. Les étapes de POLY ne sont pas projetées sur ces échantillons.

## Précision et limites
Histologie source à 20 µm ; les surfaces sont des reconstructions algorithmiques avec traitement décrit dans la publication. Leur précision n’est pas uniformément égale à cet échantillonnage. Ce premier lot ne contient ni images histologiques fines consultables dans POLY, ni neurones individuels, ni synapses ou enregistrements fonctionnels. Il permet une exploration des frontières lamellaires, pas une propagation biologique simulée.

## Sources et licence
- BigBrain : Amunts et al., 2013, https://doi.org/10.1126/science.1235381
- Couches : Wagstyl et al., 2020, https://doi.org/10.1371/journal.pbio.3000678
- Projet : https://bigbrainproject.org/maps-and-models.html
- Serveur source : https://ftp.bigbrainproject.org/bigbrain-ftp/

Données et dérivés BigBrain dans assets/bigbrain : CC BY-NC-SA 4.0. Crédits complets et licence source conservés ; adaptations explicitées. POLY ne revendique aucune approbation des équipes d’origine.

## Suite priorisée
1. Vérifier une transformation documentée entre les références exactes avant toute superposition.
2. Ajouter une région histologique fine avec son affine, puis confronter image et frontières.
3. Intégrer un premier neurone humain Allen avec sa morphologie et les mesures disponibles.
4. Préparer H01 microscopie électronique, HiP-CT et SPARC en références distinctes, tant qu’aucun raccord individuel n’est établi.

Vérifications techniques : VERIFICATION_BIGBRAIN_v0.95.json. Elles ne remplacent pas une évaluation scientifique ou un essai auprès de lecteurs.
