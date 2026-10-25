# POLY v0.139.0 — Expliquer les bilans et les voxels C4

- Dans l’atelier C4, « Pourquoi ce résultat ? Remonter le bilan » explique la variation instantanée, le marquage retenu et l’écart à Glu/Gln. Les parents sont sélectionnables et un retour permet de retrouver le résultat choisi.
- Un voxel virtuel de 0 à 1727 peut être sélectionné, repéré en jaune dans la projection et relié à son poids puis aux bilans des deux hypothèses. Les parts sont conservatives : leur somme retrouve le pool normalisé.
- Le journal JSON conserve l’instant réduit, les identités, sources, hypothèses, dépendances, indice, coordonnées virtuelles, graine et poids. La séance composée v3 conserve le modèle et le curseur ; l’indice de consultation du voxel est conservé dans le journal séparé, pas dans cette séance.
- Le suivi public intègre les étapes récentes. Les correspondances et registres privés restent exclus.

Réception locale A13 : 331 contrôles ; A14 : 495 contrôles et conservation des 1728 parts. Interface et export vérifiés dans le navigateur. Noyaux scientifiques reçus A7/A9 inchangés ; les anciens calculs ne sont pas rejoués.

Limites : dépendances mathématiques conditionnelles, pas démonstration de causalité expérimentale. Voxels hypothétiques, pas cellules observées ni concentrations locales. Aucun comptage de réactions moléculaires, temps humain, ATP, puissance ou acquisition PET ajouté. Les séries temporelles humaines originales et certaines corrections de source restent à qualifier. POLY reste une bêta et son périmètre global n’est pas achevé.

Les améliorations publiques v0.138.0 de présentation et de placement musculaire sont conservées. La thermique reste en pause et son moteur local n’est pas publié.
