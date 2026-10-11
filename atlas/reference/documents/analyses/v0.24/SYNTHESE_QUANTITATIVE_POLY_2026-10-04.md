# POLY — première synthèse quantitative des comparaisons

Passe du 4 octobre 2026, recherche v0.24. Résultats exploratoires, séparés de la baseline publique v0.22.

## Ce qui est calculé

Audit des 12 chaînes: 105 fiches de quantité, 35 affichages numériques (dont des vitesses, constantes et horaires de prélèvement), 12 valeurs avec ±. Cinq contrastes temporels descriptifs. Comparaisons numériques issues de onze ressources de la nouvelle collecte: Norvège, Royaume-Uni, Canada, France, Japon, Australie, Nouvelle-Zélande, WHR, Eurostat, Afrobarometer et NHANES. Les corpus sans données acquises ne reçoivent aucun résultat inventé.

## Intervalles biologiques: les moyennes existent déjà à l’intérieur des expériences

Le registre contient des moyennes expérimentales publiées, mais pas assez de séries indépendantes et compatibles pour une moyenne pondérée entre études. Les bornes de plages ne sont pas des répétitions expérimentales et leur milieu n’est pas une moyenne mesurée. Les temps d’échantillonnage et les constantes cinétiques restent distincts des latences.

| Comparaison | Première moyenne publiée | Seconde moyenne publiée | Différence des estimations |
|---|---:|---:|---:|
| C07 · soma · NL1 - GluA1 | 41.5 min | 50.0 min | +8.5 min |
| C07 · proximal · NL1 - GluA1 | 46.9 min | 52.8 min | +5.9 min |
| C07 · distal · NL1 - GluA1 | 50.9 min | 66.6 min | +15.7 min |
| C08 · Na peak · soma - dendrite | 1.0 s | 7.8 s | +6.8 s |
| C08 · ATP nadir · soma - dendrite | 6.2 s | 47.0 s | +40.8 s |

