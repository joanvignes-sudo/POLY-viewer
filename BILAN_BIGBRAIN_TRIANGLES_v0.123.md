# POLY v0.123 · Contrôler le maillage entre les sommets

[Localiser les facettes signalées](microstructures.html?bbframe=mni&meshcheck=1&v=0.123).

Les contrôles de la v0.122 portaient sur les sommets affichés. Cette étape examine **le centre barycentrique de chacun des 693 293 triangles** des 23 maillages. Les données et les positions sources ne sont pas modifiées.

## Résultats

- Aucun déterminant de la transformation complète nul ou négatif aux centres contrôlés ; minimum d’environ 0,191, maximum de 13,011.
- Écart entre le centre réellement transformé et le centre du triangle plan affiché : médiane 0,015737 mm, 95e percentile 0,060518 mm, maximum 0,592253 mm.
- 86 triangles présentent des normales opposées : 41 sur le contexte cortical gauche et 45 sur le droit. Aucun cas n’est identifié dans les petits échantillons de couches.
- Aucune normale dégénérée dans cette comparaison.

Le contrôle d’orientation compare la normale du triangle affiché à celle obtenue en transformant la normale source par le cofacteur de la matrice locale de dérivation. Un produit scalaire nul ou négatif signale une facette à examiner. Cela ne prouve ni une anomalie biologique ni une auto-intersection globale du modèle. Le champ peut avoir un déterminant positif au centre tandis que le triangle plan utilisé pour le représenter présente un écart d’orientation.

Les facettes restent visibles dans leur géométrie originale. Le volet de diagnostic les surligne en corail et permet de choisir un triangle, de zoomer dessus et de revenir à sa position native. Les surlignages passent devant les enveloppes pour les localiser ; ils ne représentent pas une nouvelle structure anatomique. La vue des repères AFIDs et celle des facettes sont séparées pour éviter de mélanger leurs significations.

## Masques source

Les deux masques PLoSBiology2020 ont été acquis avec empreintes et contrôle du nombre de sommets. Parmi les 86 cas, cinq touchent un sommet marqué zéro ; 81 ont leurs trois sommets dans le masque d’analyse. Ces masques ne constituent pas une validation manuelle de chaque triangle et ne justifient pas une suppression automatique des cas signalés.

## Méthode et contrôle numérique

Le centre de chaque triangle est calculé dans le repère natif. Les cinq étapes publiées de 2015 et 2019 sont appliquées à ce point ; les dérivées analytiques Catmull-Rom sont composées dans les coordonnées physiques. La position obtenue est comparée à la moyenne des trois positions recalées stockées en float32, qui définit le centre du triangle rendu.

L’écart mesure donc une approximation numérique de l’affichage, incluant l’arrondi des sommets float32. Il ne mesure pas une erreur anatomique. Les sommets déjà publiés restent inchangés. Les dérivées ont été vérifiées par différences centrées sur 64 centres indépendamment du calcul analytique.

Chaque triangle dispose d’un enregistrement de trois valeurs float32 : déterminant, écart en millimètres et cosinus d’orientation, dans l’ordre des maillages puis des triangles sources. Le fichier lourd est téléchargeable, sans être chargé pour ouvrir le diagnostic. Les 86 cas signalés disposent de leurs indices, coordonnées natives et recalées, valeurs de contrôle et valeurs du masque source. Les douze plus grands écarts d’approximation sont également conservés.

## Portée

Un point intérieur par triangle ne certifie pas tout son intérieur, ses arêtes ni le volume environnant. Aucun contrôle complet des auto-intersections n’est revendiqué. Les statistiques ne sont pas pondérées par surface ou volume et incluent les triangles d’échantillons qui peuvent recouvrir le contexte.

Ces mesures restent distinctes des écarts AFIDs et ne fournissent aucune activité neuronale, latence ou correspondance individuelle avec H01, Allen, P8 ou les organes. L’examen des facettes signalées et la validation anatomique indépendante restent ouverts.

## Sources

[Provenance et empreintes](assets/bigbrain-triangles-v0123/PROVENANCE.json) · [86 facettes et coordonnées](assets/bigbrain-triangles-v0123/FLAGGED.json) · [Mesures par triangle](assets/bigbrain-triangles-v0123/metrics.bin).

La géométrie et les transformations proviennent des mêmes sources BigBrain/Xiao que la [v0.121](assets/bigbrain-warp-v0121/PROVENANCE.json). Les masques sont ceux du répertoire officiel [PLoSBiology2020](https://ftp.bigbrainproject.org/bigbrain-ftp/BigBrainRelease.2015/Layer_Segmentation/3D_Surfaces/PLoSBiology2020/). Les dérivés BigBrain conservent CC BY-NC-SA 4.0, leurs crédits et les conditions originales des transformations.
