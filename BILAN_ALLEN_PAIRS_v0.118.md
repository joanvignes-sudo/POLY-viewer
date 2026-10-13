# Comparer deux essais Allen existants · v0.118

Deux enregistrements choisis parmi les neuf essais déjà acquis. La comparaison réutilise les séries originales, les instants détectés Allen et les indicateurs expérimentaux publiés. Aucune nouvelle acquisition, détection ou prédiction combinée. Neuf choix A × neuf choix B = 81 paires ordonnées, dont neuf choix du même essai deux fois ; ces derniers ne sont pas des répétitions indépendantes.

Les deux graphiques utilisent les mêmes bornes de tension en mV et de courant en pA, déterminées sur leurs fenêtres complètes et arrondies vers l’extérieur. Les amplitudes ne sont pas normalisées. L’enveloppe min/max d’affichage conserve les extrêmes par colonne, sans modifier les séries sources.

Deux repères temporels : temps depuis le début de chaque série NWB ; temps relatif au début de chaque impulsion. Le second soustrait le début de stimulation à l’affichage et aux marqueurs, sans déplacer ou réécrire les échantillons. Ces essais ont été enregistrés séparément ; leur alignement visuel ne constitue pas une acquisition simultanée ou une mesure d’interaction entre cellules.

Le curseur commun lit l’échantillon source le plus proche de chaque instant demandé. Temps source, index dans la fenêtre, index NWB, tension et courant restent exportables. Les détections sources sont accessibles individuellement. Un instant hors d’une fenêtre ne reçoit pas de valeur fabriquée. Les neuf enregistrements actuels ont des fenêtres et grilles temporelles compatibles ; aucun rééchantillonnage n’est effectué.

Les légendes conservent cellule, donneur, région, couche, numéro d’essai, intensité et indicateurs avant/après. Même essai, même cellule avec deux essais, cellules du même donneur et cellules de donneurs différents sont explicitement distingués. La sélection actuelle n’est pas une cohorte appariée et ne permet pas d’attribuer une différence à une seule cause.

Interface dans la page existante des neurones : panneau ouvert à la demande, prise de l’essai affiché comme A, échange A/B, lecture commune, partage conservant les choix et l’instant, export des traces originales et sources. Les enregistrements sont dédupliqués dans l’export si A = B. Au plus deux enregistrements sont retenus par le comparateur ; les requêtes dépassées ne remplacent pas une sélection plus récente. Les données sont chargées à l’ouverture ; la lecture s’arrête à la fermeture ou lorsque la page devient invisible.

Contrôles : 81 paires comparées à des bornes calculées séparément en Python ; objets de trace comparés aux JSON sources ; index et valeurs de lecture vérifiés ; passage entre repères temporels, choix du même essai, détections, partage, export, changements rapides, mobile, repli sans 3D et reprise après erreur vérifiés.

[Provenance et empreintes des entrées](assets/allen-pairs/PROVENANCE.json) · [Méthodes des neuf enregistrements](BILAN_ALLEN_v0.116.md) · [Indicateurs expérimentaux](BILAN_ALLEN_QC_v0.117.md) · [Crédits Allen](assets/neurons/CREDITS.txt). Les fichiers scientifiques et les séries précédemment publiés restent inchangés.
