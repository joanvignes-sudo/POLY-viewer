# POLY — Lecteur borné du squelette distinct

29 octobre 2026. Le lecteur des blocs `skeleton206` est disponible indépendamment du HRA et des références de membres/tronc.

Le manifeste exige les deux archives canoniques (géométrie et registre), leur provenance brute/compressée, 208 objets et 206 concepts, le statut non publié, la politique sans transformation et une couverture unique. Les chemins sont stricts ; chaque bloc reste au plus à 4 Mio. Le catalogue est chargé séparément, sans positions ni indices. Sa vérification lie la version exacte du manifeste et du catalogue à la lecture des blocs ; une copie forgée ou une modification ultérieure est refusée.

Les transferts reçoivent un signal d’annulation et un maximum d’octets. Gzip compressé, décompression bornée, empreinte brute et métadonnées sont vérifiés avant création des vues float64/uint32. Chaque objet conserve indice, pointeur JSON, objet source et concept osseux. Alignement, taille, chevauchement, fin du payload, valeurs finies et indices sont contrôlés. Aucun maillage, matériau, recalage ou transformation n’est créé par ce lecteur.

Validation : quatre nouveaux tests Node passent sur les quatre blocs réels, avec comparaison de toutes les coordonnées, indices et métadonnées aux 208 objets originaux. Ils couvrent également provenance altérée, couverture manquante, traversée de chemin, gzip altéré, chevauchement même après recalcul d’empreinte, budget insuffisant avant transfert, faux catalogue, mutation et pré-annulation. Suite Node complète : 140 réussites, zéro échec. Le workflow comprend la construction temporaire et ce test ; aucune CI distante déclenchée.

Le rendu et les commandes du squelette restent à raccorder. Les blocs demeurent hors dépôt et hors site ; aucune acquisition externe. Le délai intermittent de démarrage reste une limite non résolue. Cette étape n’est pas une validation anatomique ou biologique et ne mesure pas un téléphone physique.
