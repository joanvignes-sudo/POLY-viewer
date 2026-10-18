# POLY v0.107 · Échelles et mesures

Contrôle du 13 octobre 2026. Programme entre échelles : nerf vague humain, SPARC 674 v1, DOI 10.26275/imas-52lf.

## Données contrôlées

136 TIFF : deux champs × 17 plans × quatre exports. Empreinte originale vérifiée avant extraction du XML embarqué. Calibration décodée identique : 150.97671666666668. Les produits largeur × calibration et hauteur × calibration retrouvent les étendues XY source à moins d’une unité source. Même contrôle sur les métadonnées des deux montages. Dans les huit séries champ × canal, XY reste fixe et Z diminue de 1000 unités source entre plans. Pitch GCI : 10 ; 17 plans déclarés.

## Interprétation et limites

Le facteur est cohérent comme unités source/pixel. L’interprétation en nm/pixel donne 0.15097671666666668 µm/pixel et un champ de 144.937648 × 108.703236 µm. Cela concorde avec les valeurs arrondies 145 × 109 µm de la fiche KEYENCE BZ-PA100 et les caractéristiques de l’objectif inscrit au XML (100×, NA 1.45, huile, WD 0.13 mm). C’est une hypothèse nominale, pas une confirmation de l’unité propriétaire ni un étalonnage métrologique de cette acquisition. Aucun µm/pixel ou pas Z physique n’est appliqué au lecteur. Source constructeur : https://www.keyence.com/products/microscope/fluorescence-microscope/bz-x700/models/bz-pa100/ (consultée le 13 octobre 2026).

## Lecteur

Règles en pixels natifs, mesure entre centres de deux pixels, repères synchronisés sur champ / montage / superposition. Coordonnées à partir de zéro. Repères XY conservés lors d’un changement de plan sans prétendre une identité biologique. Pose par clic, entrée au centre du cadrage, ou champs numériques. Partage avec points et export JSON avec plan, coordonnées, distance, images, empreintes et portée de la correspondance. Zoom, gain et transparence n’affectent pas la mesure.

Les trois métadonnées du raccord sont vérifiées par empreinte à la lecture ; les trois images de contexte sont réutilisées lors d’un changement de plan, plutôt que téléchargées de nouveau. Les pixels originaux restent inchangés.

## Suite

Confirmer les unités auprès de la documentation de format ou de l’équipe d’acquisition, et obtenir si possible un export calibré. Le raccord C1 vers C10 et le modèle anatomique exigera des repères spatiaux supplémentaires. Aucune chaîne biologique nouvelle, activité ou reconstruction 3D n’est créée par ce travail.
