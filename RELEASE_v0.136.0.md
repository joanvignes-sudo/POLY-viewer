# POLY v0.136.0 — Recalage exploratoire du sacrum : résultats et rejet documenté

Publication explicite demandée le 22 octobre 2026.

- Onze **propositions géométriques** de zones/repères osseux sur BodyParts3D 4.3 et Z-Anatomy, calculées par recherche de fenêtres de surface. Sept servent à la proposition d'ajustement, quatre sont réservées aux contrôles.
- **Zéro repère anatomique homologue expert validé** : les extrêmes géométriques des maillages ne sont pas des annotations cliniques et ne doivent pas être interprétés comme tels.
- Le RMS des quatre points candidats de contrôle diminue de 0,04913 à 0,03549 unité normalisée, MAIS la correspondance de surface des vertèbres lombaires L2, L4, L5 se dégrade nettement lorsque la transformation candidate s'étend à la chaîne.
- Décision : **ne pas appliquer le nouveau recalage candidat** ; préserver le référentiel Z-Anatomy commun du squelette adulte (206 os), sans casser ses relations avec les muscles.
- Atlas, sources, coordonnées, matrices, méthodes, six projections, jeu de repères suggérés et gabarit de revue humaine archivés. Les données testées sont publiées sans données personnelles ni dossiers locaux.
- Aucune nouvelle enthèse, jonction musculaire, déformation osseuse ou articulation anatomique validée.

[Page lisible de l'audit](sacrum-recalage.html) · [Points et métriques](recherches/sacrum/SACRUM_REPERES_CANDIDATS.json) · [Gabarit expert](recherches/sacrum/GABARIT_REPERES_ANATOMIQUES_VALIDATION.json)

Source méthode : https://github.com/Slicer/Slicer/blob/main/Docs/user_guide/registration.md
