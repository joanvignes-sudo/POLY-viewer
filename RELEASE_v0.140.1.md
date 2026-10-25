# POLY v0.140.1 — Graphe d'ancrages graphiques des muscles

**25 octobre 2026** — sur la base de v0.140.0 (les états de C4, modules de visualisation et systèmes physiologiques précédents sont conservés).

## Fonctionnalité

Dans le panneau gauche du visualiseur, nouveau bouton **Ancrages · 480**, puis l'inspecteur permettant :
- de rechercher les surfaces musculaires du corps et de la main ;
- de voir deux extrémités graphiques calculées par surface ;
- d'afficher les connexions candidates sur un muscle, une région ou les 480 surfaces ;
- de suivre la représentation pendant les postures illustratives ;
- de distinguer les liens de proximité des extrémités encore non résolues.

## Couverture

- 458 surfaces BodyParts3D dans le module musculaire principal + 22 surfaces intrinsèques de la main, soit 480 surfaces disponibles.
- 960 extrémités analysées, **942 proximités visuelles candidates**, **18 extrémités sans correspondance suffisamment proche**.
- 466 surfaces avec deux candidats, 10 avec un seul, 4 sans.
- 208 maillages source pour 206 os, avec **identification des sous-surfaces osseuses** (ne pas confondre les trois composantes du sternum).

## Qualification

La procédure relie **des sommets de surfaces**, pas des tendons ni des enthèses. Les limites et preuves de correspondance anatomique restent indépendantes. Les liaisons proposées ne contrôlent ni les muscles, ni les forces, ni le mouvement réel, ni la physiologie.

**Nombres de véritables points d'insertion validés, de trajets tendineux validés et de contraintes de force : 0.**

## Tests

Quatre tests automatiques : 480 identifiants, indices source et sous-surfaces osseuses vérifiés, distance graphique bornée et absence de fausse certification anatomique. JavaScript valide. Chrome desktop et mobile : bascule muscle/région/tout, 942 lignes possibles, posture debout/marche/course, aucune erreur console bloquante relevée.

[Rapport détaillé](simulateur/reports/ALL_MUSCLE_ANCHOR_GRAPH_2026-10-25.md) · [Graphe JSON](simulateur/data/all-muscle-display-anchors.json) · [Générateur](simulateur/scripts/build_all_muscle_display_anchors.py).

## Étape nécessaire à une attache biomécanique véritable

Créer des chemins muscle → tendon/aponévrose → os ou tissu documentés en anatomie et les enregistrer dans un référentiel commun avec validation indépendante. L'outil actuel rend cette tâche auditable et localise les zones à étudier, mais ne la remplace pas.