C07: photolibération dans le réticulum → seuil de 10 % du signal final de surface. Le contraste NL1/GluA1 dépend du compartiment et ne représente pas toute la synthèse d’une protéine. [Bourke et al., 2021](https://doi.org/10.1083/jcb.202103186).

C08: compartiments, indicateurs et préparations à conserver. Na et ATP ne sont pas co-enregistrés dans une même cellule pour ces séries. Aucun délai causal Na→ATP ni temps spécifique de pompe n’est déduit. La source donne aussi des médianes et plages; les unités cellulaires sont imbriquées dans les préparations. [Gerkau et al., 2019](https://juser.fz-juelich.de/record/874176/files/Gerkau_et_al-2019-The_Journal_of_Physiology.pdf).

![Contrastes temporels](COMPARAISONS_POLY_2026-10-04/CONTRASTES_TEMPORELS_C07_C08.png)

Q01 demeure 0,15 ms pour l’intervalle global E08→E11; aucune fraction de ce temps n’est affectée à ses sous-étapes. Les erreurs ± conservées ne deviennent pas automatiquement des IC de différence. Aucune moyenne globale des 35 valeurs numériques n’est produite.

## Affect et séries de population

Norvège, 2020–2025, total 18+: moyenne arithmétique des six estimations annuelles de part à affect positif dominant **80,28 %**, plage **79,5–82,1 %**. Pour le score d’affect −10 à +10: moyenne des années **3,07**, plage **2,9–3,3**. C’est un résumé temporel des enquêtes, pas une méta-analyse ni un score universel. [Statistics Norway, table 13800](https://www.ssb.no/en/statbank/table/13800).

Royaume-Uni, douze périodes 2011–12 à 2022–23: chaque question est conservée séparément avec ses bornes publiées.

| Question | Moyenne des estimations annuelles | Plage observée |
|---|---:|---:|
| Anxiety | 3.015 | 2.86–3.31 |
| Happiness | 7.428 | 7.29–7.56 |
| Life satisfaction | 7.564 | 7.39–7.71 |
| Worthwhile | 7.789 | 7.67–7.89 |

La moyenne temporelle ne reçoit pas d’IC obtenu en moyennant les bornes. L’éventuelle dépendance entre vagues n’est pas estimée. [ONS, série v4](https://www.ons.gov.uk/datasets/wellbeing-local-authority/editions/time-series/versions/4).

![Séries affectives](COMPARAISONS_POLY_2026-10-04/SERIES_AFFECT_NORVEGE_UK.png)

Canada: seize dates de satisfaction moyenne, total tous genres, hors territoires, avec IC auteurs conservés. France: quatre années 2022–2025; Japon: huit années 2019–2026; Australie: quatre vagues 2014/2019/2020/2025; Nouvelle-Zélande: terrain mai 2023–avril 2024. Les dernières estimations acquises sont présentées côte à côte, sans moyenne entre instruments.

| Source nationale | Dernière période extraite | Score moyen publié |
|---|---|---:|
| France hors Mayotte | 2025 | 7.20 |
| Japan | 2026 | 5.86 |
| Australia | 2025 | 7.10 |
| New Zealand | May 2023–April 2024 | 7.60 |

Le fichier `SATISFACTION_SERIES_NATIONALES_SEPAREES.csv` donne source, feuille/cellule, période et champ de chaque observation. Les définitions différentes de faibles/fortes satisfactions ne sont pas harmonisées arbitrairement. ASE arrondi à zéro en Nouvelle-Zélande ne signifie pas incertitude nulle. Les tables australiennes comportent une perturbation de confidentialité. Références complètes dans le registre MONDE_*.

## Comparaison mondiale et européenne

WHR édition 2026: **147 pays** pour l’étiquette 2025, et **168 pays distincts** dans le fichier historique. Moyenne non pondérée entre pays: **5.650**, médiane **5.937**. Ce n’est pas une moyenne mondiale des personnes. Les 147 variations avec l’année précédente portent sur des fenêtres de trois années qui se recouvrent. IC originaux conservés, aucune causalité attribuée aux contributions explicatives. [WHR, partage des données](https://www.worldhappiness.report/data-sharing/).

Eurostat: **43,680 cellules** dépliées, dont 36,618 non manquantes. Filtre commun satisfaction de vie, 16+, tous sexes et niveaux d’éducation: **234 cellules nationales**, **37 géographies**. Dernière année 2025: 30 géographies avec donnée. **33 comparaisons 2023–2024** sur une même définition de dimensions. Les agrégats EU/EA sont séparés et les drapeaux source conservés. [Eurostat, ilc_pw01](https://ec.europa.eu/eurostat/databrowser/view/ilc_pw01/default/table?lang=en).

## Afrique: mesures de contexte plutôt qu’un score générique d’émotion

Afrobarometer Round 9: **53,444 réponses, 421 variables, 39 pays**. **156 proportions par pays** calculées sur quatre questions: insécurité à pied, peur du crime chez soi, confiance dans les autres citoyens, aide perçue pour difficultés mentales/émotionnelles. Valeurs spéciales exclues et effectifs manquants conservés.

Pondération principale `withinwt_hh`, sensibilité avec `withinwt_ea`. L’écart maximal entre les deux pondérations sur ces indicateurs est **3.35 points de pourcentage**. Cela montre que le choix des poids compte. Aucun IC de sondage ni classement continental n’est fabriqué. [Codebook officiel Round 9](https://www.afrobarometer.org/wp-content/uploads/2025/07/AB_R9.MergeCodebook_25Jun24.final_.pdf).

## NHANES: association sommeil/symptômes et contrôles

6,337 adultes dans la jointure 1:1; 5,455 ont neuf réponses valides; 882 sont exclus pour score incomplet/invalide, puis 54 pour sommeil manquant. Analyse finale du sommeil: **5 401 adultes**. Le score porte sur les symptômes des deux dernières semaines, pas sur une émotion ponctuelle. [Codebook DPQ](https://wwwn.cdc.gov/Nchs/Data/Nhanes/Public/2021/DataFiles/DPQ_L.htm).

| Sommeil jours ouvrés | Effectif complet | Score 9 items pondéré | IC 95 % approximatif du plan |
|---|---:|---:|---|
| <7 h | 1120 | 5.00 | 4.55–5.45 |
| 7–9 h | 3692 | 3.52 | 3.30–3.74 |
| >9 h | 589 | 5.44 | 4.88–5.99 |

Strates/PSU et poids MEC pris en compte par linéarisation de Taylor: 15 strates, 30 unités primaires, 15 degrés de liberté. Les 8 860 observations MEC à poids positif sont conservées pour définir le plan, y compris hors domaine. Vérification par deux formulations des variances de moyenne et invariance à la multiplication des poids. Implémentation locale; réplication dans un logiciel d’enquête indépendant encore à faire. [CDC, estimation de variance](https://wwwn.cdc.gov/nchs/nhanes/tutorials/varianceestimation.aspx).

Sensibilité exploratoire ajoutée après les premiers descriptifs: âge linéaire/quadratique et sexe enregistré. Référence 7–9 h.

| Score | Groupe de sommeil | Différence ajustée | IC 95 % approximatif |
|---|---|---:|---|
| 9 items | <7 h versus 7–9 h | +1.61 | 1.23–2.00 |
| 9 items | >9 h versus 7–9 h | +1.74 | 1.17–2.31 |
| 8 items sans sommeil | <7 h versus 7–9 h | +1.27 | 0.93–1.62 |
| 8 items sans sommeil | >9 h versus 7–9 h | +1.46 | 0.96–1.95 |

L’association persiste dans ces contrôles limités et sans l’item sommeil. Elle n’établit ni causalité, ni direction, ni élimination des facteurs sociaux/médicaux et de non-réponse. L’analyse sur cas complets change la population effectivement représentée. Aucun diagnostic individuel n’est attribué. [Définition du sommeil SLQ](https://wwwn.cdc.gov/Nchs/Data/Nhanes/Public/2021/DataFiles/SLQ_L.htm).

![Contrôles NHANES](COMPARAISONS_POLY_2026-10-04/NHANES_SOMMEIL_CONTROLES.png)

## Faits, modèles et hypothèses

Faits: valeurs des sources et calculs reproductibles décrits ici. Modèles: régression exploratoire NHANES et estimateurs d’enquête, avec leurs hypothèses explicites. Questions méthodologiques ouvertes: invariance des questionnaires entre langues, biais de sélection, structure imbriquée des mesures cellulaires, covariances entre vagues. Hypothèses POLY: considérer le compartiment, le contexte et l’état corporel comme conditions à tester; aucun mécanisme émotionnel n’est déclaré établi par ces associations. Aucun rapprochement avec la conscience.

## Ce qui reste nécessaire

Pour une moyenne des délais entre études: extraire plusieurs observations indépendantes du même intervalle, vérifier début/fin, espèces, température, protocole, n, SD/SEM et covariances. Les résultats actuels ne justifient pas cette moyenne interétudes. Pour les enquêtes: audit des formulations et champs, contrôles des drapeaux Eurostat, réplication des IC NHANES, analyses de non-réponse et covariables supplémentaires. Pour les corpus expérimentaux: CASE/DENS et autres fichiers non encore acquis restent à récupérer. Les quatre premiers axes sont toujours ouverts, conception non démarrée.

## Fichiers et reproduction

Les tables dérivées, figures et résultats sont dans `COMPARAISONS_POLY_2026-10-04/`. Protocoles et amendement accompagnent la passe. Les scripts et empreintes sont conservés dans le chantier. Le parseur ReadStat préserve correctement les zéros XPORT, contrôlés contre le codebook; le défaut du parseur pandas dans cet environnement est documenté dans l’amendement.