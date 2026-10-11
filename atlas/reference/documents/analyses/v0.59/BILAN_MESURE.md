# POLY v0.59 — pipelines et identité des cellules

Six traitements sont reliés à leur signal, résultat et raisons de manque. La dérivée de force est lissée à 12 bins de 1 ms; ce paramètre n’est pas une latence. Le lag de corrélation et la courbe de consommation ont des traitements distincts. S15 sépare son PSTH visualisé et les z-scores non filtrés du bootstrap. Aucune soustraction forfaitaire de filtre, aucun délai au millième déduit des décimales. [Bakhurin, méthodes](https://www.nature.com/articles/s41467-025-64132-4), [Hsueh, méthodes](https://www.nature.com/articles/s41586-023-05748-8), [Eshel, méthodes](https://www.nature.com/articles/nature14855).

L’identification optique a ses propres critères : seuil de probabilité 0,7 et latence ≤7 ms. Ce sont des critères de sélection, pas une moyenne de réponse à la récompense. Le supplément et sa figure ont été lus et inspectés. [Supplément, p.2](https://media.springernature.com/original/springer-static/esm/art%3A10.1038%2Fs41467-025-64132-4/MediaObjects/41467_2025_64132_MOESM1_ESM.pdf).

985 valeurs SFig2e sont référencées : 98 Tagged, 887 Untagged. Les 98 Tagged satisfont le seuil de 7 ms; les zéros publiés restent zéros d’horodatage d’origine non clarifiée, sans supposer une réponse biologique instantanée. Leur distribution est conditionnée par la sélection; elle ne doit pas servir de distribution non sélectionnée de latence naturelle.

La feuille SFig2g contient une série de similarité d’ondes, dont le nombre et les bornes sont enregistrés. Le titre de colonne Rsqd et l’axe R² diffèrent de la désignation de coefficients de Pearson dans la légende; aucune conversion ou jointure par rang avec les 98 latences n’est imposée. L’écart de nombre reste expliqué comme mapping non fourni. Ce n’est pas une preuve d’erreur auteur.

S10 utilise SALT et des critères de waveform propres; le statut des cellules dans Fig9i ou Fig3f ne se reconstruit pas depuis le seul total de neurones identifiés optiquement. Métadonnées par neurone toujours requises. Toute identité supposée demeure explicitement non établie.

Le formulaire de reporting, daté de juin 2023, déclare pas d’exclusion et pas d’aveugle. Cela ne résout pas automatiquement les sélections et dénominateurs des figures finales de 2025. Version et portée sont conservées, sans remplacer les définitions du papier final ni accuser de contradiction.

Recherche hors canon, aucune nouvelle conception ni rapprochement émotion/conscience. Baseline non éditée, quatre axes ouverts, NHANES non répété. Suite : temps onset/confirmation, règles exactes de pics, calibration, traitement non-réponses et mapping neuronal.
