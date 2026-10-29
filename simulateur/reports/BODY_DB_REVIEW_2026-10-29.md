# POLY — Revue DB indépendante après reprise explicite

29 octobre 2026. La reprise utilisateur après clôture nocturne autorise de poursuivre les fonctions restantes ; l’automatisation supprimée n’a pas été recréée.

Une page autonome bone-review-lab.html, accessible depuis anatomy.html, donne accès aux 80 surfaces de revue (79 BodyParts3D 4.3 et un candidat coccyx Z-Anatomy). L’archive existante est vérifiée par ses empreintes compressée/brute, avec transfert borné et décompression limitée à 15286674 octets. Aucun maillage ni WebGL n’est créé avant la commande de présentation.

Région, surface, initialisation et ajustement enregistrés sont consultables. Le lecteur utilise les tableaux conservés dans le fichier, sans réestimation de transformation. Les deux séries de métriques et toutes les métadonnées non géométriques sont conservées dans la fiche ; les licences et limites du registre sont visibles intégralement. Aucune registration validée n’est revendiquée.

Les 54 surfaces de comparaison de mains sont BodyParts3D 4.0, pas une segmentation HRA indépendante. Les cibles HRA absentes du fichier ne sont pas téléchargées ni reconstruites. Leur absence est indiquée. Les rôles ajustement/contrôle gardent les couleurs historiques, sans devenir une note de validité anatomique. Le coccyx candidat reste distinct du coccyx HRA historique.

Les ressources graphiques sont construites pour la sélection, nettoyées au remplacement, à la libération, à la sortie et à la perte de contexte. La restauration ne recharge rien automatiquement. Le premier test a exposé une erreur de rendu pendant la perte de contexte ; le contexte WebGL est désormais vérifié avant programmation et exécution d’une image dans cette page et dans le lecteur du squelette. Les tests de perte/récupération passent ensuite.

Validation : 148 tests Node réussis, dont deux nouveaux tests de source réelle, 80 surfaces/54 comparaisons, conservation exacte des positions initiales/ajustées, filtres, refus de corruption et pré-annulation. Suite navigateur ordinateur/mobile réussie : aucune géométrie initiale, 7 cervicales sans cibles HRA fictives, 27 surfaces et 27 comparaisons de main gauche, candidat coccyx séparé, perte/récupération de contexte avec libération et aucune acquisition de HRA/avant-bras/main externe. La suite du squelette existante repasse.

Limites : archive entière de revue chargée à la demande (3,8 Mo comprimés, 15,3 Mo JSON), pas encore de blocs dédiés ; les nombres JSON et copies graphiques consomment davantage que ces octets. Pas de mesure de RAM/GPU physique ni de téléphone. La cause du délai intermittent de démarrage reste inconnue. Les contrôles spécifiques de comparaison au contexte HRA et les recalages individuels ne sont pas déclarés transférés.
