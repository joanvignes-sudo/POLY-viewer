# POLY — États matériels et masques classiques, 29 octobre 2026

## Réception du travail de l’autre chat
Les commits daf84da (profil global explicite 526 références) et 6d67dd6 (file serveur et premier contrôle classique) ont été relus sur une branche propre. Aucun réappliquage de l’ancienne sauvegarde WIP. Le profil local conserve 4 Mio ; le profil global demande explicitement 96 Mio. La capacité TCP accrue atténue la charge du banc local, sans établir la cause des échecs intermittents historiques.

## Défaut reproduit et corrigé
La peau classique démarrait avec une opacité de 0,035, mais un aller-retour du bouton la rétablissait à 0,09. Le libellé seul masquait cette différence. Le test renforcé a échoué sur les quatre matériaux concernés avant correction. Une constante partagée rétablit désormais exactement l’opacité initiale ; le test compare aussi transparence et écriture de profondeur. Il s’agit d’un réglage graphique, sans signification biologique.

## Les 74 puis 134 os
Une observation instrumentée des écritures de visibilité identifie coherentLayers, appelé par render, comme origine des 60 masquages. L’ouverture classique active son contexte enrichi avant-bras/tronc ; la règle referenceLowerBones écarte ces surfaces natives quand ce contexte est actif. L’interrupteur réactive momentanément les 134 surfaces ; le rendu réapplique ensuite le masque et ramène les mêmes 74 identités visibles. Aucune règle de masque n’a été modifiée. La nouvelle assertion attend deux callbacks de rendu et compare les identités source, plutôt qu’un simple nombre lu avant stabilisation.

L’observation porte sur les états de scène JavaScript, pas sur un comptage GPU ou une validation anatomique. Le script instrumenté reste hors dépôt ; il ne constitue pas un banc de performance.

## Vérifications
- 178 tests Node : réussis, zéro échec, zéro ignoré après correction.
- classic-controls-parity-browser : réussi sur ordinateur et mobile émulé ; mêmes identités osseuses après rendu, mêmes matériaux de peau après aller-retour, commandes documentaires préservées.
- attachments-browser et classic-cogitate-browser : réussis sur ordinateur et mobile émulé (œil/P1, inspection, catalogues, quatre étapes COGITATE, 78 dossiers / 544 intervalles, os graphiques, graphe et accessoires).
- Les 25 tests Python restent le reçu du commit 6d67dd6 ; aucun code Python modifié dans cette passe.

## Preuves et limites
Reçus hors dépôt : outputs/POLY_CLASSIC_MATERIAL_STATE_RESULTS_20261029.json et outputs/POLY_CLASSIC_BONE_VISIBILITY_PROBE_20261029.json. Journaux : work/classic-state-final.log et work/classic-state-node.log. Les délais et refus de connexion intermittents restent sans cause démontrée. La parité exhaustive, les mesures sur téléphone physique et la qualification scientifique restent ouvertes. Aucun changement de données source, recalage individuel, publication ou message externe.
