# POLY v0.134.1

[Accéder au lecteur POLY](https://joanvignes-sudo.github.io/POLY-viewer/) · [Notes de la version](RELEASE_v0.134.1.md)

# POLY v0.134.0

[Ouvrir POLY](https://joanvignes-sudo.github.io/POLY-viewer/) · [Données et limites](RELEASE_v0.134.0.md)\n\n# POLY v0.133.0

[Ouvrir POLY](https://joanvignes-sudo.github.io/POLY-viewer/) · [Version et limites](RELEASE_v0.133.0.md)

# POLY v0.132.2

[Ouvrir POLY](https://joanvignes-sudo.github.io/POLY-viewer/) · [Version et limites](RELEASE_v0.132.2.md)

# POLY v0.132.1

[Ouvrir POLY](https://joanvignes-sudo.github.io/POLY-viewer/) · [Version et limites](RELEASE_v0.132.1.md)

# POLY v0.132.0

[Ouvrir POLY](https://joanvignes-sudo.github.io/POLY-viewer/) · [Version et limites](RELEASE_v0.132.0.md)

# POLY v0.131.0

[Ouvrir POLY](https://joanvignes-sudo.github.io/POLY-viewer/) · [Version et limites](RELEASE_v0.131.0.md)

# POLY v0.130.0

[Ouvrir le corps et les chaînes](https://joanvignes-sudo.github.io/POLY-viewer/) · [Version et limites](RELEASE_v0.130.0.md) · [Ancien accueil](accueil-v0.129.0.html)

# POLY v0.129.0

[Sommaire général](index.html) · [État canonique et limites](etat-scientifique.html) · [Notes de version](RELEASE_v0.129.0.md)

La navigation revue et la synthèse des résultats locaux constituent la version courante. Les notices scientifiques et bilans versionnés ci-dessous restent historiques. Les scripts et données des explorateurs, ainsi que la page et la notice de revue BigBrain v0.128.1, sont conservés.

## Historique et conditions des sources

# POLY v0.128

[Canaux séparés et mise au point](canaux.html) : deux champs, 17 plans focaux et trois exports de canal chacun, composite source indépendant. [Sources et limites](BILAN_CANAUX_v0.103.md).

[Immunohistochimie du nerf vague](immunohistochimie.html) : deux parties C1-A-Level 2, six fenêtres natives RGB ; marqueurs et couleurs documentés, mesures en pixels. [Sources et limites](BILAN_IHC_v0.102.md).

[Cœur humain et nerf vague](organes.html) : premières données HiP-CT et SPARC. [Provenance](assets/organs/PROVENANCE.json), [bilan et travaux ouverts](BILAN_ORGANES_v0.101.md), [inventaire actualisé](INVENTAIRE_ECHELLES_v0.128.json). Région cardiaque à 6,51 µm reliée par la transformation publiée ; micro-CT C10 et contours originaux intégrés. Unités retracées sur C10 ; CC BY 4.0 confirmé par les notices DOI pour 674 v1 et 426 v7 ; [preuve documentaire](assets/licenses/SPARC_RIGHTS_v0.116.json).

[Neurones humains : Allen et H01](neurones.html) · [Programme entre échelles](suite.html#programme) · [Inventaire des cinq sources](INVENTAIRE_ECHELLES_v0.128.json) · [Méthodes et limites](BILAN_NEURONES_v0.99.md).

[Preuves au maillon et identités des sources](AUDIT_SOURCES_v0.98.md) · [Dossiers réunis](dossiers.html).


[Dossiers et sources réunis](dossiers.html) · [Audit de l’organisation](AUDIT_ORGANISATION_v0.97.md).


[Contrôles de navigation](BILAN_TESTS_v0.96.1.md).


Atelier de chaînes biologiques, atlas humain et exploration BigBrain. Nouvelle étape : [coupe histologique documentée](histologie.html), image à 20 µm et annotations corticales. [Bilan et limites](BILAN_HISTOLOGIE_v0.96.md).

Les données BigBrain et leurs adaptations conservent la licence CC BY-NC-SA 4.0 et les crédits dans assets/bigbrain et assets/histology. Aucun recalage fonctionnel vers P8 ni synapse représentée.

Les données Allen restent soumises aux conditions Allen Institute (recherche et usages non commerciaux, attribution). Le squelette H01 est sous CC BY 4.0. Les sources et dérivés conservent leurs conditions propres. La version 0.99 étend l’exploration entre échelles ; le registre scientifique des chaînes demeure EXPLORATION_v0.98.json.

## v0.104 · Champ et montage

`raccord.html` compare le champ 00009 Z009 à sa zone native du montage. Translation locale (5370,8) pixels, dispersion observée de 1 pixel sur huit comparaisons. Champ 00001 non confirmé ; calibration physique et raccord 3D toujours ouverts.


## v0.105 · COGITATE

[Événements et réponses cérébrales](cogitate.html) : figures et résultats sauvegardés du tutoriel des auteurs, métadonnées publiques contrôlées, lecteur local de fichiers BIDS events.tsv. Aucune acquisition de signaux bruts ni réplication revendiquée. Volet conscience distinct du registre affectif. [Méthodes et limites](BILAN_COGITATE_v0.105.md).

## v0.107 · Échelles et mesures

[Calibration documentée](calibration.html) : 136 TIFF et deux métadonnées de montage contrôlés ; unités source cohérentes, hypothèse nominale en µm non appliquée. [Mesurer dans le raccord](raccord.html) : 17 plans, repères XY synchronisés, distance en pixels, partage et export avec sources. [Bilan et limites](BILAN_CALIBRATION_v0.107.md).

## v0.108 · Segment C1 et microscopie

[Explorer C1](c1.html) : acquisition primaire complète vérifiée, contexte, quatre fenêtres natives, quatre coupes annotées, contours et repères source. Même segment parent que les images IHC C1-A-L2 ; transform histologie/CT encore inconnu. [Inventaire actuel des cinq sources](INVENTAIRE_ECHELLES_v0.108.json) · [Bilan](BILAN_C1_v0.108.md).

## v0.109 · Images H01 et squelette dans un repère commun

[Microscopie électronique H01](microscopie.html) : trois fenêtres image + masque source, du voisinage au pas natif 4 × 4 × 33 nm. Même segment 1072605926 que le squelette existant. Vérification indépendante des valeurs avec TensorStore ; aucune synapse ni activité inférée. [Bilan](BILAN_H01_EM_v0.109.md) · [Inventaire actuel](INVENTAIRE_ECHELLES_v0.109.json).

## v0.110 · Annotations synaptiques H01

[Explorer l’annotation 95480769](microscopie.html?level=synapse4&synapse=95480769&v=0.110) : six annotations associées au neurone dans un voisinage de 180 annotations source, affichage 2D/3D et nouveau détail natif. Relations pré/post publiées, sans activité ni délai inféré. [Bilan](BILAN_H01_SYNAPSES_v0.110.md) · [Inventaire actuel](INVENTAIRE_ECHELLES_v0.110.json).

## v0.111 · Six détails synaptiques natifs

[Parcourir les six annotations](microscopie.html?level=synapse4&v=0.111), chacune avec sa fenêtre 4 × 4 × 33 nm. Navigation précédente/suivante conserve le niveau natif. Images nouvelles relues indépendamment avec TensorStore ; masques source à 8 × 8 × 33 nm. [Bilan](BILAN_H01_DETAILS_v0.111.md).

## v0.112 · Du neurone entier aux volumes synaptiques

[1 571 positions source](microscopie.html?v=0.112#catalogue-cellule), filtres entrées/sorties, coordonnées et liens vers six détails correspondants. Masques synaptiques locaux et surfaces exactes de leurs faces de voxels ; cinq points post retrouvés dans le volume classé inhibiteur, un non étiqueté. Aucun statut de validation humaine individuelle ajouté. [Bilan](BILAN_H01_EVIDENCE_v0.112.md).

## v0.113 · Parcours dans le squelette H01

[Choisir deux repères](trajets.html?v=0.113) : projections vers les arêtes source, longueur dans le même morceau, lecture en micromètres, partage et export. Aucun pont ajouté entre les 45 morceaux, aucune durée de transmission inférée, aucun rattachement anatomique certifié par proximité. [Bilan](BILAN_H01_PATHS_v0.113.md).

## v0.114 · Étiquettes anatomiques ponctuelles H01

[Parcourir les points annotés](trajets.html?v=0.114) : 5 050 correspondances exactes sur les coordonnées natives, six classes source observées, repères précédent/suivant. Aucun remplissage des 20 845 sommets non annotés ni interpolation des classes. 40 étiquettes astrocyte conservées pour examen. [Bilan](BILAN_H01_COMPARTMENTS_v0.114.md).

[Six fenêtres H01 autour des classes source](compartiments.html?v=0.115) : images natives 4 × 4 × 33 nm, masque du même segment, points et export de provenance. [Bilan](BILAN_H01_IMAGES_v0.115.md). [État consolidé du programme](suite.html#consolidation).

[Trois cellules humaines Allen et neuf essais](neurones.html?sample=allen-637038252&sweep=22&v=0.116#recording) : morphologies, courants et tensions mesurés ; 41 instants détectés source, intervalles exportables. [Méthodes et limites](BILAN_ALLEN_v0.116.md).

[Indicateurs des neuf essais Allen](neurones.html?sample=allen-637038252&sweep=22&quality=1&v=0.117#quality-panel) : métriques publiées, valeurs manquantes conservées, durée premier/dernier échantillon distinguée du support temporel. [Bilan](BILAN_ALLEN_QC_v0.117.md).

[Comparer deux essais Allen](neurones.html?sample=allen-637038252&sweep=22&pairA=637038252%3A22&pairB=637038252%3A20&compare=1&v=0.118#compare-recordings) : axes physiques communs, lecture et détections source ; comparaison descriptive sans couplage biologique simulé. [Bilan](BILAN_ALLEN_PAIRS_v0.118.md).

Repère commun « Se repérer entre les échelles » sur les 19 pages : vues de référence, provenance et limites des passages. [Carte des vues](assets/navigation/MAP.json) · [Bilan](BILAN_NAVIGATION_v0.119.md). Les tâches de lecture entre échelles sont ajoutées au programme ; essais humains non réalisés.

[Raccord BigBrain : préparation et sources](BILAN_BIGBRAIN_REGISTRATION_v0.120.md). Étape historique d’acquisition des trois champs de déformation, complétée par l’aperçu v0.121 ci-dessous.

[BigBrain dans le repère de l’atlas humain](microstructures.html?bbframe=mni&bbatlas=1&v=0.121) : composition publiée 2015→2019, retour natif et comparaison CerebrA. [Contrôles et limites](BILAN_BIGBRAIN_WARP_v0.121.md).

[Repères anatomiques et écarts de recalage](microstructures.html?bbframe=mni&audit=1&afid=30&rater=Rater03&v=0.122) : deux évaluateurs publiés, écarts avant/après, contrôle aux 348 845 sommets. [Résultats et limites](BILAN_BIGBRAIN_VALIDATION_v0.122.md).

[Contrôle du maillage](microstructures.html?bbframe=mni&meshcheck=1&v=0.123) : 693 293 centres de triangles examinés, 86 écarts d’orientation localisés, source conservée. [Méthode et limites](BILAN_BIGBRAIN_TRIANGLES_v0.123.md).

[Aperçus de subdivision calculée](microstructures.html?bbframe=mni&meshcheck=1&facet=context-left%3A221730&refine=1&v=0.124) : comparer localement les 86 facettes signalées à des triangles plus fins, sans modifier les données anatomiques originales. [Méthode et portée](BILAN_BIGBRAIN_REFINEMENT_v0.124.md).

### v0.125 · Aperçus du raccord local

Le diagnostic BigBrain propose 86 aperçus indépendants de quatre faces. Les arêtes internes réutilisent les mêmes indices ; 24 aperçus gardent des alertes d’orientation chez les voisines. Aucun remplacement du cortex source. Voir [méthode et limites](BILAN_BIGBRAIN_NEIGHBORS_v0.125.md).

### v0.126 · Raffinement progressif du raccord

86 propositions testées avec conservation du contour et des anciens sommets. 26 oppositions ponctuelles restent dans 22 voisinages ; les données sources sont conservées et aucun remplacement global n’est appliqué. [Méthode, essais et limites](BILAN_BIGBRAIN_ADAPTIVE_v0.126.md).

### v0.127 · Zone de raccord élargie

Les 22 centres encore signalés passent le contrôle ponctuel après ajout d’une couronne. Huit oppositions restent dans les bordures de quatre aperçus. Les anciens sommets restent identiques ; le cortex source est conservé. [Méthode et limites](BILAN_BIGBRAIN_EXPANDED_v0.127.md).

### v0.128 · Orientation et contacts

Aucune opposition aux centres testés des 86 aperçus retenus. Les contacts entre triangles sont contrôlés séparément et restent signalés ; aucun remplacement global. [Méthode](BILAN_BIGBRAIN_CONFORM_v0.128.md) · [Relecture indépendante](REVUE_INDEPENDANTE_v0.128.md).

Contrelecture technique v0.128.1 : [calculs et corrections](CONTRE_REVUE_v0.128.1.md). Les résultats géométriques sont conservés ; la validation anatomique humaine reste ouverte.
