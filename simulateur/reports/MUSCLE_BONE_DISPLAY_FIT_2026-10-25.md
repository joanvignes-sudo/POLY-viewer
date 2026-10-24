# POLY — Raccord d'échelle muscles / squelette (expérimental)

Version de travail : 2026-10-25 — **correspondance graphique seulement**.

## Périmètre

Les **458 surfaces musculaires du corps** et les **22 muscles de la main** déjà présents dans POLY sont conservés sans altérer leurs fichiers d'origine. Les 206 os du référentiel Z-Anatomy et les structures HRA conservent également leurs géométries. Une transformation d'affichage additionnelle est appliquée uniquement aux groupes musculaires et osseux BodyParts3D correspondants.

Ce correctif ne réalise **ni** segmentation anatomique unifiée **ni** recalage anatomique confirmé **ni** vérification d'enthèses. Le modèle des organes HRA n'est pas recalé ni modifié : il sert de contexte dans la scène commune.

## Méthode reproductible

1. Charger les surfaces de référence BodyParts3D du projet, avec leurs transformations manuelles historiques ; et les os Z-Anatomy déjà normalisés dans la scène POLY.
2. Lors de la comparaison en pose de repos, utiliser pour humérus et radius/ulna les transformations graphiques de posture déjà utilisées par `avatar-bones.js`.
3. Appairer les os homologues selon leur **identité documentée** (et leur côté), sans déduire de nouvelle identité des distances spatiales.
4. Extraire pour chaque os appairé le centre de sa boîte englobante et son étendue maximale, deux **repères géométriques** et non des repères anatomiques mesurés.
5. Pour les six groupes par côté — épaule/bras, avant-bras, cuisse, jambe, pied, main — calculer une transformation **isotrope** unique :

`p_corrigé = centre_cible + échelle × (p_source − centre_source)`

L'échelle est la médiane des rapports d'étendue maximale des os appairés, bornée à [0,80 ; 1,25]. Aucun cisaillement ni aucune torsion n'est ajouté. Les muscles et leurs os BodyParts3D partagent la correction appropriée à leur groupe.

## Résultats numériques sur les seuls repères d'affichage

| Groupe | Os appariés (par côté) | Échelle droite / gauche | Erreur quadratique moyenne des centres avant → après (droite / gauche) |
|---|---:|---:|---|
| Épaule et bras | 3 | 1,1457 / 1,1458 | 0,0741 → 0,0439 / 0,0761 → 0,0451 |
| Avant-bras | 2 | 1,1452 / 1,1439 | 0,1121 → 0,0026 / 0,1117 → 0,0035 |
| Cuisse | 1 | 0,8821 / 0,8816 | 0,1516 → 0 / 0,1467 → 0 |
| Jambe | 2 | 0,8534 / 0,8530 | 0,0779 → 0,0044 / 0,0673 → 0,0041 |
| Pied | 26 | 0,9539 / 0,9520 | 0,1408 → 0,0287 / 0,1222 → 0,0271 |
| Main | 27 | 1,1788 / 1,1709 | 0,1797 → 0,0215 / 0,1792 → 0,0213 |

Unité : **unité d'affichage POLY**, non mm ni cm. Pour une cuisse appariée à un seul fémur, l'erreur du centre devient nécessairement zéro par construction et **n'est pas une preuve** de correspondance anatomique. Les autres erreurs sont des erreurs sur les centres de boîtes, et non des erreurs de surface ou d'insertion.

## Limites et contrôles

- **Tronc et latéralités indéterminées : inchangés**, faute de repères squelettiques homologues défendables pour ces régions.
- Une correction par région peut laisser des discontinuités graphiques près des articulations ; l'absence de dynamique musculotendineuse persiste.
- Il subsiste des écarts liés à des individus sources, poses, définitions de surface et volumes différents. L'absence d'intersection visuelle ne validerait pas une relation biologique.
- Le fichier de calibration garde les 122 paires osseuses **réparties entre groupes**, leur nombre, l'échelle et les résidus. Chaque os de main/pied n'est apparié qu'une fois par côté dans son groupe ; certains noms apparaissent dans plusieurs sources séparées.
- Les programmes de calcul, les graphes nerveux, les organes et les mesures empiriques ne sont pas changés.
- Pour vérifier le rendu précédent : charger la page avec `?muscle-fit=source`. Cela désactive la correction supplémentaire sans modifier le fichier de données.
- Les étapes suivantes vers la précision anatomique exigent des annotations de repères sur les mêmes structures (origine, insertion, tendons), et une validation indépendante des transformations avec leurs résidus par région.

## Fichiers

- `simulateur/data/muscle-bone-display-calibration.json` : transformations versionnées, provenance et limites.
- `simulateur/web/muscle-display-fit.mjs` : application géométrique et sélection des régions.
- `simulateur/tests/test_muscle_display_fit.py` : invariants de sécurité, réversibilité et traçabilité.
