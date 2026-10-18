# POLY v0.53 — passe étendue sur récompense VTA

Six étapes enchaînées : axe/unité, extraction, quatre estimations, six contrastes appariés, ANOVA avec correction GG, puis admissibilité de comparaison S10. Aucun nouveau modèle biologique.

## Estimations indépendantes, dans leur portée

| Repère après US | Moyenne ms | SEM ms | IC95 conditionnel ms |
|---|---:|---:|---|
| force_reversal | 78.08 | 18.52 | [30.47 ; 125.70] |
| peak_DA_firing | 110.26 | 9.77 | [85.15 ; 135.37] |
| peak_lick_rate_change | 158.50 | 9.00 | [135.36 ; 181.64] |
| peak_force_change | 232.48 | 12.22 | [201.06 ; 263.90] |

24 valeurs de Fig9i, six lignes : n=6 souris selon légende. L'identité des souris n'est pas inscrite dans le classeur ; les paires suivent les lignes de la source. Les IC t à cinq degrés de liberté supposent des lignes indépendantes et le modèle usuel ; ils ne quantifient pas l'erreur de commande→arrivée physique de récompense ni le binning. Le pic de population neuronale par souris reste distinct du pic moyen de chaque neurone.

La figure confirme les secondes, converties en ms ; la méthode estime les signaux par intervalles entre événements et utilise des bins de 25 ms, avec affectation temporelle au milieu des intervalles pour le léchage. La précision des décimales exportées ne justifie pas une résolution physique submilliseconde. Une avance du pic neuronal sur un pic moteur ne prouve pas seule une causalité. [Source primaire, Fig9 et méthodes](https://www.nature.com/articles/s41467-025-64132-4).

## Vérification et limites

ANOVA recalculée F=44.495562, epsilon GG=0.523617, df corrigés=1.570850/7.854251. Concordance aux arrondis publiés : True. Les six t-tests appariés et leur Bonferroni à six comparaisons sont fournis comme analyses de cette passe ; ils ne sont pas présentés comme la procédure post-hoc originale sans preuve.

## Comparaison avec S10

Le pic VTA après récompense fournit enfin une estimation issue d'une étude indépendante. Il n'autorise pas une moyenne avec 67,6/95,4 ms : populations, agrégation neuronale versus souris, attente, apprentissage, état motivationnel, algorithme de pic et temps physique doivent correspondre. Les données S10 ne permettent pas encore une variance comparable. Aucun test entre ces études ni moyenne artificielle.

Faits : cellules et unité vérifiées. Calculs : descriptifs, IC conditionnels et ANOVA dans les conditions explicites. Hypothèses : causalité, lecture affective et transposition anatomique non établies. Baseline publique intacte ; résultats hors canon, quatre axes toujours ouverts. Suite : retrouver les détails/valeurs du pic S10 et les conditions de groupe, puis une comparaison restreinte admissible.
