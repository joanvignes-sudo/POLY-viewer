# Six détails synaptiques H01 · v0.111

Les six annotations associées au neurone 1072605926 disposent chacune d’une fenêtre EM native. La première fenêtre et toutes les données de v0.110 sont conservées ; cinq fenêtres sont ajoutées sans nouvelle annotation biologique.

## Acquisition et précision

- Cinq nouvelles images 256 × 256 × 32, 4 × 4 × 33 nm ; champ 1,024 × 1,024 × 1,056 µm chacune. Deux extrémités source incluses dans chaque fenêtre.
- Masque binaire de la même cellule depuis proofread_104, 128 × 128 × 32, 8 × 8 × 33 nm. Pas d’affinement artificiel à 4 nm.
- 10 485 760 valeurs d’image nouvelles comparées à un décodage indépendant TensorStore 0.1.85, aucune différence. Les 2 621 440 valeurs de segmentation sont lues avec TensorStore ; aucun contrôle indépendant du décodeur des masques n’est revendiqué.
- Au total, six détails : 12 582 912 valeurs d’image comparées indépendamment et 3 145 728 valeurs de segmentation lues. Neuf fenêtres incluant les trois fenêtres d’exploration initiales.
- Images acquises par plages avec générations et ETags contrôlés ; empreinte SHA-256 de chaque plage, pas du shard complet. Les plages originales des masques lus avec TensorStore ne sont pas archivées ni annoncées comme épinglées.
- JPEG source avec pertes ; pixels décodés conservés, sans prétention de compte brut du détecteur. Échantillonnage anisotrope, pas pouvoir résolvant isotrope garanti.

## Parcours

[Microscopie](microscopie.html?level=synapse4&v=0.111) : sélectionner une annotation, ouvrir son détail, passer à la précédente/suivante en conservant le niveau natif. Choisir un niveau synaptique dans le menu sélectionne l’annotation correspondante. Le repère du fragment revient explicitement au contexte si nécessaire. Chaque vue garde son URL partageable. Deux volumes maximum sont conservés dans le cache.

Les contrôles pré/post sont indiqués pour l’annotation sélectionnée. Les trois extrémités sur voxels C3 non étiquetés (0) restent signalées, sans correction de coordonnées. Les détails ne rendent pas ces trois correspondances ponctuelles confirmées.

## Limites scientifiques

Les relations pré/post restent celles de la source C3, avec la portée locale documentée en v0.110. Aucune nouvelle synapse, activation, latence, force, causalité ou traduction excitatrice/inhibitrice n’est inférée. Pas de recalage avec un autre prélèvement. Les traits relient deux points annotés ; ils ne montrent pas une transmission observée.

[Provenance et empreintes](assets/h01-details/PROVENANCE.json) · [Acquisition](assets/h01-details/ACQUISITION.json) · [Contrôles des nouvelles images](assets/h01-details/VALIDATION.json) · [Annotations initiales](assets/h01-synapses/PROVENANCE.json) · [Crédits et licence CC BY 4.0](assets/h01-synapses/CREDITS.md).

Sources : Lichtman laboratory / Harvard et Connectomics at Google, H01 20210601 (images et segmentation), 20210729/c3 (synapses), https://h01-release.storage.googleapis.com/data.html ; Shapson-Coe et al., Science (2024), doi:10.1126/science.adk4858.

Suite : correspondance avec les identifiants des tables de validation humaine ; essais de lecture avec spécialistes et apprenants. Le registre scientifique EXPLORATION_v0.98.json est inchangé.
