# POLY — Couche osseuse animée et carte documentaire régionale

29 octobre 2026, poursuite explicitement demandée après la fenêtre nocturne. Développement local ; blocs générés conservés hors dépôt et site public.

## Couche osseuse d’avatar

La véritable fabrique historique `avatar-bones.js` reçoit les 208 objets / 206 concepts Z-Anatomy depuis les quatre blocs vérifiés. Un budget brut distinct de 16 Mio est demandé ; le choix de 4 Mio est refusé avant téléchargement du catalogue et des géométries. Total brut source : 12 813 792 octets. Ce budget exclut les copies graphiques, objets, métadonnées, temporaires et mémoire physique GPU.

La recette graphique historique des bras est conservée : bandes extrêmes de centroïdes et adaptation aux pivots d’activité existants. Ce ne sont ni des repères anatomiques mesurés ni une registration individuelle validée. La page indépendante du squelette conserve la vue source sans cette adaptation. Les coordonnées float64 et indices uint32 d’origine restent inchangés ; les copies float32 servent au rendu. Les valeurs des quaternions du vrai rig régional sont converties en quaternions Three.js pour la composition matricielle, avec égalité exacte aux matrices du rig classique pour les cinq poses testées.

La couche propose os seuls/contexte, région, concept, centrage et picking historique. Le clic privilégie les os ; cette règle est expliquée dans l’interface. Marche, course, assis, allongé et geste de repas restent des illustrations. La lecture des gestes fonctionne aussi avec cette référence seule, sans bloc HRA résident. Le masquage du contexte ne dure que le rendu synchrone, puis les visibilités sont restaurées. Retrait et perte de contexte détruisent les 208 géométries, matériaux, commandes et écouteurs ; aucune reconstruction automatique après restauration WebGL.

## Carte documentaire

La fabrique historique `documentary-network.js` est raccordée au véritable moteur déjà utilisé par les fiches régionales. Elle ne crée pas de second moteur et ne fait pas avancer une seconde horloge. Les commandes des cartes 2D/3D et des fiches partagent dossier, étape, branche, progression et historique. Les commandes retirées ou provenant d’une génération de carte précédente deviennent inertes.

Les points sont les centres des limites des surfaces HRA résidentes dont le chemin est explicitement qualifié (cœur, poumons, peau, œil, cerveau entier). Ils sont des repères de présentation, sans localisation individuelle. Aucune correspondance n’est inventée pour amygdale, insula, striatum ou préfrontal. Les frontières, hypothèses, conditions et comparaisons restent dans la carte 2D sans segment 3D. Les lignes représentent les relations documentaires source ; elles ne sont pas des nerfs segmentés, trajets mesurés ou preuves de causalité.

Les lignes disparaissent à la libération de leurs sources. Les buffers de positions et distances sont alloués à la création puis mis à jour en place, au lieu d’être remplacés à chaque image. Identité des attributs et distance float32 comparée au calcul géométrique testées ; aucun gain FPS/GPU/téléphone n’est déduit. Retrait, remplacement du dossier et perte de contexte libèrent les géométries et matériaux. Le retrait de la carte ne détruit pas le moteur documentaire appartenant aux fiches.

Le manifeste régional exige maintenant l’empreinte supplémentaire de `documentary-network.js` (sept ressources). Les anciens exports incomplets à six ressources sont explicitement refusés ; aucune migration silencieuse. Le format et la provenance du corps classique restent distincts.

## Validation et limites

154 tests Node passent, dont assemblage exact des 208 objets et équivalence des matrices. Deux nouvelles suites navigateur testent ordinateur et mobile émulé : budget, poses/lecture, filtres, retrait/rechargement et perte de contexte ; carte sans source puis avec les véritables blocs cœur/poumons, état partagé, frontière, absence de repère cérébral inventé, attributs stables et commandes périmées. Régression des manifestes régionaux et parcours classique combiné vérifiés séparément. Les 23 tests Python précédemment réussis ne sont pas présentés comme réexécutés pour ce changement JavaScript.

Une passe concurrente a dépassé les délais de démarrage (45 s régional, 120 s classique), avant les interactions nouvelles. Échecs conservés dans `work/regional-documentary-graph-regression.log` et `work/classic-documentary-graph-regression.log` à la racine du chat. Les diagnostics des requêtes en attente sont ajoutés aux tests. Le passage isolé suivant ne prouve pas la correction de cette intermittence. Deux erreurs initiales de test ont aussi été corrigées : égalité float64 attendue avec .6/3, événement SVG par dispatchEvent ; le scénario classique utilise un indice d’option et non son identifiant source. Aucun comportement source n’a été changé pour ces assertions.

Le chantier ne valide aucun recalage entre bibliothèques ni une anatomie individuelle. Les interactions exhaustives de l’atelier monolithique membres/tronc, accessoires d’activité, qualification des groupes d’occultation, cause du démarrage et mesures sur téléphone physique restent explicitement distincts des raccordements validés ici. Aucune publication, fusion ou opération distante.
