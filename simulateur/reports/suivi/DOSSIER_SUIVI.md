# POLY — Suivi public de l’atelier

Version du 25 octobre 2026. Bêta ; étapes reçues, hypothèses et limites conservées. Les correspondances et registres privés ne sont pas publiés.

## A3 — recentrage Pellerin

2026-10-24 — reçu, périmètre documentaire

8 chaînes et 22 mécanismes documentaires ; états saisis, couleurs et interface stable. Cas spécifique non paramétré.

## A4 — lactate humain régional

2026-10-24 — reçu, périmètre régional

Régressions publiées évaluées dans leur domaine ; unités et reprise reçues. Aucun flux MCT2 ni ATP déduit.

## A5 — plusieurs hypothèses

2026-10-24 — reçu, stationnaire réduit

3 scénarios principaux × 4 hypothèses, 60 équilibres C4. Glu/Gln et faible contribution αKG restent difficiles à départager.

## A6 — suivi et projet de cascades 3D

2026-10-24 — dossier de suivi ; 3D à construire à ce stade

Registre cumulatif, étapes, sources, inconnues et critères pour passer à une projection spatiale. Localisation virtuelle autorisée, distincte du recalage mesuré.

## A7 — première projection C4 et progression réduite

2026-10-25 — modèle réduit vérifié ; validation expérimentale ouverte

Quatre hypothèses, montée/décroissance d’un traceur conditionnel en temps réduit, projection conservative sur 1 728 voxels virtuels. Solution vérifiée contre Decimal et RK4 indépendants ; aucune durée humaine, énergie ou anatomie cellulaire validée.

## A8 — qualification d’une horloge humaine candidate

2026-10-25 — qualification reçue ; candidat non raccordé

Pool en quantité par gramme trouvé dans une étude humaine glucose distincte. Erratum identifié mais contenu non reçu ; mélange de profils refusé. Contrôle exécutable des unités et contextes ; A7 conserve son temps réduit.

## A9 — lecture comparée des cascades

2026-10-25 — lecture reçue ; aucun nouveau modèle biologique

Courbes des quatre hypothèses, bilan instantané et commandes de lecture/pause/début/arrêt de la source/fin. Repère sauvegardé ; noyaux scientifiques inchangés.

## Vérification

A4 : 212 contrôles et 21 cas Decimal indépendants. A5 : 522 contrôles. A7 : 15 994 contrôles, 1 452 échantillons Decimal et comparaison RK4 indépendante. A9 : 863 contrôles de lecture. Ces vérifications numériques ne constituent pas une validation biologique.

## Portée

Le lactate régional, le marquage C4 et une puissance énergétique sont des quantités distinctes. Les positions 3D sont hypothétiques. Les états saisis ne sont pas des mesures. Pas de prédiction individuelle, de watts, d’ATP ni d’acquisition PET produite.


# POLY v0.139.0 — Expliquer les bilans et les voxels C4

- Dans l’atelier C4, « Pourquoi ce résultat ? Remonter le bilan » explique la variation instantanée, le marquage retenu et l’écart à Glu/Gln. Les parents sont sélectionnables et un retour permet de retrouver le résultat choisi.
- Un voxel virtuel de 0 à 1727 peut être sélectionné, repéré en jaune dans la projection et relié à son poids puis aux bilans des deux hypothèses. Les parts sont conservatives : leur somme retrouve le pool normalisé.
- Le journal JSON conserve l’instant réduit, les identités, sources, hypothèses, dépendances, indice, coordonnées virtuelles, graine et poids. La séance composée v3 conserve le modèle et le curseur ; l’indice de consultation du voxel est conservé dans le journal séparé, pas dans cette séance.
- Le suivi public intègre les étapes récentes. Les correspondances et registres privés restent exclus.

Réception locale A13 : 331 contrôles ; A14 : 495 contrôles et conservation des 1728 parts. Interface et export vérifiés dans le navigateur. Noyaux scientifiques reçus A7/A9 inchangés ; les anciens calculs ne sont pas rejoués.

Limites : dépendances mathématiques conditionnelles, pas démonstration de causalité expérimentale. Voxels hypothétiques, pas cellules observées ni concentrations locales. Aucun comptage de réactions moléculaires, temps humain, ATP, puissance ou acquisition PET ajouté. Les séries temporelles humaines originales et certaines corrections de source restent à qualifier. POLY reste une bêta et son périmètre global n’est pas achevé.

Les améliorations publiques v0.138.0 de présentation et de placement musculaire sont conservées. La thermique reste en pause et son moteur local n’est pas publié.


## Réseau métabolique contraint — 29 octobre

35 maillons, 42 relations et 13 parcours ; 16 croisements, relations entrantes/sortantes et sept fiches de couplage historiques. Noyau P7/P8 repris sans modification et réellement vérifié sur 243 états synthétiques. Douze séries locales sont rattachées à leurs opérateurs et contextes, sans paramètres à régler ni propagation quantitative inventée. 193 tests Node, 27 Python et suite navigateur ordinateur/mobile émulé passent. Chaîne biologique complète non calibrée et direction cellulaire non identifiée ; extension mécanistique et mesures discriminantes restent ouvertes. Rapport : `BODY_METABOLIC_NETWORK_2026-10-29.md`.
