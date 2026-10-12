# POLY v0.102 · Immunohistochimie humaine

## Données intégrées

Dataset SPARC 674 v1, DOI 10.26275/imas-52lf, sub-f002/2305, femme de 88 ans, nerf gauche, C1-A-Level 2, deux parties. Les aperçus JPEG proviennent directement des KTF ; six fenêtres natives de 2048×2048 pixels RGB uint8 sont extraites des TIFF à des origines documentées, sans interpolation ni modification des valeurs. Les fichiers .tif et .tiff sont deux entrées d’export de même taille ; seul .tif est acquis par plages ciblées, sans dupliquer les téléchargements. Les blocs lus, offsets, versions et SHA256 sont conservés.

## Marqueurs et couleurs

Les GCI associés nomment Channel0 GFP-NF en vert, Channel1 CY3-ChAT en bleu, Channel3 CY5-MBP en rouge ; Channel2 non acquis. Les contrôles masquent des composantes RGB du composite exporté. Ils ne reconstituent pas les canaux bruts ni un signal quantitativement calibré. Aucune classification de fibres ou déduction fonctionnelle n’est ajoutée. Le protocole déclare NF, MBP et ChAT ; TH est écarté par les auteurs à cause du signal faible/non fiable.

## Précision et limites

L’épaisseur de section 5 µm est indiquée dans samples.xlsx et le protocole. Ce n’est ni le pas XY ni le pouvoir résolvant optique. Les TIFF n’offrent que 72 dpi d’impression. Le champ Calibration KTF/GCI encode un double IEEE754 de 150.97671666666668 ; les dimensions de platine sont cohérentes numériquement avec ce facteur, mais les unités ne sont pas explicites dans les champs inspectés. POLY conserve la valeur et ne l’appelle pas µm/pixel ; aucune règle physique n’est affichée. Les mesures sont des distances en pixels natifs, sans incertitude biologique attribuée.

Level 2 reste une étiquette source. La table indique distance du haut 1 cm, non réconciliée avec les niveaux de 1000 µm et sous-segments de 0,5 cm du protocole : aucune position longitudinale n’est calculée. Même donneuse que C10 mais autre segment ; aucun raccord de cette coupe au volume C10 ou au scaffold n’est attribué sans transformation vérifiée.

## Suite

Établir l’unité et la convention de calibration Keyence, retrouver les canaux natifs séparés et les paramètres/contrôles de coloration, vérifier le positionnement dans C1 et poursuivre les essais avec spécialistes. Version exacte de la licence Creative Commons Attribution non précisée dans les métadonnées de la source.
