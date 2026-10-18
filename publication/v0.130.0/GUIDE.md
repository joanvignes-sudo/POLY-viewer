# POLY — retrouver le fil visuel des intervalles

Correction locale du 18 octobre 2026, après suspension de la canonisation et de la publication. Version précédente et tous les originaux conservés. Base : POLY_TOUTES_CHAINES_2026-10-18 ; catalogue scientifique et bibliothèque inchangés.

Le catalogue avait remplacé le suivi du trajet : tour limité au même maillon, horloges du trajet et de l’encart indépendantes, ralentissement insuffisant. Cette correction ajoute une carte persistante des intervalles et de leurs raccords recensés : point lumineux, trace conservée pendant la consultation d’une chaîne, sélection directe, défilement horizontal recentré lors du changement d’intervalle, position manuelle, pause/reprise, 6/12/24/60/120 secondes visuelles par intervalle. Par défaut : 24 secondes. Les animations détaillées et leur agrandissement suivent cette même position. La marche reste indépendante.

Les continuations explicites historiques priment sur l’ordre des cartes. Exemple C01 : lumière I01 → I02, raccord documentaire vers I05, et branche mécanique I03 → I04 ; aucun faux enchaînement I02 → I03. Sans continuation explicite, utiliser seulement la décomposition contiguë d’un même maillon/branche ou une relation du registre. Les branches multiples, préparations différentes, conditions, lésions, lacunes et reconstructions nécessitent un choix explicite. Les options de continuation sont affichées au même endroit que le trajet. Revenir à une carte ne supprime pas la trace déjà parcourue ; changer de chaîne la réinitialise.

La carte est un schéma de lecture, pas une localisation anatomique. Les coordonnées des cartes ne prétendent pas représenter un nerf. Le tracé 3D n’est affiché que pour les relations déjà localisables par les repères humains existants et autorisées par le moteur précédent. Exemple vérifié : Hassanpour I05 → I06. Les mécanismes cellulaires/animaux restent des mécanismes documentaires, sans transposition implicite sur ce corps humain. Les descriptions, mesures, temps et sources n’ont pas été réécrits.

## Utilisation

Ouvrir corps.html via un serveur local (ne pas ouvrir en file://). Choisir chaîne et intervalle, puis « Suivre la chaîne » sur la carte. « Temps pour regarder » règle la durée d’observation de chaque intervalle, sans conversion en secondes biologiques. Le curseur peut être déplacé dans les deux sens, en pause. « Agrandir » ouvre le mécanisme détaillé au même état. Aux pointillés, lire la réserve et choisir explicitement la continuation proposée.

Depuis le dossier livré : `python preview.py`, puis ouvrir http://127.0.0.1:27095/corps.html . Le port 27094 est la copie de travail présentée lors des essais.

## Contrôles exécutés

- Tests du nouveau lecteur : horloge, pause/reprise, déplacement manuel, vitesses, bornes et fins ; 78 groupes, 544 intervalles, 524 raccords consultables, 514 nécessitant confirmation. Ces nombres décrivent des occurrences documentaires, pas des expériences indépendantes.
- Régression du catalogue : 544 rendus, 531 occurrences de nœuds, 511 relations, 146 valeurs, 282 références, 45 repères temporels inchangés. Régression moteur et géométrie cérébrale : succès.
- Navigateur : cartes des 78 entrées, total 544 cartes sans différence ; les 14 chaînes canoniques sont présentes. Six mécanismes à position 50 % : C01, C02, C08, Hassanpour, Inman, FILMS, encart et phase cohérents ; agrandissement inspecté. Départ ralenti, transition I01 → I02 et arrêt avec proposition I05 observés. Position 40 % puis 50 % stable en pause. Tracé 3D autorisé de Hassanpour inspecté. Vue mobile testée avec réglage demandé 390×844, largeur de contenu effectivement mesurée 375 px, aucun débordement de page.
- Le premier essai révélait une commande de vitesse rejetée par l’ancien encart ; l’acceptation et le pilotage par position ont été corrigés. Les cadres en cache nécessitaient aussi une version d’URL explicite. Initialisation et synchronisation disposent maintenant d’un fragment local de secours. Six rendus recontrôlés après correction.
- Un clic de test sur Pause a expiré car la lecture avait déjà atteint son arrêt : l’état I02/100 % et le choix I05 ont été inspectés, sans considérer cet incident comme un échec de lecture.

## Limites et suite

Les 544 animations n’ont pas été regardées intégralement à toutes les vitesses dans le navigateur pendant cette passe ; leurs rendus et raccords ont été contrôlés automatiquement. Les transitions SVG à longue portée restent schématiques et peuvent se croiser. Le personnage reste une illustration ; ses mouvements et ce parcours ne sont pas une simulation physiologique validée. Une animation 3D de chaque chaîne dans des structures anatomiques identifiées nécessite encore des correspondances documentées, absentes pour la majorité de ces mécanismes. Cette livraison rétablit le suivi visuel, sans déclarer ce travail anatomique achevé.

L’erreur MutationObserver du navigateur instrumenté, déjà reproduite précédemment dans une page sans scripts, est encore observée. Elle n’est ni attribuée à POLY ni déclarée résolue. Les animations testées s’affichent malgré cette erreur.

La validation scientifique, la validation d’usage auprès de personnes et l’accessibilité avec assistance restent à réaliser. Aucun push, déploiement, contact, assistant ou automatisation. Publication autorisée par Joan après revue visuelle ; voir RELEASE_v0.130.0.md et VERSION.json.

Contrôles reproductibles : `node test-journey.cjs`, `node test-catalogue.cjs`, `node test-engine.cjs`, `node test-brain.cjs`, `python verifier.py`. Le manifeste permet de vérifier l’intégrité de la livraison ; cette intégrité ne valide pas ses interprétations scientifiques.


La livraison locale figée reste le témoin de la version approuvée. La publication modifie uniquement le badge de version, les métadonnées de canonisation et les adresses de poste de travail dans quatre fichiers de provenance. Les commandes locales décrites ci-dessus concernent le supplément local, pas ce sous-dossier public.
