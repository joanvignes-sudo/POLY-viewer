# POLY émotionnel v0.19 — trois audits liés

4 octobre 2026. Trois contrôles approfondis dans cette passe ; aucun nouvel ajustement, aucune réparation de données ni nouvelle conception. Les premières étapes restent ouvertes et le socle v0.22 demeure séparé.

## 1. Étendue des anomalies DR11

Les sept CSon retournant en arrière ont été comparés aux fins d'essai, temps de récompense et léchages du même essai. Les valeurs scalaires examinées sont correctement lisibles ; les incohérences ne proviennent pas d'une conversion flottante non finie de CSon dans cet audit. Le type int64 rapporté est celui exposé par notre lecture SciPy, pas une certification du type enregistré sur le matériel.

Sur plusieurs essais, CSon est de quelques dizaines ou centaines de milliers d'unités exportées, alors que la fin, la récompense et la plupart des léchages sont autour de deux à quatre millions. Exemple à l'indice CSplus 21 : CSon=201 021, premier léchage gauche=2 010 990, rewardTime=2 010 991, trialEnd=2 019 129. Ces écarts ne sont pas corrigés en ajoutant des chiffres ou en multipliant arbitrairement les timestamps.

Un autre essai comporte aussi des léchages à des amplitudes temporelles très différentes. Le problème ne peut donc pas être réduit sans preuve à une unique correction globale de CSon. L'absence de rewardTime sur un autre essai reste enregistrée, sans devenir zéro.

Les sept indices temporels anormaux **ne recouvrent aucun des dix indices à probabilités vides**. Ce sont deux problèmes distincts de cette session ; éliminer seulement les probabilités manquantes ne sécurise pas les temps. Aucune suppression rétroactive ni réestimation n'est effectuée.

## 2. Séparation des données réservées et réutilisation des cohortes

Les 28 partitions sont contrôlées : quatre animaux neuronaux de foraging, et douze animaux chimiogénétiques avec deux conditions de test chacun. Pour chaque partition, aucun identifiant de session n'est partagé entre apprentissage et test ; toutes les dates de test sont strictement postérieures à la dernière session d'apprentissage retenue.

Cette validation porte sur identifiants et dates encodées dans les sessions. Elle ne résout pas les événements internes compromis de DR11 et ne valide pas les horloges physiques.

| Versions comparées | Sessions réutilisées | Sessions supplémentaires dans la seconde |
|---|---:|---:|
| v0.15 → v0.16 | 84 | 49 |
| v0.16 → v0.17 | 133 | 0 |
| v0.17 → v0.18 | 133 | 0 |

Les 49 supplémentaires v0.16 sont des sessions d'apprentissage déjà présentes dans le corpus, ajoutées au diagnostic ; pas de nouveaux animaux recrutés. Chaque fichier audité contient une seule ligne par animal+session. Répéter une analyse ou augmenter les agents simulés ne crée pas une réplication biologique indépendante.

## 3. Propagation des réserves

| Réserve | Calculs concernés | Conséquence actuelle |
|---|---|---|
| DR11, temps internes | Apprentissage conditionnel v0.14/v0.16 ; fenêtres nominales v0.17 | Les calculs sur l'ordre exporté restent traçables ; interprétation temporelle physique non validée |
| DR11, probabilités vides | Contrastes/calendriers qui nécessitent ces probabilités | Pas de calendrier inventé ; les modèles conditionnels ne les utilisent pas comme entrée |
| DR13, états hors domaine | Simulations v0.15 et agrégats incluant ces trajectoires | Interprétation maintenue en quarantaine ; sorties exactement reproduites v0.18 |
| Corpus réutilisé | Audits successifs v0.15–v0.18 | Approfondissement technique, pas réplications biologiques multiples |

La séparation apprentissage/test est passée, mais ne suffit pas à elle seule à passer les gates de mesure et d'interprétation. À l'inverse, un timestamp compromis ne démontre pas automatiquement que tous les choix et résultats de la session sont faux. Les réserves sont propagées selon les variables réellement utilisées, sans invalider arbitrairement tout le corpus.

## Ce qui est acquis dans cette passe

Les trois audits sont calculés, leurs partitions et exemples enregistrés. Les anomalies DR11 restent séparées, les cohortes réutilisées sont identifiées et les conséquences documentées. Aucun nouveau mécanisme émotionnel n'est validé ; les limites des bilans antérieurs restent visibles.

## Ce qui reste à fermer

Obtenir le mapping et la provenance des événements DR11 ; confirmer les journaux de session DR06 ; obtenir les conventions originales de mise à jour des modèles et résoudre le domaine DR13 ; compléter les horloges, calibrations et bruts des autres dossiers. Les sept demandes déjà envoyées ne sont pas dupliquées dans cette passe.

Les résultats, spécification, scripts et contrôles de conservation sont dans `analyses_emotionnel_v0.19`. Aucun changement des données sources ou du viewer.
