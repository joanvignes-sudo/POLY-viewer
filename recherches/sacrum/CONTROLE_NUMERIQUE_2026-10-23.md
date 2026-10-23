# POLY — Contrôle numérique indépendant du recalage sacré (23 octobre 2026)

Source examinée : `recherches/sacrum/SACRUM_REPERES_CANDIDATS.json` de v0.136.0. Ceci est un audit des **résultats enregistrés**, pas un recalcul des maillages.

## Résultats
- Contrôle de 4 proxys géométriques réservés : RMS initial 0,04913 ; candidat 0,03549 (unités d'affichage normalisées). Gain apparent ≈27,8 %. Ces points ne sont **pas** des homologues anatomiques indépendants.
- Régression lombaire sur RMS vertex-vers-surface, calculée d'après les valeurs stockées :
  - L2 : 0,00491693 → 0,02444344, facteur 4,97.
  - L4 : 0,00544536 → 0,01338127, facteur 2,46.
  - L5 : 0,00370882 → 0,01242345, facteur 3,35.
- Le recalage sacré candidat ne peut pas être retenu sur ces critères. La transformation canonique doit rester inchangée.
- Les matrices comportent un facteur d'échelle implicite lié aux référentiels. Ne pas convertir les erreurs en millimètres : aucune calibration clinique du fichier OBJ n'est démontrée.

## Lacune de représentation
Le gabarit sacré contient 12 repères, tous à coordonnées nulles et non validés. Il manque un jeu symétrique sur le **coccyx** (base Co1, facette supérieure, cornes gauche/droite, apex coccygien). Le point « apex » sacré ne suffit pas à prouver la jonction sacro-coccygienne.

## Prochain protocole de mesure
1. Localiser les maillages coccygiens dans BodyParts3D et Z-Anatomy, avec IDs et SHA256.
2. Fixer les axes et les unités des deux atlas avant toute distance.
3. Annoter séparément apex sacré et base Co1 sur les deux maillages.
4. Contrôler l'orientation et la correspondance des facettes, puis les cornes et le hiatus.
5. Produire les distances inter-surfaces et cartes d'écart ; ne jamais inférer une enthèse d'une simple proximité.
6. Exiger une vérification anatomique indépendante avant de qualifier un homologue ou un rattachement.

## Verdict
**REJET DU RECALAGE CANDIDAT MAINTENU.** Aucun nouveau repère anatomique, placement osseux ou rattachement musculaire validé dans cette passe.
