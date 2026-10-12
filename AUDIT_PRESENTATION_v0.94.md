# POLY v0.94 — bilan du socle et prochaines contributions
12 octobre 2026.

## Programme de consolidation
| Priorité | Résultat | Limite restante |
| --- | --- | --- |
| Stabilité et annotations | Parcours complets contrôlés, erreurs de chargement explicites, imports atomiques, récupération du stockage, reprise des comparaisons, essai d’endurance | Essai de 15 minutes, pas une certification d’une heure ; appareils et navigateurs des lecteurs à tester |
| Admission des données | Contrôleur commun au navigateur et à l’outil d’admission, vérification des liens locaux et empreintes anatomiques, règles documentées | Relecture scientifique humaine toujours nécessaire |
| Première anatomie humaine | 17 composants CerebrA dans MNI152NLin2009cSym, rotation, sélection, zoom, transparence, isolation et éclatement | Atlas moyen, surfaces échantillonnées à deux voxels ; pas de cellule, fibre ou nerf vague mesuré |
| Premier parcours humain | P8, cinq maillons et quatre relations conservés ; contexte amygdalien visible pendant la lecture | Aucun recalage des électrodes de P8 ; délais entre relations ND ; causalité complète non démontrée |
| Praticité et échanges | Deux protocoles d’essai, export local du retour, formulaire d’observation publique GitHub | Aucun test auprès de lecteurs encore réalisé ; forum intégré à configurer avec le responsable |

## Ce qui est préservé
C01–C14 : 172 maillons et 165 relations. 50 parcours documentés dont 22 humains. Les mesures et leurs portées restent celles de la v0.93. Lire quatre dossiers ensemble reste une comparaison visuelle ; cela ne calcule pas leurs effets biologiques combinés. Le canon v0.92 reste la direction de travail.

## Changements vérifiables
Les douze adresses relatives de sources incorrectes ont été remplacées par les sources publiques ou synthèses correspondantes, avec l’ancien emplacement conservé. Les comparaisons conservent les quatre positions et la visibilité dans le lien. Les indices de navigation sont bornés. Les lectures s’arrêtent quand la page est masquée ou le contexte graphique perdu. Les erreurs de registre affichent une possibilité de reprise sans modifier les annotations.

La référence humaine est ouverte depuis l’anatomie de l’atelier, en conservant dossier et maillon pour le retour. Elle reste distincte du corps schématique : aucun raccord géométrique n’est revendiqué. Le parcours P8 reste lisible en cinq étapes dans cette vue ; la cadence de lecture de deux secondes est une présentation.

## Anatomie et précision
Source : CerebrA, Manera, Dadar, Fonov et Collins (2020), étiquettes sur template MNI-ICBM152 symétrique 2009c. Les surfaces correspondent aux cortex gauche/droit, amygdales, hippocampes, insulas, thalamus, caudés, putamens, cervelets et tronc cérébral. Extraction marching cubes, niveau 0,5, pas de deux voxels, sans lissage. Segmentation source à 1 mm ; cela ne garantit pas une exactitude individuelle à 1 mm. 148 177 sommets, 299 550 triangles. Coordonnées RAS+ en millimètres, affine et identifiants dans le registre anatomique. Transformation d’affichage uniforme (x, z, −y)/50. Éclatement uniquement pédagogique.

[CerebrA — article](https://www.nature.com/articles/s41597-020-0557-9), [MNI — atlas et permission](https://nist.mni.mcgill.ca/icbm-152-nonlinear-atlases-2009/), [segmentation source](https://packages.bic.mni.mcgill.ca/mni-models/icbm152/mni_icbm152_nlin_sym_09c_CerebrA_nifti.zip). Source, étiquettes, empreintes et licences CC0/MNI conservées dans assets/anatomy/.

## Ancrage humain P8
[Article primaire H01](https://pmc.ncbi.nlm.nih.gov/articles/PMC5148230/). P8 est une personne supplémentaire, avec LFP amygdalien pendant la reconnaissance ; l’association enregistrée porte sur 24 essais peur-inspiration. Elle ne prouve ni une peur ressentie, ni une médiation causale, ni une réplication de groupe. Les deux amygdales affichées sont des repères de l’atlas : aucune latéralité expérimentale n’en est déduite. Les autres opérations restent sans emplacement cérébral assigné. Coordonnées d’électrodes, imagerie individuelle et transformation de recalage ne sont pas acquises.

## Vérifications et portée des résultats
- VERIFICATION_v0.94.json : catalogue complet, 172 maillons/165 relations, 50 parcours, cinq modes, rotation, intervalles et sources, annotations, comparaison, retour du dossier, vues mobiles.
- INTEGRITE_v0.94.json : erreurs injectées de structure et de cible, coordonnées finies, indices des triangles, limites de maillages et orientation hémisphérique.
- ROBUSTESSE_v0.94.json : stockage illisible/quota, import partiellement invalide, registre indisponible/incohérent, absence de WebGL, perte/restauration graphique simulée, atlas humain, lecture P8, mobile et export de retour.
- ENDURANCE_v0.94.json : durée réelle, nombre d’actions, mémoire après collecte, géométries et erreurs consignés. Essai de 15 minutes en Chrome avec WebGL logiciel. Ce n’est pas un résultat d’essai auprès d’un utilisateur.

Les tests techniques ne démontrent pas la praticité pour les spécialistes. Des lecteurs réels sont nécessaires.

## Ce qui nécessite une aide extérieure
Des spécialistes et apprenants pour exécuter les essais ; un jeu individuel avec droits et repères documentés pour un vrai recalage expérimental ; un choix de service et de modération pour des commentaires intégrés ; de nouvelles données compatibles pour relier les échelles. Aucune de ces absences n’est comblée par une animation.
