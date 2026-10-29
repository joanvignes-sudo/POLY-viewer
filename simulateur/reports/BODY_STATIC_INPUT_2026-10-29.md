# Gestes des vues statiques et traces de transfert

## Écart tactile corrigé

Les vues squelette et revue osseuse n'avaient qu'un état de glissement pour le dernier pointeur. Le squelette pouvait donc interpréter le relâchement du deuxième doigt comme un clic sur une surface. Le défaut a été reproduit sur un vrai triangle `skeleton206/0`, avec des contacts Chromium réels puis un événement de relâchement inversé explicitement synthétique. Ce détail est conservé : le protocole CDP termine normalement les contacts dans son propre ordre, il ne prouve pas tous les ordres de relâchement sur un téléphone physique.

Un contrôleur commun de caméra conserve uniquement identifiants de pointeurs et coordonnées scalaires de vue/écran. Un doigt tourne la vue ; deux doigts modifient la distance sans rotation. Tout geste multiple reste inéligible à la sélection jusqu'à sa fin. Un glissement qui revient à son origine ne devient pas un clic. Annulation, perte de capture, changement de sélection/source, page masquée et libération effacent le geste et les captures. Trois doigts interrompent le geste précédent sans produire de sélection.

Les canevas sont accessibles au clavier : flèches pour tourner, + / - pour zoomer, Échap pour annuler le geste. Les raccourcis modifiés du navigateur, dont Ctrl avec la molette, ne sont pas capturés. Distances et inclinaison sont bornées ; les coordonnées non finies ou les calculs de déplacement débordants ne corrompent pas la vue. Les lecteurs HRA et références, qui ont déjà leurs propres gestes et contrats de caméra, ne sont pas refondus.

Les instructions des deux pages ont été mises à jour. Source, noms, métadonnées, placements enregistrés, indices et coordonnées géométriques sont inchangés. Le pincement ne déforme aucune pièce et ne qualifie aucun recalage. La position et la distance de caméra sont des commandes de présentation, pas des observations biologiques.

## Journal du serveur local

Les interruptions de copie d'une ressource statique ou d'un bloc privé sont désormais journalisées avec le chemin de la ressource, le type d'exception et son code lorsqu'il existe. Les paramètres de requête ne sont pas copiés dans cette trace. Les BrokenPipeError, ConnectionResetError et ConnectionAbortedError restent des interruptions, pas des téléchargements réussis ni des retries. Les erreurs de lecture disque continuent de remonter.

Le journal porte explicitement `cause=unknown` : cette couche ne distingue pas une annulation volontaire d'une interruption du navigateur, du système ou du réseau. Le nouvel essai Python reproduit les trois types de déconnexion et vérifie aussi qu'une erreur disque n'est pas masquée. Il échouait avant le changement et passe après. Ceci prépare une collecte plus utile lors d'un prochain incident ; aucune cause du démarrage intermittent n'est revendiquée. La modification du serveur est active dans le serveur de qualification neuf, sans remplacement silencieux du serveur utilisateur existant.

## Vérification reçue

- **174 tests Node réussis**, zéro échec/ignoré : sept nouveaux tests du contrôleur, avec annulations, inversion de relâchement, pincement, bornes, raccourcis et destruction ; les contrôles exacts des données restent inclus.
- **24 tests Python réussis**, dont le nouvel essai de transfert interrompu ; suite complète relancée car le serveur est modifié.
- **Neuf suites navigateur ciblées réussies** sur un serveur local neuf utilisant le code actualisé : gestes statiques, squelette par blocs, interactions, squelette complet, reprise du catalogue, revue DB, retours de page, diagnostic des modules et démarrage des références.
- Pincement et navigation éprouvés par événements tactiles Chromium, ordre inversé de relâchement séparément synthétique. Toucher simple sur triangles conservé, absence d'erreur JavaScript et débordement horizontal vérifiés. Captures mobiles des deux vues inspectées.

Les anciens reçus des 35 scripts de la passe élargie précédente sont conservés ; ils ne sont pas déclarés réexécutés pour cette passe ciblée. La nouvelle suite porte à 36 le nombre de scripts navigateur configurés, pas le nombre exécuté ensemble aujourd'hui. Configuration CI mise à jour localement, sans lancement distant, push ou publication.

Reçus du chat : `POLY_STATIC_INPUT_RESULTS_20261029.json` et `POLY_STATIC_INPUT_BROWSER_REGRESSIONS_20261029.json`. Journaux du serveur et tests dans `work/static-input-server.log`, `work/static_input_browser`, `work/static-input-node.log`, `work/static-input-python.log`.

## Ouvert

Cause du démarrage intermittent, vue globale monolithique, mesures sur téléphone physique et qualifications scientifiques restent ouvertes. Aucun taux, latence, activation, force ou insertion n'est ajouté pour fermer ces points.
