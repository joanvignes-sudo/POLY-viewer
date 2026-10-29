# Annulation des lecteurs pendant SHA256

## Défaut reproduit et correction

Les lecteurs HRA et des références vérifiaient le signal d'annulation après le réseau et la décompression, mais pas après chaque attente de calcul SHA256. Une annulation pendant le premier digest pouvait donc laisser commencer le suivant ; pendant le dernier digest, le lecteur pouvait retourner un bloc malgré l'annulation. Les gardes de génération des appelants restent utiles, mais ne remplacent pas le contrat d'annulation du lecteur.

Trois contrôles ajoutés dans chaque lecteur arrêtent le parcours après les digests des métadonnées, du gzip et des octets décompressés. La raison originale d'annulation est préservée. Une opération WebCrypto déjà engagée n'est pas interrompue : c'est sa continuation qui est refusée. Aucun octet, identifiant, budget, provenance ou transformation de source modifié.

## Validation

Deux nouveaux tests couvrent chacun les trois frontières asynchrones avec les véritables fichiers source vérifiés. Avant correction, chacun échoue parce qu'un deuxième digest commence après l'annulation du premier. Après correction : aucun digest supplémentaire ni décompression après annulation des deux premiers, aucun bloc retourné après annulation du dernier.

167 tests Node passent, zéro échec/ignoré. Ils comprennent la comparaison exacte des 526 références et les vérifications des sources HRA et squelette. Tests navigateur ciblés réussis : démarrage des références avec manifeste/catalogue retenus, annulation réelle et reprise manuelle, cycles de libération/rechargement sur ordinateur et mobile émulé ; lecteur HRA avec réponse tardive annulée, nouvelle sélection conservée, manifeste absent et gzip corrompu refusés ; régression du repli classique.

Ces tests ne mesurent pas un téléphone physique et ne constituent pas une passe simultanée de toutes les suites navigateur historiques. Les tests Python ne sont pas rejoués pour ces six gardes JavaScript. Les horloges virtuelles des tests de délai ne sont pas des mesures de performance.

## Limites et suite

La cause du délai intermittent de démarrage reste inconnue. Cette correction précise d'annulation ne clôt pas cette investigation, ni la parité exhaustive de la vue monolithique ou la validation biologique. Conserver les traces et chercher une nouvelle reproduction informative avant d'attribuer une cause au délai.
