# POLY Viewer v0.22 — finition des animations

Date : 2026-10-03

## Décision de périmètre
La couche émotionnelle est reconnue comme un manque fonctionnel du prototype, mais elle n'entre pas dans cette passe. La v0.22 doit d'abord terminer la couche visuelle et interactive existante afin de disposer d'un socle stable avant d'ajouter une nouvelle dimension interprétative.

## État de départ
- C01 possède des actions manuellement structurées et des personnages dédiés.
- C08 possède 13 intervalles manuels raffinés et reste la référence d'audit visuel.
- C02–C07 et C09–C12 sont générées automatiquement à partir des données embarquées.
- Le viewer expose 94 intervalles visibles au total.
- Le générateur conserve les statuts ND, RECONSTRUCTED, les STOP et les garde-fous de chronologie.

## Objectif
Remplacer progressivement les représentations génériques restantes par des patrons visuels réutilisables, spécifiques au mécanisme montré, sans ajouter de continuité ni de causalité absente des données scientifiques.

## Ordre de travail
1. Inventorier les scènes génériques de C02–C07 et C09–C12.
2. Regrouper les intervalles par famille visuelle : transport, liaison, diffusion, conversion, ouverture de canal, propagation, métabolisme, changement d'état, interaction cellule-cellule, branchement/STOP.
3. Créer ou réutiliser les personnages et objets nécessaires.
4. Ajouter des patrons visuels dédiés uniquement lorsqu'ils améliorent réellement la compréhension.
5. Auditer les raccords entre intervalles et les nœuds complexes.
6. Vérifier la cohérence des trois phases Entrée → Changement → Sortie.
7. Tester boucle, navigation, plein écran, mobile, glossaire et absence d'erreurs JavaScript.
8. Mettre à jour README et changelog.

## Règles
- Durée d'animation ≠ durée biologique.
- Une absence de mesure reste ND.
- RECONSTRUCTED reste visible.
- Aucune causalité nouvelle n'est inférée par le dessin.
- Les personnages sont pédagogiques ; les données scientifiques restent la source de vérité.
- Un patron générique vaut mieux qu'un mécanisme inventé.

## Après v0.22
Ouvrir un chantier séparé `EMOTIONAL_LAYER` : définir d'abord ce que l'on représente (valence, arousal, pertinence, état corporel, motivation, contexte affectif, etc.), quelles mesures biologiques peuvent le soutenir, et comment l'afficher sans faire croire qu'une émotion est localisée dans un unique nœud ou transmise par une molécule unique.
