# POLY v0.99 — Premier jalon : neurones humains

Le programme reste centré sur BigBrain, Allen humain, H01 EM, HiP-CT et SPARC humain. Cette version apporte deux reconstructions explorables et un enregistrement électrique réel. L’inventaire distingue acquisition, intégration et préparation.

## Données intégrées

- **Allen, cellule 637034000**, gyrus frontal supérieur gauche, couche 2, tissu chirurgical d’une donneuse de 41 ans atteinte d’épilepsie. SWC original conservé : 8 891 sommets, 8 890 arêtes, une composante. Les codes SWC distinguent soma, axone, dendrites basales et apicales. La préparation peut tronquer des prolongements.
- **Même cellule Allen, essai 62**, NWB 742807097 : fenêtre [0,92 ; 2,12[ secondes relative au début de la série, 60 000 échantillons à 50 kHz. Impulsion principale [1,02 ; 2,02[ secondes, amplitude source 469,999983 pA. Le petit test initial n’est pas confondu avec l’impulsion principale. Les données de tension et de courant sont converties selon l’attribut NWB `conversion`, puis de V en mV et A en pA. Aucun déplacement temporel. Les caractéristiques Allen affichées proviennent des métadonnées originales, avec leurs propres conventions de calcul et d’origine temporelle.
- **H01 EM, segment 1072605926**, collection `20210601/proofread_104` : squelette natif precomputed, 25 895 sommets, 25 850 arêtes, 45 composantes conservées sans jonctions ajoutées. Acquisition par requêtes publiques de plages d’octets, indices de shard décompressés selon le format Neuroglancer. Transformation source identité, coordonnées en nm ; conversion uniforme vers µm. Pas de typage axone/dendrite déduit ici.

## Vérification des unités

L’archive H01 SWC n’utilise pas directement les mêmes unités que le squelette precomputed : les 16 120 positions de sa composante `1072605926.0.swc` correspondent exactement à des positions natives après multiplication par (32, 32, 33), en nm. Une conversion SWC isotrope aurait déformé la géométrie. L’affichage utilise exclusivement le squelette natif, converti uniformément par 0,001 vers µm. Le rayon et les codes de type du SWC H01 ne sont pas interprétés.

Les coordonnées Allen sont celles du SWC en µm. Les données sources sont préservées ; le centrage de l’affichage soustrait seulement le centre de la boîte englobante. La rotation et le zoom ne modifient aucune mesure. Les traits sont de largeur constante à l’écran : ils ne restituent pas les diamètres biologiques.

## Mesures et limites

La somme euclidienne de toutes les arêtes est calculée par POLY dans les coordonnées converties : environ 10 288,01 µm pour le SWC Allen complet et 7 423,19 µm pour le squelette H01. Elle inclut tous les prolongements du fichier ; elle ne prétend pas reproduire les caractéristiques morphologiques Allen, qui peuvent sélectionner d’autres compartiments. Un segment choisi conserve ses indices et ses coordonnées.

La règle orthographique indique une distance dans le plan de l’écran. Les longueurs numériques des segments utilisent leurs trois coordonnées. Les cellules et BigBrain proviennent de personnes et de préparations différentes. Aucun recalage individuel n’est effectué, aucun délai causal n’est calculé. H01 ne fournit ici ni image EM, ni synapse, ni activité. L’enregistrement Allen est une mesure au site expérimental, sans localisation d’une propagation dans le squelette.

## Navigation et accessibilité

Accès depuis l’atelier, l’anatomie, le cortex, la coupe et le répertoire. Les renvois cortex/tissu vers la nouvelle vue conservent les paramètres de contexte. Le lien de partage conserve spécimen, orientation, zoom, centrage, arête et compartiments masqués. Commandes clavier de rotation et zoom, sélection numérique d’une arête, adaptation mobile et mesures accessibles même en l’absence de WebGL. Lecture interrompue lorsque la page devient cachée.

Les fichiers de géométrie et l’enregistrement extrait sont contrôlés par SHA-256 avant utilisation. Les empreintes des sources téléchargées sont enregistrées dans [la provenance](assets/neurons/PROVENANCE.json). Le NWB complet et l’archive SWC H01 sont conservés dans l’archive de construction locale ; seuls les extraits utiles sont servis par le site.

## État des cinq sources

L’[inventaire](INVENTAIRE_ECHELLES_v0.99.json) et le [programme](suite.html#programme) sont les points de suivi. BigBrain est déjà intégré. Allen et H01 ont un premier échantillon. HiP-CT : métadonnées sélectionnées pour le cœur S-20-28 (vue entière, VOI-01 et valve tricuspide), même donneur et organe, mais transforms et images encore à acquérir. SPARC : dataset 426 v7, DOI 10.26275/tjzi-muqm, métadonnées et notice acquises ; récupération publique d’un fragment, unités et version précise de licence encore à établir. Il comprend des spécimens humains et un sujet virtuel, que la sélection future devra distinguer.

## Sources et conditions

- [Allen Cell Types Database, cellule 637034000](https://celltypes.brain-map.org/human/experiment/morphology/637034000) ; [API](https://community.brain-map.org/t/cell-types-database-api/3016). Allen Institute for Brain Science (2015), Allen Cell Types Database [dataset], consulté le 12 octobre 2026. [Conditions d’utilisation](https://alleninstitute.org/legal/terms-of-use) et [politique de citation](https://alleninstitute.org/legal/citation-policy) : réutilisation pour recherche et usages non commerciaux ; aucune licence CC générique attribuée à ces données.
- [H01 release, Lichtman laboratory / Harvard & Connectomics at Google](https://h01-release.storage.googleapis.com/data.html), CC BY 4.0 ; [article Science](https://doi.org/10.1126/science.adk4858) ; [spécification du squelette](https://github.com/google/neuroglancer/blob/master/src/datasource/precomputed/skeletons.md).
- [Human Organ Atlas / ESRF](https://human-organ-atlas.esrf.fr/), CC BY 4.0 selon le portail ; identifiants et métadonnées des trois acquisitions dans [la sélection](assets/multiscale/hoa-heart-selection.json).
- [SPARC 426](https://sparc.science/datasets/426), [notice originale](assets/multiscale/sparc-readme.md) et [documentation des scaffolds humains](https://docs.sparc.science/docs/subject-specific-vagus-ssv-scaffolds). Le libellé de licence du catalogue est conservé sans supposer une version non vérifiée.

Les licences de chaque jeu restent distinctes. POLY ne revendique aucune approbation des équipes sources.

## Contrôles exécutés

[Conformité des données et liens](CONTROLES_ECHELLES_v0.99.json) : coordonnées et arêtes vérifiées contre les sources, 60 000 valeurs de courant et tension identiques au NWB après conversion, 628 fichiers anatomiques inchangés, cinq sources inventoriées et liens internes contrôlés. [Navigation](NAVIGATION_NEURONES_v0.99.json) : rotation, zoom, sélection, masques, partage/rechargement, lecture et mobile. [Résilience](RESILIENCE_NEURONES_v0.99.json) : sélection à la souris, dix changements d’échantillon sans accumulation de géométries, rejet d’une empreinte corrompue, URL invalide, paramètres de contexte et absence de WebGL. Ces contrôles ne remplacent pas une validation par des spécialistes ou un essai avec des lecteurs.
