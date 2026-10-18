# POLY — générateur automatique d’intervalles v0.1

Date : 2026-09-27

## But
Transformer les données scientifiques déjà structurées d’une chaîne en une première animation pédagogique inspectable, sans fabriquer de continuité scientifique absente.

## Entrées utilisées
- nœuds : titre, statut, pédagogie, limites ;
- valeurs : mesure, horloge, portée, caveat, applies_to ;
- arêtes : origine, destination, statut, avertissement ;
- glossaire : personnages déjà disponibles.

## Sortie automatique par nœud
- un intervalle Ixx ;
- Entrée → Changement → Sortie ;
- statut de preuve ;
- temps associé lorsqu’une valeur temporelle compatible existe ;
- garde-fou scientifique ;
- raccord(s) vers les intervalles suivants ;
- storyboard 3 phases ;
- personnage existant ou jeton générique nommé.

## Règles de sécurité scientifique
1. Une valeur dont `clock_scope = NOT_DURATION` n’est jamais utilisée comme durée.
2. Un nœud `RECONSTRUCTED` reste explicitement reconstruit.
3. Un nœud `ND` ne devient jamais une interaction mesurée par l’animation.
4. Le statut d’une arête est conservé dans le raccord automatique.
5. Un raccord absent produit un STOP, pas une continuation inventée.
6. Le générateur ne déduit pas de causalité nouvelle entre deux séries distinctes.
7. Les personnages ne sont qu’une couche pédagogique ; le texte scientifique reste la source de vérité.

## Politique visuelle
- personnage connu → SVG du glossaire ;
- sinon → jeton textuel générique ;
- l’intervalle reste utilisable immédiatement ;
- un nouveau personnage peut remplacer le jeton sans modifier les données scientifiques.

## Exception C08
C08 conserve ses 13 intervalles manuellement audités. Elle sert de référence pour améliorer progressivement les patrons automatiques.
