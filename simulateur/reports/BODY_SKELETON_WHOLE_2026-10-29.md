# POLY — Squelette source complet sous budget explicite

29 octobre 2026. Le lecteur skeleton206 peut maintenant présenter les 208 objets correspondant aux 206 concepts osseux de la source distincte, sans superposition HRA ni recalage individuel.

Le bouton dédié ne change pas automatiquement le budget. À 4 Mio, la demande complète est refusée avant toute requête de bloc. Avec 16 Mio explicitement choisis, un plan additionne une seule fois les quatre blocs, soit 12813792 octets bruts. Chaque bloc demeure vérifié et borné à 4 Mio. Les lectures sont séquentielles et annulables ; elles ne sont installées dans la scène qu’après vérification de l’ensemble. Une corruption du dernier bloc conserve la scène précédente.

L’agrégat retient les vues numériques des blocs sans concaténation supplémentaire ni quantification des sources. Les copies Float32 d’affichage restent distinctes. Le budget porte sur les octets bruts conservés, hors catalogue, copies graphiques, objets, GPU et buffers transitoires lors du remplacement. Il ne mesure pas la mémoire physique. Réduire le budget à 4 Mio libère automatiquement une sélection qui dépasse cette limite, sans rechargement automatique.

Les filtres région/concept, la présentation d’un seul objet ou de tous les résidents, le picking source et les commandes de caméra restent disponibles. Le compte des objets ne devient pas un compte d’os supplémentaires. Les sources, leurs évaluations et licences restent intactes ; aucune transformation historique n’est appliquée une seconde fois.

Validation : deux nouveaux tests de planification/lecture réelle et suite Node complète de 143 tests réussis. Nouvelle suite navigateur ordinateur/mobile : refus sans transfert sous budget insuffisant, scène précédente conservée après corruption du dernier bloc, reprise explicite, 208 objets/206 concepts présentés, filtres conservés et libération lors de réduction de budget. La suite de filtres/picking/annulation réseau repasse aussi. Aucune erreur de page. Les tests navigateur nécessitent la prévisualisation locale et ses blocs hors dépôt.

Cette avancée concerne le squelette source Z-Anatomy et non les 80 surfaces de revue DB. Le pilote nerveux global reste distinct. La cause du délai intermittent de démarrage n’est pas déclarée corrigée. Aucune validation biologique ou mesure sur téléphone physique ajoutée.
