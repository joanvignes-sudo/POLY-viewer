# Six repères H01 dans leurs images natives · v0.115

Six fenêtres choisies par la même règle : enregistrement médian dans l’ordre de la table native, parmi les points de chaque classe (axon, AIS, myelinated axon, dendrite, soma, astrocyte). Cette sélection déterministe n’est pas un échantillon anatomique représentatif.

Chaque fenêtre : 256 × 256 × 32 valeurs d’image à 4 × 4 × 33 nm et masque 128 × 128 × 32 à 8 × 8 × 33 nm, acquisition H01 20210601, segment 1072605926. Les points source sont joints exactement aux sommets natifs dans la v0.114 ; aucun déplacement pour forcer une concordance n’est effectué.

12 582 912 valeurs d’image décodées par Pillow ont été comparées à TensorStore : zéro différence. 3 145 728 valeurs de masque ont été lues par TensorStore, sans seconde comparaison de décodeur pour ces six fenêtres. Les PNG sont vérifiés sans perte supplémentaire ; la source JPEG est déjà compressée. Le masque affiché est agrandi par plus proche voisin, sans résolution ajoutée.

Les six points ont l’identifiant 1072605926 dans le masque. Cela vérifie une concordance spatiale, pas la classe biologique. L’étiquette astrocyte reste à examiner. Aucun temps, activité ou raccord à un autre donneur n’est déduit.

Sources, empreintes et lectures de plages épinglées par génération : [provenance](assets/h01-class-images/PROVENANCE.json). Les empreintes des plages ne sont pas celles des shards entiers. [Crédits et conditions H01](assets/h01-synapses/CREDITS.md).

Interface : six sélections, 32 plans, retour au point source, masque et opacité, croix source sur son seul plan, agrandissement, état partageable et export documentaire. Navigation vers le parcours 3D et les synapses conservée. [État du programme](suite.html#consolidation).
